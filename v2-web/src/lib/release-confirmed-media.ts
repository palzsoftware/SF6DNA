import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

/** Only exact, inspected move IDs in the latest asset-pack mapping are eligible. */
export async function getReleaseConfirmedMedia(
  characterSlug: string,
  moves: Array<{ id: string; slug: string }>,
): Promise<Map<string, DevicePreviewMoveMotionMedia>> {
  if (process.env.VERCEL_ENV !== "preview") return new Map();
  const { default: confirmed } = await import("@/data/CONFIRMED_RELEASE_MEDIA_20261005.json");
  const byId = new Map(moves.map((move) => [move.id, move.slug]));
  const result = new Map<string, DevicePreviewMoveMotionMedia>();
  for (const row of confirmed) {
    if (row.characterSlug !== characterSlug || byId.get(row.moveId) !== row.moveSlug || result.has(row.moveId)) continue;
    if (row.mappingStatus !== "CONFIRMED" || row.confidence !== "HIGH" || !row.mappingMethod || !row.sourceFile ||
      !row.variant || !/^[a-f0-9]{64}$/.test(row.mediaHash) || !/^[a-f0-9]{64}$/.test(row.sourceHash) ||
      !Number.isFinite(row.start) || !Number.isFinite(row.end) || row.start < 0 || row.end <= row.start) continue;
    const image = row.mediaType === "gif" && /\.(webp|gif)$/.test(row.mediaUrl);
    const video = row.mediaType === "video" && /\.mp4$/.test(row.mediaUrl);
    if ((!image && !video) || !row.mediaUrl.startsWith("/media/") || row.mediaUrl.includes("..")) continue;
    result.set(row.moveId, {
      id: `release-media-${row.moveId}`,
      moveId: row.moveId,
      mediaType: image ? "gif" : "video",
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
