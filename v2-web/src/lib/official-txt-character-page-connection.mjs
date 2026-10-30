import { attachMoveMediaKeys } from './media-key-registry.mjs';
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
  const media = mediaRegistry ? attachMoveMediaKeys(connected.bundle, mediaRegistry, character.slug) : null;
  return { ...resolved, bundle:media ? media.bundle : connected.bundle, mediaKeyHolds:media?.holds ?? [],
    moveEvidence:{...moveEvidence,...connected.moveEvidence}, candidateConnection:connected };
}
