import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

/** Only exact, inspected move IDs in the latest asset-pack mapping are eligible. */
export async function getReleaseConfirmedMedia(
  characterSlug: string,
  moves: Array<{ id: string; slug: string }>,
): Promise<Map<string, DevicePreviewMoveMotionMedia>> {
  if (process.env.VERCEL_ENV !== "preview" || characterSlug !== "elena") return new Map();
  const { default: confirmed } = await import("@/data/CONFIRMED_RELEASE_MEDIA_20261005.json");
  const byId = new Map(moves.map((move) => [move.id, move.slug]));
  const result = new Map<string, DevicePreviewMoveMotionMedia>();
  for (const row of confirmed) {
    if (row.characterSlug !== characterSlug || byId.get(row.moveId) !== row.moveSlug || result.has(row.moveId)) continue;
    result.set(row.moveId, {
      id: `release-media-${row.moveId}`,
      moveId: row.moveId,
      mediaType: "video",
      mediaUrl: row.mediaUrl,
      posterUrl: row.posterUrl,
      sourceUrl: null,
      sourceLabel: null,
      status: "draft",
      displayOrder: null,
    });
  }
  return result;
}
