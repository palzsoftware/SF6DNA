import { attachMoveMediaKeys } from './media-key-registry.mjs';
import { ws5LocalCorrections } from './ws5-local-corrections-20261120.mjs';
import { connectCanonicalTxtCandidate } from './canonical-txt-connection.mjs';
import { connectOfficialTxtPreviewCandidate } from './official-txt-device-preview-adapter.mjs';

/** Local development request admission only; never a publication grant. */
export function isWs5LocalCardRequest({ nodeEnv, vercelEnv, vercel, enabled, host }) {
  return nodeEnv === 'development' && enabled === '1' && !vercel &&
    (!vercelEnv || vercelEnv === 'development') && typeof host === 'string' &&
    /^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d{1,5})?$/i.test(host);
}
/** Pass the existing resolver result through one shared projection to the existing page.
 * Disabled or out-of-scope calls preserve the original bundle and evidence by reference.
 */
export function connectOfficialTxtCharacterPageData({ character, resolved, moveEvidence = {}, candidate, records, admission, mediaRegistry }) {
  if (!isWs5LocalCardRequest(admission)) return { ...resolved, moveEvidence, candidateConnection:null };
  if (!character?.slug || candidate?.characterSlug !== character.slug) return { ...resolved, moveEvidence, candidateConnection:null };
  const connected = connectCanonicalTxtCandidate(resolved.bundle, candidate, records, {
    characterSlug:character.slug, bundleCharacterSlug:character.slug, characterId:character.id,
    connectExisting:connectOfficialTxtPreviewCandidate,
  });
  let media = null;
  if (mediaRegistry) {
    const adoptions = new Map(ws5LocalCorrections.identityAdoptions
      .map(row => [row.existingMoveId, row.sourceRecordKey]));
    const adoptedMoves = new Map((connected.bundle?.moves ?? [])
      .filter(move => adoptions.get(move.id) === move.ws5CanonicalSource && adoptions.has(move.id))
      .map(move => [move.ws5CanonicalSource, move]));
    const existingIds = new Set(mediaRegistry.map(row => row.currentMoveId));
    const registry = mediaRegistry.map(row => {
      const move = adoptedMoves.get(row.sourceRecordKey);
      if (!move || row.characterSlug !== character.slug || existingIds.has(move.id) ||
          row.currentMoveId !== `sf6dna-preview:${character.slug}:${encodeURIComponent(row.sourceRecordKey)}`) return row;
      return { ...row, currentMoveId:move.id, moveSlug:move.slug };
    });
    media = attachMoveMediaKeys(connected.bundle, registry, character.slug);
  }
  return { ...resolved, bundle:media ? media.bundle : connected.bundle, mediaKeyHolds:media?.holds ?? [],
    moveEvidence:{...moveEvidence,...connected.moveEvidence}, candidateConnection:connected };
}
