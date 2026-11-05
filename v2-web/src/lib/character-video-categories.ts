import { dedupeCharacterRelatedVideos } from "./character-related-video-contract.mjs";
import type { VideoSummary } from "./event-media";
import { applyReviewedVideoMetadata, videoLearningMetadata } from "./video-learning";
import { uniqueVideoSummaries, videoPresentationUrl } from "./video-presentation";

export const CHARACTER_VIDEO_CATEGORIES = [
  { id: "beginner", label: "初心者用", description: "とりこれ・基本操作・基本コンボの解説" },
  { id: "intermediate", label: "中級者用", description: "応用コンボ・セットプレイ・プラチナ／ダイヤ向け" },
  { id: "advanced", label: "上級者用", description: "キャラ対策・マスターランク向け" },
  { id: "match", label: "対戦動画", description: "登録プレイヤーの対戦動画・大会アーカイブ" },
] as const;
type Category = typeof CHARACTER_VIDEO_CATEGORIES[number]["id"];

/** Use registered structured metadata only. Titles and descriptions never establish difficulty. */
export function groupCharacterVideos(videos: VideoSummary[]) {
  const groups: Record<Category, VideoSummary[]> = { beginner: [], intermediate: [], advanced: [], match: [] };
  const unclassified: VideoSummary[] = [];
  for (const original of dedupeCharacterRelatedVideos(uniqueVideoSummaries(videos))) {
    const url = videoPresentationUrl(original.url);
    if (!url || !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(new URL(url).hostname)) continue;
    const video = applyReviewedVideoMetadata(original);
    const learning = videoLearningMetadata(video);
    let category: Category | null = null;
    if (["match", "tournament", "ranked_match", "replay"].includes(video.videoType ?? "")) {
      if (video.videoType === "tournament" || video.entityRefs?.players.length) category = "match";
    } else if (video.level === "advanced" || learning.targetRanks.some(rank => /^mr\d+$/.test(rank)) || video.categories.some(tag => ["counter", "matchup"].includes(tag))) category = "advanced";
    else if (video.level === "intermediate" || learning.targetRanks.some(rank => ["platinum", "diamond"].includes(rank)) || video.categories.some(tag => ["setup", "setplay", "advanced_combo"].includes(tag))) category = "intermediate";
    else if (video.level === "beginner" || learning.targetRanks.some(rank => ["rookie", "silver", "gold"].includes(rank)) || video.categories.some(tag => ["torikore", "basic_combo"].includes(tag))) category = "beginner";
    if (category) groups[category].push(video);
    else unclassified.push(video);
  }
  return { groups, unclassified };
}
