import { autoVideoEnabled, getAutoVideos } from "@/lib/auto-youtube-videos";
import { autoVideoFilterNames, autoVideoEnglishNames } from "@/lib/auto-video-filter-names";
const DETAIL_KINDS = ["all", "guide", "match", "combo"] as const;
import { AutoVideoResults } from "./auto-video-results";
export { AutoVideoResults } from "./auto-video-results";

export async function AutoYouTubeVideos({ names, englishNames }: { names: readonly string[]; englishNames?: readonly string[] }) {
  if (!autoVideoEnabled()) return null;
  const results = await Promise.all(DETAIL_KINDS.map(kind => getAutoVideos(names, kind)));
  return <AutoVideoResults key={JSON.stringify(names)} result={results[0]}
    searches={{ all: results[0], guide: results[1], match: results[2], combo: results[3] }}
    names={names} englishNames={englishNames} />;
}
export async function FilteredAutoYouTubeVideos(props: Parameters<typeof autoVideoFilterNames>[0]) {
  if (!autoVideoEnabled()) return null;
  const names = await autoVideoFilterNames(props);
  if (names === null) return null;
  return <AutoYouTubeVideos names={names} englishNames={await autoVideoEnglishNames(names, props.characterId)} />;
}
export function AutoVideoLoading() {
  if (!autoVideoEnabled()) return null;
  return <p role="status" aria-busy="true">YouTubeの動画を検索しています。</p>;
}
