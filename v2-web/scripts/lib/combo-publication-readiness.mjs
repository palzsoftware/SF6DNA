/** Offline classification only. Never changes a Combo's DB status or declares gameplay from renderer success. */
export const comboPublicationClasses = ['PUBLISHABLE', 'SOURCE_REQUIRED', 'GAME_VERIFICATION_REQUIRED', 'DATA_ERROR', 'DUPLICATE', 'HOLD'];
const placeholder = /Training verification required|現行技表を基準にTrainingで正確な入力順を確定する|候補。正確な入力順・強度はトレモで確定|要トレモ確認|正確な入力順.*確定/i;
const noteConflict = /candidate slot|placeholder|do not publish|awaiting.*(?:verification|training)|not (?:yet )?verified|unverified|verification (?:required|pending)|要トレモ|未検証|要実機|公開不可|未確認/i;
function validHttps(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function sourceReady(relation) {
  const source = relation.source ?? relation.sources;
  return source && validHttps(source.url) && Boolean(source.title?.trim()) && Boolean(source.publisher?.trim()) && relation.relationship !== 'candidate' && !noteConflict.test(relation.note ?? '') && (source.reliability_level ?? source.reliability) !== 'unverified';
}
function gameProof(row, currentPatchId) {
  // A general verification_status, verified frame row, source link or parser PASS is not reproduction proof.
  const evidence = row.game_verification;
  return evidence?.result === 'pass' && evidence.patch_id === currentPatchId && validHttps(evidence.recording_url) && Boolean(evidence.verified_by) && Boolean(evidence.verified_at);
}
export function classifyCombo(row, context) {
  const reasons = [];
  const reason = (code, category, detail) => reasons.push({ code, category, detail });
  const notation = typeof row.notation === 'string' ? row.notation : '';
  const tokens = context.tokenize(notation);
  const parserReady = tokens.map(token => token.raw).join('') === notation;
  const character = context.characters.get(row.character_id) ?? row.character_record;
  const patch = context.patches.get(row.valid_from_patch_id) ?? row.patch;
  const relations = context.sourcesByCombo.get(row.id) ?? row.source_relations ?? [];
  if (!row.id || !row.slug || !row.name?.trim()) reason('IDENTITY_INCOMPLETE', 'DATA_ERROR', 'ID / slug / name missing');
  if (!notation.trim()) reason('NOTATION_MISSING', 'DATA_ERROR', 'Exact input notation missing');
  if (!parserReady) reason('RAW_RECIPE_MISMATCH', 'DATA_ERROR', 'Tokenizer does not reconstruct original');
  for (const key of ['damage','drive_cost','sa_cost']) if (row[key] != null && (typeof row[key] !== 'number' || !Number.isFinite(row[key]) || row[key] < 0)) reason(`${key.toUpperCase()}_INVALID`, 'DATA_ERROR', 'Present numeric value must be finite and nonnegative');
  if (row.valid_to_patch_id != null) reason('PATCH_EXPIRED', 'HOLD', 'valid_to_patch_id is set');
  if (!patch || patch.is_current !== true) reason('CURRENT_PATCH_NOT_CONFIRMED', 'HOLD', 'valid_from patch is absent or not current');
  if (!character || character.status !== 'published' || character.is_playable !== true) reason('CHARACTER_PUBLIC_GATE', 'HOLD', 'Character is not a published playable entity');
  if (row.status === 'archived') reason('ARCHIVED_RECORD', 'HOLD', 'Archived row requires explicit recovery decision');
  if (placeholder.test(notation)) reason('PLACEHOLDER_RECIPE', 'GAME_VERIFICATION_REQUIRED', 'Placeholder input has no exact reproducible recipe');
  if (noteConflict.test(row.notes ?? '')) reason('NOTES_CONFLICT', 'GAME_VERIFICATION_REQUIRED', 'Notes explicitly indicate candidate / pending verification / publication prohibition');
  if (row.verification_status !== 'verified') reason('VERIFICATION_STATUS_NOT_VERIFIED', 'GAME_VERIFICATION_REQUIRED', `Existing status is ${row.verification_status ?? 'missing'}`);
  if (!gameProof(row, patch?.id)) reason('CURRENT_GAME_REPRODUCTION_NOT_DOCUMENTED', 'GAME_VERIFICATION_REQUIRED', 'No structured current-patch PASS recording, verifier and date in snapshot; verified status alone is insufficient');
  if (!relations.some(sourceReady)) reason('SOURCE_NOT_READY', 'SOURCE_REQUIRED', 'No resolved HTTPS source with title, publisher and noncandidate relationship');
  for (const key of ['position','conditions','starter_text']) if (!row[key]?.trim()) reason(`${key.toUpperCase()}_MISSING`, 'GAME_VERIFICATION_REQUIRED', 'Input context must be confirmed before publication');
  const duplicateTarget = row.duplicate_of;
  if (duplicateTarget && context.ids.has(duplicateTarget) && duplicateTarget !== row.id) reason('EXPLICIT_DUPLICATE_REFERENCE', 'DUPLICATE', `Explicit duplicate_of points to ${duplicateTarget}`);
  if ((context.duplicateCandidates.get(row.id) ?? []).length) reason('DUPLICATE_CANDIDATE_ONLY', 'HOLD_CANDIDATE', 'Same character and normalized notation; context/status/source may differ. Not a confirmed duplicate');
  const priority = ['DATA_ERROR','DUPLICATE','HOLD','SOURCE_REQUIRED','GAME_VERIFICATION_REQUIRED'];
  const classification = priority.find(category => reasons.some(item => item.category === category)) ?? 'PUBLISHABLE';
  return {
    id:row.id, slug:row.slug, character: character?.slug ?? row.character ?? row.character_slug ?? null,
    status:row.status, verification_status:row.verification_status, classification,
    primary_reason: reasons.find(item => item.category === classification) ?? { code:'EVIDENCE_COMPLETE', category:'PUBLISHABLE', detail:'Explicit current-patch reproduction, ready source, exact recipe and no conflicts' },
    secondary_reasons:reasons.filter(item => item !== reasons.find(item => item.category === classification)),
    checks: { parser_ready:parserReady, missing_optional_numeric:['damage','drive_cost','sa_cost'].filter(key=>row[key] == null), source_count:relations.length, ready_source_count:relations.filter(sourceReady).length, explicit_game_evidence:gameProof(row,patch?.id), ambiguous_tokens:tokens.filter(token=>token.type==='AMBIGUOUS').length, unknown_tokens:tokens.filter(token=>token.type==='TEXT').length, source_status:'READ_ONLY_NOT_APPLIED' },
    evidence: {
      notation, damage:row.damage ?? null, drive_cost:row.drive_cost ?? null, sa_cost:row.sa_cost ?? null,
      position:row.position ?? null, conditions:row.conditions ?? null, starter:row.starter_text ?? null,
      valid_from_patch_id:row.valid_from_patch_id ?? null, valid_to_patch_id:row.valid_to_patch_id ?? null,
      patch_current:patch?.is_current ?? null, notes_conflict:noteConflict.test(row.notes ?? ''), notes_excerpt:(row.notes ?? '').slice(0,160),
      step_count:(row.steps ?? context.stepsByCombo?.get(row.id))?.length ?? null,
      sources:relations.map(relation=>({source_id:relation.source_id ?? relation.source?.id ?? null, relationship:relation.relationship ?? null, metadata_ready:Boolean(sourceReady(relation))})),
    },
    duplicate_candidates:context.duplicateCandidates.get(row.id) ?? [],
  };
}
export function duplicateCandidateMap(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!row.notation?.trim()) continue;
    // Normalize whitespace/separators only; no move meaning, button strength or control-scheme equivalence inference.
    const key = `${row.character_id ?? row.character ?? row.character_slug}|${row.notation.trim().replace(/\s+/g,' ').replace(/[＞→]/g,'>')}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row.id);
  }
  const result = new Map();
  for (const ids of groups.values()) if (ids.length > 1) for (const id of ids) result.set(id, ids.filter(other=>other!==id));
  return result;
}
