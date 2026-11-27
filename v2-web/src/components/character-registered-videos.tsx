import { CharacterVideoRail } from "./character-video-rail";
import { registeredYouTubeVideos, youtubeIdFromUrl, type RegisteredVideo } from "../lib/registered-youtube-videos";

/**
 * Character page: the shared registered YouTube data, split into 「解説」 and 「対戦」.
 * 対戦 includes ランクマ／リプレイ (usage history only). Videos already listed from the DB are not repeated.
 * Pending rows are dropped server-side unless loopback local preview is on.
 */
export function characterRegisteredVideoGroups(characterSlug: string, environment: string, preview: boolean,
  listedUrls: readonly string[] = [], videos?: readonly RegisteredVideo[]) {
  const listed = new Set(listedUrls.map(youtubeIdFromUrl).filter(Boolean));
  const fresh = (videos ?? registeredYouTubeVideos(environment, preview))
    .filter(v => v.characterSlugs.includes(characterSlug) && !listed.has(youtubeIdFromUrl(v.url)));
  return {
    guide: fresh.filter(v => v.registeredCategory === "guide"),
    match: fresh.filter(v => v.registeredCategory !== "guide"),
  };
}

export function CharacterRegisteredVideos({ characterSlug, environment, preview, listedUrls = [] }: {
  characterSlug: string; environment: string; preview: boolean; listedUrls?: readonly string[];
}) {
  const { guide, match } = characterRegisteredVideoGroups(characterSlug, environment, preview, listedUrls);
  if (!guide.length && !match.length) return null;
  // One sideways row per group (解説 / 対戦) of compact cards, with one search box over both.
  return <div data-character-registered-videos={characterSlug}>
    {preview ? <p>掲載前の確認用です。登録済みの動画のみ表示しています。</p> : null}
    <CharacterVideoRail groups={[{ key: "guide", label: "解説", videos: guide }, { key: "match", label: "対戦", videos: match }]} />
  </div>;
}
