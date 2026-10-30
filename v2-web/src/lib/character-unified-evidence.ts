import type { DevicePreviewBundle } from "./device-preview";
import type { UnifiedMoveEvidence } from "./character-unified-contract";
import { safeExternalUrl } from "./safe-external-url";

const frameFields = ["startup", "active", "recovery", "onHit", "onBlock", "damage"] as const;

/** Reuse the received WS3 snapshot. This supplies provenance, never new values. */
export async function characterUnifiedEvidence(slug: string, moves: DevicePreviewBundle["moves"], environment: string | undefined) {
  const result: Record<string, UnifiedMoveEvidence> = {};
  if (environment !== "preview" && environment !== "development") return result;
  const { default: snapshot } = await import("@/data/NINE_CHARACTER_PAGE_CANDIDATE_20261006.json");
  const rows = snapshot.candidate.characters[slug as keyof typeof snapshot.candidate.characters];
  if (!rows) return result;
  for (const move of moves) {
    const row = rows.find(candidate => candidate.id === move.id && candidate.slug === move.slug);
    const fact = snapshot.evidence[move.id as keyof typeof snapshot.evidence];
    if (!row || !fact || fact.character !== slug || fact.move_display !== "INCLUDE_SAVED_IDENTITY") continue;
    const accepted = Object.entries(fact.frame_classifications).filter(([field, state]) => {
      if (!frameFields.some(key => key === field)) return false;
      const key = field as typeof frameFields[number];
      const value = move.frame?.[key];
      const displayState = move.frameFieldStatus?.[key];
      const present = typeof value === "number" ? Number.isFinite(value)
        : typeof value === "string" && value.trim().length > 0;
      return state.status === "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED" && state.adopted &&
        state.source_available === "YES" && /^[a-f0-9]{64}$/.test(state.source_sha256 ?? "") &&
        Boolean(safeExternalUrl(state.source_url)) && present &&
        (!displayState || displayState === "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED") &&
        value === row.frame?.[key as keyof typeof row.frame];
    });
    const urls = [...new Set(accepted.flatMap(([, state]) => {
      const url = safeExternalUrl(state.source_url);
      return url ? [url] : [];
    }))];
    result[move.id] = {
      patch: null,
      verification: accepted.length ? "保存した公式フレーム表と照合済み・対応バージョン確認中" : "照合状態を確認中",
      sources: urls.map((url, index) => ({ id: `${move.id}-frame-${index}`, url,
        title: "CAPCOM公式フレーム表の保存資料（2026-10-06）", publisher: "CAPCOM",
        sourceType: "official", relationship: "reference" })),
    };
  }
  return result;
}
