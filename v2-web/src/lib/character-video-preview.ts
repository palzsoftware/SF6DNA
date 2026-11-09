import type { VideoSummary } from "@/lib/event-media";
import { RYU_VIDEO_PREVIEW } from "@/lib/ryu-video-preview";
import { CHARACTER_VIDEO_BATCH_01 } from "@/lib/character-video-batch-01";
import { CHARACTER_VIDEO_BATCH_02 } from "@/lib/character-video-batch-02";
import { CHARACTER_VIDEO_BATCH_03 } from "@/lib/character-video-batch-03";
import { CHARACTER_VIDEO_BATCH_04 } from "@/lib/character-video-batch-04";
import { CHARACTER_VIDEO_BATCH_05 } from "@/lib/character-video-batch-05";
import { CHARACTER_VIDEO_BATCH_06 } from "@/lib/character-video-batch-06";

/** Preview-only candidates. Add new character arrays only after reviewing sources.
 * Missing characters intentionally have zero candidates; no inferred relations.
 * This registry is not a publication approval source.
 */
const previewVideosByCharacter: Readonly<Record<string, readonly VideoSummary[]>> = {
  ryu: RYU_VIDEO_PREVIEW,
  ...CHARACTER_VIDEO_BATCH_01,
  ...CHARACTER_VIDEO_BATCH_02,
  ...CHARACTER_VIDEO_BATCH_03,
  ...CHARACTER_VIDEO_BATCH_04,
  ...CHARACTER_VIDEO_BATCH_05,
  ...CHARACTER_VIDEO_BATCH_06,
};

export function getCharacterPreviewVideos(characterSlug: string): VideoSummary[] {
  return [...(previewVideosByCharacter[characterSlug] ?? [])];
}

export function getAllPreviewVideoCandidates(): VideoSummary[] {
  return Object.values(previewVideosByCharacter).flatMap(videos => [...videos]);
}
