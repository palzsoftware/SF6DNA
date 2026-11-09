import type { VideoSummary } from "@/lib/event-media";
import { RYU_VIDEO_PREVIEW } from "@/lib/ryu-video-preview";

/** Preview-only candidates. Add new character arrays only after reviewing sources.
 * Missing characters intentionally have zero candidates; no inferred relations.
 * This registry is not a publication approval source.
 */
const previewVideosByCharacter: Readonly<Record<string, readonly VideoSummary[]>> = {
  ryu: RYU_VIDEO_PREVIEW,
};

export function getCharacterPreviewVideos(characterSlug: string): VideoSummary[] {
  return [...(previewVideosByCharacter[characterSlug] ?? [])];
}

export function getAllPreviewVideoCandidates(): VideoSummary[] {
  return Object.values(previewVideosByCharacter).flatMap(videos => [...videos]);
}
