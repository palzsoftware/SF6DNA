const YOUTUBE_HOSTS = new Set([
  "youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com",
  "youtu.be", "www.youtu.be", "youtube-nocookie.com", "www.youtube-nocookie.com",
]);
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Extract only an exact YouTube video identity from a trusted HTTPS URL shape. */
export function youtubeVideoIdFromUrl(value) {
  if (typeof value !== "string") return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;
  let candidate = null;
  if (url.hostname.toLowerCase() === "youtu.be" || url.hostname.toLowerCase() === "www.youtu.be") {
    candidate = url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
  } else if (url.pathname === "/watch") {
    candidate = url.searchParams.get("v");
  } else {
    candidate = url.pathname.match(/^\/(?:live|shorts|embed|v)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
  }
  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}

/** Preserve exact registered records while eliminating duplicate YouTube identities. */
export function dedupeCharacterRelatedVideos(videos) {
  const seenVideoIds = new Set();
  const seenYoutubeIds = new Set();
  return videos.filter(video => {
    if (!video || typeof video.id !== "string" || !video.id || seenVideoIds.has(video.id)) return false;
    const youtubeId = youtubeVideoIdFromUrl(video.url);
    if (youtubeId && seenYoutubeIds.has(youtubeId)) return false;
    seenVideoIds.add(video.id);
    if (youtubeId) seenYoutubeIds.add(youtubeId);
    return true;
  });
}

/** Search hits remain separate from registered VideoSummary records. */
export function filterUniqueAutoVideoHits(hits, registeredYoutubeIds = []) {
  const seen = new Set(registeredYoutubeIds.filter(id => typeof id === "string" && VIDEO_ID.test(id)));
  return hits.filter(hit => {
    const id = hit?.videoId;
    if (typeof id !== "string" || !VIDEO_ID.test(id) || youtubeVideoIdFromUrl(hit.watchUrl) !== id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export const CHARACTER_VIDEO_GROUPS = [
  { id: "beginner", label: "初心者用" },
  { id: "intermediate", label: "中級者用" },
  { id: "advanced", label: "上級者用" },
  { id: "match", label: "対戦動画" },
];

/** Classify only explicit structured metadata. Unknown/conflicting level data stays pending. */
export function classifyCharacterVideo(video) {
  if (video?.videoType === "match" || video?.categories?.includes("match")) return "match";
  if (["beginner", "intermediate", "advanced"].includes(video?.level)) return video.level;
  return "unclassified";
}

export function groupCharacterRelatedVideos(videos) {
  const groups = { beginner: [], intermediate: [], advanced: [], match: [], unclassified: [] };
  for (const video of dedupeCharacterRelatedVideos(videos)) groups[classifyCharacterVideo(video)].push(video);
  return groups;
}
