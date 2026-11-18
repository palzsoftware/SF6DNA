/**
 * Pure rules for the "latest SF6 videos" shelf (no network, no secrets, no DB).
 * Auto-fetched YouTube hits are kept separate from registered (curated) DB videos:
 * they are never written back, never linked to characters/players, and never verified.
 */
export const LATEST_VIDEO_CATEGORIES = ["latest", "pro", "guide"] as const;
export type LatestVideoCategory = typeof LATEST_VIDEO_CATEGORIES[number];
export const LATEST_VIDEO_LABELS: Record<LatestVideoCategory | "curated", string> = {
  latest: "最新スト6動画",
  pro: "プロ対戦・大会",
  guide: "攻略・解説",
  curated: "SF6DNA厳選動画",
};
/** Fixed queries only: user input never reaches the scheduled fetch. */
export const LATEST_VIDEO_QUERIES: Record<LatestVideoCategory, string> = {
  latest: "スト6",
  pro: "スト6 大会",
  guide: "スト6 攻略 解説",
};
export const LATEST_VIDEO_CACHE_SECONDS = 86400;
export const LATEST_VIDEO_LOOKBACK_DAYS = 30;
export const LATEST_VIDEO_MAX_PER_CATEGORY = 24;
/** search.list = 100 units + videos.list = 1 unit; 30 refreshes/day ≈ 3,030 of the 10,000 default quota. */
export const LATEST_VIDEO_DAILY_FETCH_LIMIT = 30;

export type LatestVideoHit = {
  videoId: string; title: string; channelTitle: string | null; publishedAt: string;
  watchUrl: string; thumbnailUrl: string;
};
export type LatestVideoState = "RESULTS" | "EMPTY" | "FALLBACK" | "UNAVAILABLE" | "ERROR";
export type LatestVideoShelf = { category: LatestVideoCategory | "curated"; label: string; state: LatestVideoState; items: LatestVideoHit[] };

const ID = /^[A-Za-z0-9_-]{11}$/;

/** Server-side switch. Production needs its own explicit flag (separate approval). */
export function latestVideoEnabled(env: Record<string, string | undefined>): boolean {
  if (env.SF6DNA_LATEST_VIDEO_ENABLED !== "1") return false;
  if (env.VERCEL_ENV === "production") return env.SF6DNA_LATEST_VIDEO_PRODUCTION === "1";
  return true;
}

export function youtubeIdFromUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    const id = host === "youtu.be" ? url.pathname.slice(1).split("/")[0]
      : host === "youtube.com" ? (url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null)
      : null;
    return id && ID.test(id) ? id : null;
  } catch { return null; }
}

type RawCandidate = { videoId: string; title: string | null; channelTitle: string | null; publishedAt: string | null; availability: string };

/** Public only, valid ID, de-duplicated (also against excluded IDs), newest first. */
export function normalizeLatestHits(rows: readonly RawCandidate[], exclude: ReadonlySet<string> = new Set(), limit = LATEST_VIDEO_MAX_PER_CATEGORY): LatestVideoHit[] {
  const seen = new Set(exclude);
  const hits: LatestVideoHit[] = [];
  for (const row of rows) {
    const time = row.publishedAt ? Date.parse(row.publishedAt) : NaN;
    if (row.availability !== "PUBLIC" || !ID.test(row.videoId) || seen.has(row.videoId) || !row.title?.trim() || Number.isNaN(time)) continue;
    seen.add(row.videoId);
    hits.push({ videoId: row.videoId, title: row.title.trim(), channelTitle: row.channelTitle, publishedAt: new Date(time).toISOString(),
      watchUrl: `https://www.youtube.com/watch?v=${row.videoId}`, thumbnailUrl: `https://i.ytimg.com/vi/${row.videoId}/hqdefault.jpg` });
  }
  return hits.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, limit);
}

/** In-process daily budget for upstream refreshes. Cache hits do not consume it. */
/** After an upstream failure, this instance waits before retrying (limits retry storms across instances). */
export const LATEST_VIDEO_FAILURE_COOLDOWN_MS = 30 * 60000;
/**
 * Per-instance backstop. On Vercel each instance has its own counter, so the worst case is
 * instances × limit; the shared Next Data Cache (24h) is what keeps successful refreshes to ~1/category/day.
 */
export function createQuotaGuard(limit = LATEST_VIDEO_DAILY_FETCH_LIMIT, now: () => number = Date.now, cooldownMs = LATEST_VIDEO_FAILURE_COOLDOWN_MS) {
  let day = "", used = 0, blockedUntil = 0;
  return {
    noteFailure(): void { blockedUntil = now() + cooldownMs; },
    tryConsume(): boolean {
      if (now() < blockedUntil) return false;
      const today = new Date(now()).toISOString().slice(0, 10);
      if (today !== day) { day = today; used = 0; }
      if (used >= limit) return false;
      used += 1;
      return true;
    },
    remaining(): number {
      const today = new Date(now()).toISOString().slice(0, 10);
      return today === day ? Math.max(0, limit - used) : limit;
    },
  };
}

export function publishedAfter(now: number, days = LATEST_VIDEO_LOOKBACK_DAYS): string {
  return new Date(now - days * 86400000).toISOString();
}
