/**
 * WS5 official TXT snapshots use a few character keys that differ from the product slug
 * (e.g. "deejay" vs "dee-jay"). This module re-scopes a WS5 candidate and its canonical
 * records to the product slug and links rows to existing move IDs only when the evidence
 * is unambiguous. It never creates DB UUIDs, never changes existing IDs/slugs and grants
 * no publication rights (releaseEligible stays false).
 *
 * Not wired into any page yet: connecting it is a separate, approved change.
 */
export const WS5_TO_APP_SLUG = Object.freeze({ deejay: "dee-jay" });

export function appSlugForWs5(ws5Slug) { return WS5_TO_APP_SLUG[ws5Slug] ?? ws5Slug; }
export function ws5SlugForApp(appSlug) {
  return Object.entries(WS5_TO_APP_SLUG).find(([, app]) => app === appSlug)?.[0] ?? appSlug;
}

const nameKey = value => String(value ?? "").normalize("NFKC").replace(/\s+/g, "");
const frameKey = value => String(value ?? "").normalize("NFKC").replace(/\s+/g, "").replace(/※/g, "").replace(/^\+(?=\d)/, "");
const previewId = (slug, key) => `sf6dna-preview:${encodeURIComponent(slug)}:${encodeURIComponent(key)}`;
const previewSlug = (slug, key) => `txt-${slug}-${String(key).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unmapped"}`;
export const CROSSWALK_LINKED = "CANDIDATE_NAME_STARTUP_UNIQUE_SLUG_ALIAS";

/**
 * Links an official TXT row to an existing move only when the whitespace/width-normalized name
 * is unique on BOTH sides and the startup frame agrees. Everything else stays isolated.
 */
export function buildNameStartupCrosswalk(rows, existingMoves) {
  const existingByName = new Map(), txtNameCount = new Map();
  for (const move of existingMoves ?? []) {
    const key = nameKey(move.name);
    existingByName.set(key, [...(existingByName.get(key) ?? []), move]);
  }
  for (const { raw } of rows) txtNameCount.set(nameKey(raw.skill), (txtNameCount.get(nameKey(raw.skill)) ?? 0) + 1);
  const crosswalk = new Map();
  for (const { key, raw } of rows) {
    const matches = existingByName.get(nameKey(raw.skill)) ?? [];
    let state;
    if (!matches.length) state = "HOLD_NO_EXISTING_NAME";
    else if (matches.length > 1 || txtNameCount.get(nameKey(raw.skill)) > 1) state = "HOLD_AMBIGUOUS_NAME";
    else if (frameKey(matches[0].frame?.startup) !== frameKey(raw.startup_frame)) state = "HOLD_STARTUP_MISMATCH";
    else state = CROSSWALK_LINKED;
    crosswalk.set(key, state === CROSSWALK_LINKED
      ? { state, moveId: matches[0].id, slug: matches[0].slug } : { state, moveId: null, slug: null });
  }
  return crosswalk;
}

/** Returns a product-slug candidate/records pair that the existing connectors accept unchanged. */
export function rescopeWs5Candidate({ candidate, records, appSlug, existingMoves }) {
  const ws5Slug = candidate?.characterSlug;
  if (!ws5Slug || appSlugForWs5(ws5Slug) !== appSlug || ws5Slug === appSlug) throw new TypeError("no WS5 slug alias for this character");
  const prefix = `${ws5Slug}:`, rekey = key => `${appSlug}:${key.slice(prefix.length)}`;
  const rows = Object.entries(records).filter(([key, record]) => key.startsWith(prefix) && record.characterSlug === ws5Slug)
    .map(([key, record]) => ({ key, raw: record.raw, record }));
  const crosswalk = buildNameStartupCrosswalk(rows, existingMoves);
  const linkedIds = new Set();
  const outRecords = {}, moves = [], identityByMoveId = {}, moveEvidence = {}, holds = [];
  for (const { key, record } of rows) outRecords[rekey(key)] = { ...record, characterSlug: appSlug,
    sourceRecordKey: rekey(key), ws5OriginalSourceRecordKey: key };
  for (const move of candidate.bundle.moves) {
    const identity = candidate.identityByMoveId[move.id];
    const oldKey = identity?.sourceRecordKey;
    if (!oldKey?.startsWith(prefix)) throw new TypeError("candidate identity outside WS5 character scope");
    const newKey = rekey(oldKey), link = crosswalk.get(oldKey);
    const linked = link?.state === CROSSWALK_LINKED && !linkedIds.has(link.moveId);
    if (linked) linkedIds.add(link.moveId);
    const id = linked ? link.moveId : previewId(appSlug, newKey);
    const slug = linked ? link.slug : previewSlug(appSlug, newKey);
    moves.push({ ...move, id, slug, commands: (move.commands ?? []).map(row => ({ ...row, moveId: id })) });
    identityByMoveId[id] = { ...identity, sourceRecordKey: newKey, ws5OriginalSourceRecordKey: oldKey,
      idKind: linked ? "EXISTING_ID_CROSSWALK_CANDIDATE" : "ISOLATED_PREVIEW_ID",
      identityState: linked ? CROSSWALK_LINKED : link?.state ?? "HOLD_NO_ID_CANDIDATE", candidateSlug: linked ? link.slug : null };
    moveEvidence[id] = candidate.moveEvidence?.[move.id] ?? null;
    if (!linked) holds.push({ sourceRecordKey: newKey, reason: `IDENTITY_${identityByMoveId[id].identityState}` });
  }
  return {
    candidate: { ...candidate, characterSlug: appSlug, ws5OriginalCharacterSlug: ws5Slug,
      bundle: { ...candidate.bundle, moves }, identityByMoveId, moveEvidence, holds, releaseEligible: false },
    records: outRecords,
    crosswalk: [...crosswalk].map(([sourceRecordKey, value]) => ({ sourceRecordKey, appSourceRecordKey: rekey(sourceRecordKey), ...value })),
  };
}
