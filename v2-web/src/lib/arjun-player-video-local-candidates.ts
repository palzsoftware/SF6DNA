import { CHARACTER_VIDEO_ARJUN_RESEARCH } from "@/lib/character-video-arjun-research";
import type { VideoSummary } from "@/lib/event-media";

export type ArjunPlayerReviewCandidate = {
  candidateKey: string;
  labelFromVideoTitle: string;
  evidenceVideoId: string;
  evidenceTitle: string;
  evidenceUrl: string;
  status: "IDENTITY_AND_CHARACTER_RELATION_UNVERIFIED";
};

/** Local review ONLY. Titles do not prove the person, player identity, or character use. */
export function arjunLocalVideoCandidates(): VideoSummary[] {
  const seen = new Set<string>();
  return CHARACTER_VIDEO_ARJUN_RESEARCH.filter((item) => {
    if (item.platform !== "youtube" || !item.id.startsWith("preview-arjun-")) return false;
    if (!/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(item.url)) return false;
    const key = item.url.split("v=")[1];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** A review queue, not CharacterPlayerCard/PlayerDetail: no registered player relation exists. */
export function arjunLocalPlayerReviewCandidates(): ArjunPlayerReviewCandidate[] {
  const seen = new Set<string>();
  return arjunLocalVideoCandidates().flatMap((video) => {
    const match = video.title.match(/^(.{1,40}?)アルジュン\s+vs\s+/u);
    if (!match) return [];
    const titleName = match[1].trim();
    if (!titleName || seen.has(titleName)) return [];
    seen.add(titleName);
    return [{
      candidateKey: `video-title:${video.id}`,
      labelFromVideoTitle: titleName,
      evidenceVideoId: video.id,
      evidenceTitle: video.title,
      evidenceUrl: video.url,
      status: "IDENTITY_AND_CHARACTER_RELATION_UNVERIFIED" as const,
    }];
  });
}
