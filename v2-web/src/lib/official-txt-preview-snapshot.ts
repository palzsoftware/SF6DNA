import candidates from "@/data/SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json";
import type { OfficialTxtPreviewResult } from "./official-txt-device-preview-adapter.mjs";

/** Read-only loader for the local/Preview candidate snapshot. */
export function getWs5TxtPreviewCandidate(characterSlug: string): OfficialTxtPreviewResult | null {
  const snapshot = candidates as unknown as Record<string, OfficialTxtPreviewResult>;
  return snapshot[characterSlug] ?? null;
}
