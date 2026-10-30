import "server-only";
import { videoSearchText, type VideoSearchKind } from "@/lib/auto-video-search";
import { unstable_cache } from "next/cache";
import { searchYouTubeResearch } from "@/lib/youtube-research";

// Search hits are not curated VideoSummary records or confirmed entity relations.
export type AutoVideoHit = {
  videoId: string; title: string; channelTitle: string | null;
  watchUrl: string; thumbnailUrl: string;
};
export type AutoVideoResult = {
  state: "RESULTS" | "EMPTY" | "UNAVAILABLE" | "ERROR";
  items: AutoVideoHit[];
};
export function autoVideoEnabled() {
  return process.env.SF6DNA_AUTO_VIDEO_LOCAL === "1" &&
    !process.env.VERCEL && !process.env.VERCEL_ENV;
}
export function autoVideoQuery(names: readonly string[]): string | null {
  return videoSearchText(names, "all", "ja");
}
let retryAfter = 0;
const pending = new Map<string, Promise<{ fetchedAt: number; items: AutoVideoHit[] }>>();
async function searchOnce(query: string) {
  const existing = pending.get(query);
  if (existing) return existing;
  if (Date.now() < retryAfter) throw new Error("AUTO_VIDEO_COOLDOWN");
  const request = (async () => {
    try {
      const rows = await searchYouTubeResearch(query, 24);
      const seen = new Set<string>();
      const items = rows.flatMap(row => {
        if (row.availability !== "PUBLIC" || !row.title?.trim() ||
            !/^[A-Za-z0-9_-]{11}$/.test(row.videoId) || seen.has(row.videoId)) return [];
        seen.add(row.videoId);
        return [{ videoId: row.videoId, title: row.title, channelTitle: row.channelTitle,
          watchUrl: `https://www.youtube.com/watch?v=${row.videoId}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${row.videoId}/hqdefault.jpg` }];
      });
      return { fetchedAt: Date.now(), items };
    } catch {
      retryAfter = Date.now() + 60000;
      throw new Error("AUTO_VIDEO_SEARCH_FAILED");
    }
  })();
  pending.set(query, request);
  try { return await request; } finally { pending.delete(query); }
}
// Next Data Cache survives requests/restarts. No API key is an argument or result.
const cachedSearch = unstable_cache(searchOnce, ["sf6dna-auto-youtube-v4"], { revalidate: 86400 });
export async function getAutoVideos(names: readonly string[], kind: VideoSearchKind = "all", language: "ja" | "en" = "ja"): Promise<AutoVideoResult> {
  const query = videoSearchText(names, kind, language);
  if (!autoVideoEnabled() || !process.env.YOUTUBE_DATA_API_KEY?.trim() || !query) {
    return { state: "UNAVAILABLE", items: [] };
  }
  try {
    const result = await cachedSearch(query);
    // Do not keep displaying indefinitely stale data when upstream refresh fails.
    if (Date.now() - result.fetchedAt > 7 * 86400000) return { state: "ERROR", items: [] };
    return { state: result.items.length ? "RESULTS" : "EMPTY", items: result.items };
  } catch { return { state: "ERROR", items: [] }; }
}
