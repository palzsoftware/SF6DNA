import candidates from "@/data/SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json";
import appSlugCandidates from "@/data/SF6DNA_WS5_APP_SLUG_PREVIEW_BUNDLES_R3_REGEN_20261117.json";
import type { OfficialTxtPreviewResult } from "./official-txt-device-preview-adapter.mjs";

/** Read-only loader for the local/Preview candidate snapshot.
 * Product slugs whose WS5 key differs (dee-jay <- deejay) resolve to the regenerated candidate
 * (scripts/build-ws5-alias-candidates.mjs); the original R3 snapshot is never altered.
 */
export function getWs5TxtPreviewCandidate(characterSlug: string): OfficialTxtPreviewResult | null {
  const snapshot = candidates as unknown as Record<string, OfficialTxtPreviewResult>;
  const regenerated = appSlugCandidates as unknown as Record<string, OfficialTxtPreviewResult>;
  if (Object.prototype.hasOwnProperty.call(snapshot, characterSlug)) return snapshot[characterSlug];
  return Object.prototype.hasOwnProperty.call(regenerated, characterSlug) ? regenerated[characterSlug] : null;
}
