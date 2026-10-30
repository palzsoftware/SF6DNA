import { officialTxtNoModernInputKeys } from "./official-txt-no-modern-input-keys.mjs";
import { exactOfficialTxtSourceKeys } from "./official-txt-exact-match-keys.mjs";
/**
 * R3 isolated CAPCOM TXT -> DevicePreviewBundle adapter.
 * Preview-only candidate. It never creates formal UUIDs or approves publication.
 */
const FRAME_FIELDS = Object.freeze({
  startup: ["startup_raw", "startup_state"],
  active: ["active_raw", "active_state"],
  recovery: ["recovery_raw", "recovery_state"],
  onHit: ["on_hit_raw", "on_hit_state"],
  onBlock: ["on_block_raw", "on_block_state"],
  damage: ["damage_raw", "damage_state"],
});

const MOVE_TYPES = Object.freeze({
  NORMAL: "normal", AIR: "normal", UNIQUE: "unique", TARGET_COMBO: "target_combo",
  SPECIAL: "special", SUPER: "super_art", THROW: "throw", PARRY: "system",
  DRIVE_STEP: "system", F_DASH: "system", B_DASH: "system",
});

const EXISTING_ID_STATES = new Set([
  "RYU_LATEST_ADOPT_CANDIDATE",
  "CANDIDATE_NAME_UNIQUE",
  "CANDIDATE_NAME_TYPE_COMMAND_UNIQUE",
  "CANDIDATE_SHARED_SOURCE_ROWS_SAME_FRAME",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMPTY_BUNDLE = () => ({ guideSections: [], moves: [], combos: [], setups: [], sequences: [], matchups: [], training: [] });

function stablePreviewId(characterSlug, sourceRecordKey) {
  return `sf6dna-preview:${encodeURIComponent(characterSlug)}:${encodeURIComponent(sourceRecordKey)}`;
}

function stablePreviewSlug(characterSlug, sourceRecordKey) {
  const key = String(sourceRecordKey).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `txt-${characterSlug}-${key || "unmapped"}`;
}

function displayState(rawState) {
  if (rawState === "OFFICIAL_NA") return "OFFICIAL_NA";
  if (rawState === "OFFICIAL_NOT_LISTED") return "OFFICIAL_NOT_LISTED";
  return "PENDING";
}

function frameValue(rawValue) {
  return typeof rawValue === "string" && rawValue.length > 0 ? rawValue : null;
}

function toMove(row, id, slug) {
  const frame = { startup: null, active: null, recovery: null, onHit: null, onBlock: null, damage: null,
    verificationStatus: "candidate_only" };
  const frameFieldStatus = {};
  const exactLocalTxtMatch = exactOfficialTxtSourceKeys.has(row.source_record_key);
  for (const [field, [valueKey, stateKey]] of Object.entries(FRAME_FIELDS)) {
    frame[field] = frameValue(row[valueKey]);
    const originalState = displayState(row[stateKey]);
    // Candidate numbers may be shown only in localhost development when the complete
    // source row exactly matches the 2026-10-23 official TXT. Nulls remain unclassified.
    frameFieldStatus[field] = exactLocalTxtMatch && frame[field] !== null && originalState === "PENDING"
      ? "LOCAL_OFFICIAL_TXT_MATCHED" : originalState;
  }
  const commands = [];
  for (const [scheme, valueKey, stateKey, sortOrder] of [
    ["classic", "classic_input_raw", "classic_input_state", 0],
    ["modern", "modern_input_raw", "modern_input_state", 1],
  ]) {
    const commandText = frameValue(row[valueKey]);
    if (commandText !== null) commands.push({ moveId: id, scheme, commandText,
      numericNotation: null, buttonNotation: null, conditionText: null, sortOrder });
  }
  return { id, slug, name: row.official_name, moveType: MOVE_TYPES[row.move_type_source] ?? row.move_type_candidate ?? null,
    usageSummary: null, releaseFixture: false, frameFieldStatus, status: "draft", frame, commands, media: null };
}

/**
 * Projects only named move candidates for one character. A repeated or malformed crosswalk UUID
 * is never adopted; those rows receive stable, character-scoped Preview IDs.
 */
export function buildOfficialTxtDevicePreviewBundle(rows, characterSlug) {
  if (!Array.isArray(rows) || typeof characterSlug !== "string" || !characterSlug.trim()) {
    throw new TypeError("rows and characterSlug are required");
  }
  const selected = rows.filter(row => row?.character_slug === characterSlug);
  const scopedHolds = selected.filter(row => row?.identity_state === "HOLD_RYU_SCOPE");
  const moveRows = selected.filter(row => row?.record_type === "MOVE_CANDIDATE");
  const eligible = moveRows.filter(row => row.identity_state !== "HOLD_RYU_SCOPE");
  // UUID uniqueness is repository-wide, not only within this character's slice.
  const uuidRows = rows.filter(row => row?.record_type === "MOVE_CANDIDATE" &&
    EXISTING_ID_STATES.has(row.identity_state) && row.candidate_move_uuid);
  const uuidCounts = new Map();
  for (const row of uuidRows) uuidCounts.set(row.candidate_move_uuid.toLowerCase(), (uuidCounts.get(row.candidate_move_uuid.toLowerCase()) ?? 0) + 1);

  const moves = [];
  const moveEvidence = Object.create(null);
  const identityByMoveId = Object.create(null);
  const holds = [];
  const seenSourceKeys = new Set();

  for (const row of eligible) {
    const sourceKey = row.source_record_key;
    if (!sourceKey || !row.official_name) throw new Error("candidate row lacks source_record_key or official_name");
    if (seenSourceKeys.has(sourceKey)) throw new Error(`duplicate source_record_key: ${sourceKey}`);
    seenSourceKeys.add(sourceKey);

    const candidateUuid = row.candidate_move_uuid?.toLowerCase();
    const uuidCount = candidateUuid ? uuidCounts.get(candidateUuid) ?? 0 : 0;
    const uuidIsValid = Boolean(candidateUuid && UUID_RE.test(candidateUuid));
    const canUseExistingId = EXISTING_ID_STATES.has(row.identity_state) && uuidIsValid && uuidCount === 1;
    const id = canUseExistingId ? row.candidate_move_uuid : stablePreviewId(characterSlug, sourceKey);
    const slug = canUseExistingId && row.candidate_move_slug
      ? row.candidate_move_slug : stablePreviewSlug(characterSlug, sourceKey);
    const move = toMove(row, id, slug);
    moves.push(move);
    identityByMoveId[id] = { sourceRecordKey: sourceKey, sourceWebId: row.source_web_id || null,
      sourceRecordSha256: row.source_record_sha256 || null, sourceLocator: row.source_locator || null,
      sourceUrl: row.source_url || null, sourceUrlState: row.source_url_state || null,
      sourceArtifact: row.source_artifact || null, sourceArtifactSha256: row.source_artifact_sha256 || null,
      sourcePatchState: row.source_patch_state || null, publicationState: row.publication_state || null,
      idKind: canUseExistingId ? "EXISTING_ID_CROSSWALK_CANDIDATE" : "ISOLATED_PREVIEW_ID",
      identityState: row.identity_state, candidateSlug: row.candidate_move_slug || null };
    moveEvidence[id] = { patch: null, verification: "公式TXT候補。Patch・Source Relation・表示照合・公開承認待ち", sources: [] };

    if (EXISTING_ID_STATES.has(row.identity_state) && !canUseExistingId) {
      holds.push({ sourceRecordKey: sourceKey, reason: uuidCount > 1 ? "REPEATED_CANDIDATE_UUID_ISOLATED" :
        !uuidIsValid && candidateUuid ? "MALFORMED_CANDIDATE_UUID_ISOLATED" : "CROSSWALK_UUID_MISSING_OR_UNCONFIRMED" });
    } else if (!EXISTING_ID_STATES.has(row.identity_state)) {
      holds.push({ sourceRecordKey: sourceKey, reason: `IDENTITY_${row.identity_state || "UNCONFIRMED"}` });
    }
  }

  return { characterSlug, inputRows: selected.length, namedMoveRows: moveRows.length,
    excludedRows: selected.length - eligible.length, excludedRyuScopeHolds: scopedHolds.length,
    bundle: { ...EMPTY_BUNDLE(), moves }, moveEvidence, identityByMoveId, holds,
    releaseEligible: false };
}

/** Display projection only. Keep the original moveType and all IDs/values intact.
 * Official TXT webId sections: 1xx normals, 2xx unique, 3xx specials,
 * 4xx super arts, 5xx throws. Unknown/no-webId rows keep their original classification.
 * This is a local review classification, not publication approval.
 */
function withLocalDisplayCategory(move, identity, characterSlug) {
  const sourceKey = identity?.sourceRecordKey;
  if (!sourceKey?.startsWith(`${characterSlug}:`)) return move;
  const hasModern = (move.commands ?? []).some(row => row.moveId === move.id &&
    /^modern(?:_|$)/i.test(String(row.scheme).replaceAll("-", "_")) &&
    [row.commandText, row.numericNotation, row.buttonNotation].some(value => typeof value === "string" && value.trim()));
  const noModernListed = exactOfficialTxtSourceKeys.has(sourceKey) && officialTxtNoModernInputKeys.has(sourceKey);
  const projected = noModernListed && !hasModern
    ? { ...move, ws5ModernInputState: "OFFICIAL_NOT_LISTED", ws5ModernInputSource: sourceKey } : move;
  const webId = String(identity?.sourceWebId ?? "");
  if (!/^[1-5]\d{2}$/.test(webId)) return projected;
  const categories = { "1": "normal", "2": "unique", "3": "special", "4": "super", "5": "throw" };
  return { ...projected, ws5DisplayCategory: categories[webId[0]],
    ws5DisplayCategorySource: identity.sourceRecordKey, ws5DisplayCategoryState: "LOCAL_WEBID_SECTION_CANDIDATE" };
}
export function getOfficialTxtPreviewDisplayCategory(move) {
  return move?.ws5DisplayCategoryState === "LOCAL_WEBID_SECTION_CANDIDATE" &&
    ["normal", "unique", "special", "super", "throw"].includes(move.ws5DisplayCategory)
    ? move.ws5DisplayCategory : null;
}

function hasValue(value) { return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined; }
function normalized(value) { return String(value ?? "").normalize("NFKC").replace(/\s+/g, " ").trim(); }

/**
 * Preview-only merge. Existing rows win: IDs/names/slugs/types, non-empty inputs and frame values
 * are not overwritten. Candidate values fill only absent fields and remain PENDING unless the
 * source row explicitly carries OFFICIAL_NA or OFFICIAL_NOT_LISTED.
 */
export function connectOfficialTxtPreviewCandidate(existingBundle, candidateResult) {
  if (!candidateResult?.bundle?.moves || !candidateResult?.identityByMoveId) throw new TypeError("candidateResult is invalid");
  const base = existingBundle ?? EMPTY_BUNDLE();
  const output = { ...EMPTY_BUNDLE(), ...base, moves: [...(base.moves ?? [])] };
  // Freeze collision checks against the supplied base, not previously appended TXT rows.
  // Separate official source rows may share a display name / historical candidate alias.
  const baseMoves = [...(base.moves ?? [])];
  const baseSlugs = new Set(baseMoves.map(move => move.slug).filter(Boolean));
  const sourceKeys = new Set();
  for (const move of candidateResult.bundle.moves) {
    const key = candidateResult.identityByMoveId[move.id]?.sourceRecordKey;
    if (typeof key !== "string" || !key.startsWith(`${candidateResult.characterSlug}:`) || sourceKeys.has(key)) {
      throw new TypeError("candidate source identity is missing, duplicated or outside character scope");
    }
    sourceKeys.add(key);
  }
  const idIndexes = new Map();
  const slugSet = new Set();
  output.moves.forEach((move, index) => {
    const list = idIndexes.get(move.id) ?? [];
    list.push(index); idIndexes.set(move.id, list);
    if (move.slug) slugSet.add(move.slug);
  });
  const moveEvidence = Object.create(null);
  const holds = [...candidateResult.holds];
  let mergedExisting = 0;
  let appended = 0;

  for (const rawCandidate of candidateResult.bundle.moves) {
    const identity = candidateResult.identityByMoveId[rawCandidate.id];
    const candidate = identity && exactOfficialTxtSourceKeys.has(identity.sourceRecordKey)
      ? { ...rawCandidate, frameFieldStatus: { ...(rawCandidate.frameFieldStatus ?? {}),
          ...Object.fromEntries(Object.entries(rawCandidate.frame ?? {}).filter(([field, value]) =>
            field !== "verificationStatus" && value !== null && rawCandidate.frameFieldStatus?.[field] === "PENDING" &&
            rawCandidate.ws5CanonicalFieldProvenance?.[field] !== "EXISTING_VALUE_PRESERVED_TXT_BLANK")
            .map(([field]) => [field, "LOCAL_OFFICIAL_TXT_MATCHED"])) } }
      : rawCandidate;
    const indexes = idIndexes.get(candidate.id) ?? [];
    if (indexes.length > 1) {
      holds.push({ sourceRecordKey: identity.sourceRecordKey, reason: "BASE_HAS_DUPLICATE_MOVE_ID" });
      continue;
    }
    if (indexes.length === 1) {
      const index = indexes[0];
      const original = output.moves[index];
      const mismatch = (candidate.slug && original.slug !== candidate.slug) ||
        (candidate.name && normalized(original.name) !== normalized(candidate.name)) ||
        (candidate.moveType && original.moveType && original.moveType !== candidate.moveType);
      if (mismatch) {
        holds.push({ sourceRecordKey: identity.sourceRecordKey, reason: "EXISTING_ID_PREIMAGE_IDENTITY_MISMATCH" });
        continue;
      }
      const merged = { ...original };
      const baseFrame = original.frame ?? { startup: null, active: null, recovery: null, onHit: null, onBlock: null, damage: null, verificationStatus: null };
      const frame = { ...baseFrame };
      const fieldStatus = { ...(original.frameFieldStatus ?? {}) };
      for (const field of Object.keys(FRAME_FIELDS)) {
        const baseState = fieldStatus[field];
        const baseStateIsAuthoritative = ["CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED", "OFFICIAL_NA", "OFFICIAL_NOT_LISTED"].includes(baseState);
        if (!hasValue(frame[field]) && !baseStateIsAuthoritative && hasValue(candidate.frame?.[field])) {
          frame[field] = candidate.frame[field];
          fieldStatus[field] = candidate.frameFieldStatus?.[field] ?? "PENDING";
        } else if (!hasValue(frame[field]) && !fieldStatus[field] && candidate.frameFieldStatus?.[field]) {
          fieldStatus[field] = candidate.frameFieldStatus[field];
        }
      }
      frame.verificationStatus = frame.verificationStatus ?? "candidate_only";
      merged.frame = frame;
      merged.frameFieldStatus = fieldStatus;
      merged.commands = [...(original.commands ?? [])];
      for (const command of candidate.commands ?? []) {
        const sameScheme = merged.commands.filter(row => row.moveId === original.id &&
          String(row.scheme).toLowerCase().startsWith(command.scheme));
        if (sameScheme.some(row => hasValue(row.commandText) || hasValue(row.numericNotation) || hasValue(row.buttonNotation))) continue;
        if (hasValue(command.commandText)) merged.commands.push({ ...command, moveId: original.id });
      }
      output.moves[index] = withLocalDisplayCategory(merged, identity, candidateResult.characterSlug);
      moveEvidence[original.id] = candidateResult.moveEvidence[candidate.id];
      mergedExisting++;
      continue;
    }

    // A Preview ID is deliberately not an identity link. If its display name
    // already exists in this character bundle, adding a second card would look
    // like a duplicate move even though the IDs differ. Keep it local-HOLD.
    const sameName = baseMoves.some(move => normalized(move.name) === normalized(candidate.name));
    if (sameName) {
      holds.push({ sourceRecordKey: identity.sourceRecordKey, reason: "UNLINKED_NAME_COLLISION_QUARANTINED" });
      continue;
    }

    const candidateSlug = identity.candidateSlug;
    if ((candidateSlug && baseSlugs.has(candidateSlug)) || slugSet.has(candidate.slug)) {
      holds.push({ sourceRecordKey: identity.sourceRecordKey, reason: "BASE_SLUG_COLLISION_QUARANTINED" });
      continue;
    }
    output.moves.push(withLocalDisplayCategory(candidate, identity, candidateResult.characterSlug));
    idIndexes.set(candidate.id, [output.moves.length - 1]);
    slugSet.add(candidate.slug);
    // A historical candidate alias is not an emitted card slug; do not reserve it.
    moveEvidence[candidate.id] = candidateResult.moveEvidence[candidate.id];
    appended++;
  }

  return { bundle: output, moveEvidence, holds, mergedExisting, appended, releaseEligible: false };
}
