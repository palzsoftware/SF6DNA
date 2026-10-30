const FRAME = { startup:'startup_frame', active:'active_frame', recovery:'recovery_frame', onHit:'hit_frame', onBlock:'block_frame', damage:'damage' };
const TYPES = { NORMAL:'normal', AIR:'normal', UNIQUE:'unique', TARGET_COMBO:'target_combo', SPECIAL:'special', SUPER:'super_art', THROW:'throw', PARRY:'system', DRIVE_STEP:'system', F_DASH:'system', B_DASH:'system' };
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const text = value => typeof value === 'string' && value.trim() ? value : null;
function rawValue(value) { return typeof value === 'number' && Number.isFinite(value) ? String(value) : text(value); }
function state(value, exists) {
  if (!exists || value == null || value === '') return 'PENDING';
  if (typeof value === 'string' && /^(?:-|—|－|N\/A)$/.test(value.trim())) return 'OFFICIAL_NA';
  return rawValue(value) === null ? 'PENDING' : 'LOCAL_OFFICIAL_TXT_CANONICAL';
}
function sourceIdentityAgrees(record, identity) {
  const web = value => value == null ? '' : String(value).trim();
  const left=web(record.sourceWebId), right=web(identity.sourceWebId);
  if (left || right) return left === right;
  return identity.sourceRecordKey.includes(':sha:') && typeof record.sourceRecordSha256 === 'string' &&
    record.sourceRecordSha256.length > 0 && record.sourceRecordSha256 === identity.sourceRecordSha256;
}
function canonicalMove(move, identity, record, existingMove) {
  const raw = record.raw;
  const frame = { verificationStatus:existingMove?.frame?.verificationStatus ?? 'candidate_only' }, frameFieldStatus = {};
  const fieldProvenance = {};
  for (const [field, key] of Object.entries(FRAME)) {
    const value = own(raw,key) ? rawValue(raw[key]) : null;
    const prior = existingMove?.frame?.[field];
    const priorHasValue = (typeof prior === 'string' && prior.trim()) || (typeof prior === 'number' && Number.isFinite(prior));
    if (value === null && priorHasValue) {
      frame[field] = prior;
      if (existingMove.frameFieldStatus?.[field]) frameFieldStatus[field] = existingMove.frameFieldStatus[field];
      fieldProvenance[field] = 'EXISTING_VALUE_PRESERVED_TXT_BLANK';
    } else {
      frame[field] = value;
      frameFieldStatus[field] = state(raw[key],own(raw,key));
      fieldProvenance[field] = value === null ? 'TXT_PENDING' : 'OFFICIAL_TXT_CANONICAL';
    }
  }
  const commands = [];
  const commandProvenance = {};
  for (const [scheme,key,sortOrder] of [['classic','command',0],['modern','command_modern',1]]) {
    const value = own(raw,key) ? text(raw[key]) : null;
    if (value) {
      commands.push({ moveId:move.id, scheme, commandText:value, numericNotation:null, buttonNotation:null, conditionText:null, sortOrder });
      commandProvenance[scheme] = 'OFFICIAL_TXT_CANONICAL';
    } else {
      const previous = (existingMove?.commands ?? []).filter(row => row.moveId === move.id &&
        (String(row.scheme).toLowerCase().replaceAll('-','_') === scheme || String(row.scheme).toLowerCase().replaceAll('-','_').startsWith(scheme+'_')) &&
        [row.commandText,row.numericNotation,row.buttonNotation].some(v=>typeof v === 'string' && v.trim()));
      commands.push(...previous);
      commandProvenance[scheme] = previous.length ? 'EXISTING_INPUT_PRESERVED_TXT_BLANK' : 'TXT_NOT_PROVIDED';
    }
  }
  const modernAbsent = own(raw,'command_modern') && raw.command_modern === null;
  const projected = { ...move, name:raw.skill, moveType:TYPES[raw.type] ?? move.moveType,
    frame, frameFieldStatus, commands,
    ws5CanonicalSource:record.sourceRecordKey, ws5CanonicalFieldProvenance:fieldProvenance, ws5CanonicalCommandProvenance:commandProvenance,
    ws5OfficialMoveType:raw.type,
    ws5OfficialConditions:{ command:raw.command, commandModern:raw.command_modern, note:raw.note, comboCorrect:raw.combo_correct },
    ws5OfficialRawRecord:raw,
    ws5ModernInputState:modernAbsent && !commands.some(row=>String(row.scheme).toLowerCase().startsWith('modern')) ? 'OFFICIAL_NOT_LISTED' : 'PENDING',
    ws5ModernInputSource:record.sourceRecordKey };
  return projected;
}
/** Wrap the existing reviewed connector; only source precedence is changed.
 * Required scope comes from the server-side character resolution, never user query data.
 * Existing IDs/slugs, media, combos and automaticVideos remain outside this projection.
 * This local data decision grants no publication rights.
 */
export function connectCanonicalTxtCandidate(base, candidate, records, options = {}) {
  const { characterSlug, bundleCharacterSlug, characterId, connectExisting } = options;
  const pending = reason => ({ bundle:base, moveEvidence:{}, holds:[{reason}], mergedExisting:0, appended:0, releaseEligible:false, sourcePriorityChanges:[] });
  if (!characterSlug || characterSlug !== bundleCharacterSlug || characterSlug !== candidate?.characterSlug) return pending('CHARACTER_SCOPE_NOT_BOUND');
  if (typeof connectExisting !== 'function') return pending('EXISTING_CONNECTOR_NOT_SUPPLIED');
  const moves=[], holds=[], sourcePriorityChanges=[];
  const stagedMoves=[...(base?.moves ?? [])];
  for (const move of candidate.bundle.moves) {
    const identity=candidate.identityByMoveId[move.id];
    const record=records?.[identity?.sourceRecordKey];
    if (!identity || !record || record.characterSlug !== characterSlug || !record.sourceRecordKey.startsWith(characterSlug+':') ||
        !sourceIdentityAgrees(record, identity) || typeof record.raw?.skill !== 'string' || !record.raw.skill.trim()) {
      holds.push({sourceRecordKey:identity?.sourceRecordKey,reason:'CANONICAL_SOURCE_SCOPE_OR_ROW_MISSING'}); continue;
    }
    if (identity.identityState === 'HOLD_RYU_SCOPE') { holds.push({sourceRecordKey:identity.sourceRecordKey,reason:'HOLD_RYU_SCOPE'}); continue; }
    const indexes=stagedMoves.flatMap((row,i)=>row.id===move.id?[i]:[]);
    if (indexes.length>1) { holds.push({sourceRecordKey:identity.sourceRecordKey,reason:'BASE_HAS_DUPLICATE_MOVE_ID'}); continue; }
    const projected=canonicalMove(move,identity,record,indexes.length===1 ? stagedMoves[indexes[0]] : null);
    if(indexes.length===1){
      const index=indexes[0], original=stagedMoves[index];
      if(original.slug!==move.slug || (original.characterId && original.characterId!==characterId)) {
        holds.push({sourceRecordKey:identity.sourceRecordKey,reason:'EXISTING_ID_SCOPE_OR_SLUG_UNBOUND'}); continue;
      }
      // Preserve media and unrelated fields; archive replaced command routes, never infer them.
      const changed=['name','moveType','frame','commands'].filter(field=>JSON.stringify(original[field])!==JSON.stringify(projected[field]));
      if(changed.length) sourcePriorityChanges.push({id:original.id,sourceRecordKey:identity.sourceRecordKey,fields:changed,reason:'OFFICIAL_TXT_PRECEDENCE'});
      stagedMoves[index]={...original,name:projected.name,moveType:projected.moveType,frame:projected.frame,
        frameFieldStatus:projected.frameFieldStatus,commands:projected.commands,
        ws5CanonicalSource:projected.ws5CanonicalSource,ws5OfficialMoveType:projected.ws5OfficialMoveType,
        ws5CanonicalFieldProvenance:projected.ws5CanonicalFieldProvenance,ws5CanonicalCommandProvenance:projected.ws5CanonicalCommandProvenance,
        ws5OfficialConditions:projected.ws5OfficialConditions,ws5OfficialRawRecord:projected.ws5OfficialRawRecord,
        ws5ModernInputState:projected.ws5ModernInputState,ws5ModernInputSource:projected.ws5ModernInputSource,
        id:original.id,slug:original.slug,
        media:original.media, motionMediaPresentation:original.motionMediaPresentation,
        ws5PreviousCommands:original.commands ?? []};
    }
    moves.push(projected);
  }
  const stagedBase=base ? {...base,moves:stagedMoves} : null;
  const result=connectExisting(stagedBase,{...candidate,bundle:{...candidate.bundle,moves}});
  return {...result,holds:[...holds,...result.holds],releaseEligible:false,sourcePriorityChanges};
}
