import type { VideoSummary } from "@/lib/event-media";
import { RYU_VIDEO_PREVIEW } from "@/lib/ryu-video-preview";
import { CHARACTER_VIDEO_BATCH_01 } from "@/lib/character-video-batch-01";
import { CHARACTER_VIDEO_BATCH_02 } from "@/lib/character-video-batch-02";
import { CHARACTER_VIDEO_BATCH_03 } from "@/lib/character-video-batch-03";
import { CHARACTER_VIDEO_BATCH_04 } from "@/lib/character-video-batch-04";
import { CHARACTER_VIDEO_BATCH_05 } from "@/lib/character-video-batch-05";
import { CHARACTER_VIDEO_BATCH_06 } from "@/lib/character-video-batch-06";
import { CHARACTER_VIDEO_DEEP_GUILE } from "@/lib/character-video-deep-guile";
import { CHARACTER_VIDEO_DEEP_CHUN_LI } from "@/lib/character-video-deep-chun-li";
import { CHARACTER_VIDEO_DEEP_JAMIE } from "@/lib/character-video-deep-jamie";
import { CHARACTER_VIDEO_DEEP_LUKE } from "@/lib/character-video-deep-luke";
import { CHARACTER_VIDEO_DEEP_JP } from "@/lib/character-video-deep-jp";

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
  "guile": [...(CHARACTER_VIDEO_BATCH_01["guile"] ?? []), ...CHARACTER_VIDEO_DEEP_GUILE],
  "chun-li": [...(CHARACTER_VIDEO_BATCH_01["chun-li"] ?? []), ...CHARACTER_VIDEO_DEEP_CHUN_LI],
  "jamie": [...(CHARACTER_VIDEO_BATCH_01["jamie"] ?? []), ...CHARACTER_VIDEO_DEEP_JAMIE],
  "luke": [...(CHARACTER_VIDEO_BATCH_01["luke"] ?? []), ...CHARACTER_VIDEO_DEEP_LUKE],
  "jp": [...(CHARACTER_VIDEO_BATCH_01["jp"] ?? []), ...CHARACTER_VIDEO_DEEP_JP],
};

export function getCharacterPreviewVideos(characterSlug: string): VideoSummary[] {
  return [...(previewVideosByCharacter[characterSlug] ?? [])];
}

export function getAllPreviewVideoCandidates(): VideoSummary[] {
  return Object.values(previewVideosByCharacter).flatMap(videos => [...videos]);
}
