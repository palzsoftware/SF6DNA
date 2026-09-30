import type { SourceReference } from "@/types/character";

/** Public references remain references, never synthetic Video entities. */
export function characterVideoReferences(sources: SourceReference[], existingUrls: string[]) {
  const seen = new Set(existingUrls);
  return sources.flatMap((source) => {
    if (!["guide_reference", "supporting", "primary", "reference"].includes(source.relationship)) return [];
    let url: URL;
    try { url = new URL(source.url); } catch { return []; }
    if (url.protocol !== "https:") return [];
    const host = url.hostname.toLowerCase();
    const id = host === "youtu.be" ? url.pathname.slice(1)
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
        ? url.searchParams.get("v") ?? url.pathname.match(/^\/(?:live|shorts|embed)\/([^/]+)$/)?.[1] : null;
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id) || seen.has(source.url)) return [];
    seen.add(source.url);
    return [{ ...source, thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }];
  });
}
