/**
 * Derive a YouTube thumbnail only when the viewing URL itself names the video.
 * The external_id is corroboration, not a substitute for a trusted URL.
 * This function never requests the internet or changes video publication state.
 */
export function youtubeThumbnail(url: string, externalId: string | null): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;

  const host = parsed.hostname.toLowerCase();
  let candidate: string | null = null;
  if (host === "youtu.be" || host === "www.youtu.be") {
    candidate = parsed.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
  } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"].includes(host)) {
    candidate = parsed.pathname === "/watch"
      ? parsed.searchParams.get("v")
      : parsed.pathname.match(/^\/(?:live|shorts|embed|v)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
  } else if (["youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
    candidate = parsed.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
  }

  if (!candidate || !/^[A-Za-z0-9_-]{11}$/.test(candidate)) return null;
  const verifiedExternalId = externalId?.trim();
  if (verifiedExternalId && verifiedExternalId !== candidate) return null;
  return `https://i.ytimg.com/vi/${candidate}/hqdefault.jpg`;
}
