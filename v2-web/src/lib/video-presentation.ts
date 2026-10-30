import type { VideoSummary } from "@/lib/event-media";
import { safeExternalUrl } from "@/lib/safe-external-url";

/** Recheck at the rendering boundary, including summaries from other callers. */
export function videoPresentationUrl(value: unknown): string | null {
  const url = safeExternalUrl(value);
  return url?.startsWith("https:") ? url : null;
}

export function uniqueVideoSummaries(videos: VideoSummary[]): VideoSummary[] {
  const seen = new Set<string>();
  return videos.filter(video => {
    if (seen.has(video.id)) return false;
    seen.add(video.id);
    return true;
  });
}
