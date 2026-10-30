/** Server-only research intake. No DB writes, publication or inferred relations. */
import 'server-only';

export type YouTubeResearchCandidate = {
  videoId: string; title: string | null; channelTitle: string | null;
  publishedAt: string | null; description: string | null;
  thumbnailUrl: string; watchUrl: string; fetchedAt: string;
  availability: 'PUBLIC' | 'NON_PUBLIC' | 'UNAVAILABLE' | 'UNKNOWN';
  verification: 'RESEARCH_ONLY'; publicationAllowed: false;
  relatedCharacters: string[]; relatedPlayers: string[]; tournament: null;
  relationVerification: 'UNREVIEWED'; source: 'YOUTUBE_DATA_API_V3';
};
const ID = /^[A-Za-z0-9_-]{11}$/;
const SAFE_QUERY = /^[\p{L}\p{N}\s._#\-:+()\/]{2,100}$/u;
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown, limit: number) => typeof value === 'string' && value.trim() ? value.slice(0, limit) : null;

function thumbnail(value: unknown, id: string) {
  if (typeof value === 'string') {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && !url.username && !url.password && !url.port &&
          ['i.ytimg.com', 'img.youtube.com'].includes(url.hostname)) return url.href;
    } catch { /* Use the ID-derived fallback, never an arbitrary host. */ }
  }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

async function api(resource: 'search' | 'videos', params: URLSearchParams) {
  const key = process.env.YOUTUBE_DATA_API_KEY?.trim();
  if (!key) throw new Error('YOUTUBE_API_UNCONFIGURED');
  // Keep the key out of request URLs, returned records, caches and error messages.
  let response: Response;
  try {
    response = await fetch(`https://www.googleapis.com/youtube/v3/${resource}?${params}`, {
      headers: { 'X-Goog-Api-Key': key }, cache: 'no-store', redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
  } catch { throw new Error('YOUTUBE_NETWORK_ERROR'); }
  if (!response.ok) throw new Error('YOUTUBE_UPSTREAM_ERROR');
  let payload: unknown;
  try { payload = await response.json(); } catch { throw new Error('YOUTUBE_INVALID_RESPONSE'); }
  const items = record(payload).items;
  if (!Array.isArray(items)) throw new Error('YOUTUBE_INVALID_RESPONSE');
  return items as unknown[];
}

/** Missing API rows do not prove whether a video was deleted or made private. */
export async function checkYouTubeResearch(ids: readonly string[]): Promise<YouTubeResearchCandidate[]> {
  if (!ids.length || ids.length > 50 || ids.some(id => typeof id !== 'string' || !ID.test(id))) throw new Error('INVALID_VIDEO_IDS');
  const unique = [...new Set(ids)];
  const items = await api('videos', new URLSearchParams({ part: 'snippet,status', id: unique.join(',') }));
  const byId = new Map<string, Record<string, unknown>>();
  for (const item of items) {
    const row = record(item);
    if (typeof row.id === 'string' && unique.includes(row.id) && !byId.has(row.id)) byId.set(row.id, row);
  }
  const fetchedAt = new Date().toISOString();
  return unique.map(videoId => {
    const row = byId.get(videoId); const snippet = record(row?.snippet); const status = record(row?.status);
    const thumbs = record(snippet.thumbnails);
    const rawThumb = record(thumbs.medium).url ?? record(thumbs.default).url;
    const privacy = status.privacyStatus;
    const availability = !row ? 'UNAVAILABLE' : privacy === 'public' ? 'PUBLIC' :
      privacy === 'private' || privacy === 'unlisted' ? 'NON_PUBLIC' : 'UNKNOWN';
    return {
      videoId, title: text(snippet.title, 250), channelTitle: text(snippet.channelTitle, 150),
      publishedAt: text(snippet.publishedAt, 100), description: text(snippet.description, 5000),
      thumbnailUrl: thumbnail(rawThumb, videoId), watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      fetchedAt, availability, verification: 'RESEARCH_ONLY', publicationAllowed: false,
      relatedCharacters: [], relatedPlayers: [], tournament: null, relationVerification: 'UNREVIEWED',
      source: 'YOUTUBE_DATA_API_V3',
    };
  });
}

export async function searchYouTubeResearch(query: string, maxResults = 10): Promise<YouTubeResearchCandidate[]> {
  const normalized = query.trim();
  if (!SAFE_QUERY.test(normalized)) throw new Error('INVALID_QUERY');
  if (!Number.isFinite(maxResults)) throw new Error('INVALID_LIMIT');
  const limit = Math.min(25, Math.max(1, Math.floor(maxResults)));
  const items = await api('search', new URLSearchParams({ part: 'snippet', q: normalized,
    type: 'video', maxResults: String(limit), safeSearch: 'moderate' }));
  const ids = [...new Set(items.flatMap(item => {
    const id = record(record(item).id).videoId;
    return typeof id === 'string' && ID.test(id) ? [id] : [];
  }))].slice(0, limit);
  return ids.length ? checkYouTubeResearch(ids) : [];
}
