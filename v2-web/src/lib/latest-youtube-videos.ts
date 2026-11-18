import "server-only";
import { unstable_cache } from "next/cache";
import { searchYouTubeResearch } from "@/lib/youtube-research";
import { listVideosResult } from "@/lib/event-media";
import {
  LATEST_VIDEO_CACHE_SECONDS, LATEST_VIDEO_CATEGORIES, LATEST_VIDEO_LABELS, LATEST_VIDEO_MAX_PER_CATEGORY, LATEST_VIDEO_QUERIES,
  createQuotaGuard, latestVideoEnabled, normalizeLatestHits, publishedAfter, youtubeIdFromUrl,
  type LatestVideoCategory, type LatestVideoHit, type LatestVideoShelf,
} from "@/lib/latest-youtube-core";

/** Tag used by the scheduled refresh route; user searches use a different cache key. */
export const LATEST_VIDEO_CACHE_TAG = "sf6dna-latest-youtube";
const quota = createQuotaGuard();

async function fetchCategory(category: LatestVideoCategory): Promise<{ fetchedAt: number; items: LatestVideoHit[] }> {
  // A thrown error is not cached by unstable_cache, so the next request retries (bounded by the quota guard).
  if (!quota.tryConsume()) throw new Error("LATEST_VIDEO_QUOTA_EXHAUSTED");
  let rows;
  try {
    rows = await searchYouTubeResearch(LATEST_VIDEO_QUERIES[category], 25, { order: "date", publishedAfter: publishedAfter(Date.now()) });
  } catch (error) { quota.noteFailure(); throw error; }
  return { fetchedAt: Date.now(), items: normalizeLatestHits(rows) };
}
const cachedCategory = unstable_cache(fetchCategory, ["sf6dna-latest-youtube-v1"], { revalidate: LATEST_VIDEO_CACHE_SECONDS, tags: [LATEST_VIDEO_CACHE_TAG] });

/** Registered DB videos (curated), newest first. Never mixed with auto-fetched hits. */
async function curatedHits(): Promise<LatestVideoHit[] | null> {
  const result = await listVideosResult();
  if (result.state !== "SUCCESS_WITH_RESULTS" && result.state !== "SUCCESS_EMPTY") return null;
  return normalizeLatestHits(result.items.map(video => ({
    videoId: youtubeIdFromUrl(video.url) ?? "", title: video.title, channelTitle: video.channelName,
    publishedAt: video.publishedAt, availability: "PUBLIC",
  })), new Set(), LATEST_VIDEO_MAX_PER_CATEGORY);
}

export async function getLatestVideoShelves(): Promise<LatestVideoShelf[] | null> {
  if (!latestVideoEnabled(process.env)) return null;
  const curated = await curatedHits().catch(() => null);
  const curatedIds = new Set((curated ?? []).map(hit => hit.videoId));
  const configured = Boolean(process.env.YOUTUBE_DATA_API_KEY?.trim());
  const shelves: LatestVideoShelf[] = await Promise.all(LATEST_VIDEO_CATEGORIES.map(async category => {
    const label = LATEST_VIDEO_LABELS[category];
    const fallback = (): LatestVideoShelf => curated?.length ? { category, label, state: "FALLBACK", items: curated } : { category, label, state: configured ? "ERROR" : "UNAVAILABLE", items: [] };
    if (!configured) return fallback();
    try {
      const result = await cachedCategory(category);
      if (Date.now() - result.fetchedAt > 7 * 86400000) return fallback();
      // Registered videos are shown on their own shelf only.
      const items = result.items.filter(hit => !curatedIds.has(hit.videoId));
      return { category, label, state: items.length ? "RESULTS" : "EMPTY", items };
    } catch { return fallback(); }
  }));
  shelves.push({ category: "curated", label: LATEST_VIDEO_LABELS.curated, state: curated === null ? "ERROR" : curated.length ? "RESULTS" : "EMPTY", items: curated ?? [] });
  return shelves;
}
