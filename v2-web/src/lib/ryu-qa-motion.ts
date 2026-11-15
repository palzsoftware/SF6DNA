import { ryuMoveReviewFixture } from "@/lib/ryu-move-review-fixture";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import clips from "@/data/ryu-qa-gifs.json";

export type RyuQaClip = {
  key: string;
  name: string;
  moveId: string;
  slug: string;
  group: string;
  width: number;
  height: number;
};

export function isRyuQaMotionRequest(host: string | null) {
  return process.env.VERCEL === "1" &&
    process.env.VERCEL_ENV === "preview" &&
    process.env.SF6DNA_RYU_MEDIA_PREVIEW === "1" &&
    Boolean(process.env.VERCEL_URL) &&
    host === process.env.VERCEL_URL;
}

export const ryuQaClips: readonly RyuQaClip[] = clips.filter(clip =>
  clip.group === "move" &&
  ryuMoveReviewFixture.some(move => move.id === clip.moveId && move.slug === clip.slug) &&
  clips.filter(other => other.group === "move" &&
    other.moveId === clip.moveId && other.slug === clip.slug).length === 1);

export const RYU_QA_CHARACTER_ID = "9c3a7aaa-e090-40a6-b598-f63afb761b77";

export function ryuQaClipUrl(key: string, previewToken: string) {
  return `/api/ryu-qa-motion/${key}?preview=${encodeURIComponent(previewToken)}`;
}

// Identity requires both the current move ID and slug. Ambiguous entries stay unconnected.
export function connectRyuQaMotion(
  characterSlug: string,
  moves: DevicePreviewBundle["moves"],
  host: string | null,
  previewToken: string | null,
): DevicePreviewBundle["moves"] {
  if (characterSlug !== "ryu" || !isRyuQaMotionRequest(host) || !previewToken) return moves;
  return moves.map(move => {
    const clip = ryuQaClips.find(item => item.moveId === move.id && item.slug === move.slug);
    if (!clip) return move;
    return { ...move, media: {
      id: `ryu-qa-${clip.key}`, moveId: move.id, mediaType: "gif" as const,
      mediaUrl: ryuQaClipUrl(clip.key, previewToken), posterUrl: null, sourceUrl: null,
      sourceLabel: null, status: "draft", displayOrder: 0,
    } };
  });
}
