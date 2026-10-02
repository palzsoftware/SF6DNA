import type { SourceReference } from "@/types/character";

/** URL identity only, never a synthetic Video entity. */
export function getYouTubeVideoId(value: string): string | null {
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  const id = host === "youtu.be" ? url.pathname.slice(1)
    : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
      ? url.searchParams.get("v") ?? url.pathname.match(/^\/(?:live|shorts|embed)\/([^/]+)\/?$/)?.[1] : null;
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
export function uniqueCharacterVideos<T extends { id: string; url: string }>(videos: T[]): T[] {
  const ids = new Set<string>(), identities = new Set<string>();
  return videos.filter(video => {
    const identity = getYouTubeVideoId(video.url) ?? video.url;
    if (ids.has(video.id) || identities.has(identity)) return false;
    ids.add(video.id); identities.add(identity); return true;
  });
}
/** Public references remain references, never synthetic Video entities. */
export function characterVideoReferences(sources: SourceReference[], existingUrls: string[]) {
  const seen = new Set(existingUrls.map(url => getYouTubeVideoId(url) ?? url));
  return sources.flatMap(source => {
    if (!["guide_reference", "supporting", "primary", "reference"].includes(source.relationship)) return [];
    const id = getYouTubeVideoId(source.url);
    if (!id || seen.has(id)) return [];
    seen.add(id);
    return [{ ...source, thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }];
  });
}
