import { VideoCard } from "./video-card";
import { formatVideoPublishedDate } from "../lib/event-media";
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
  const list = (videos: RegisteredVideo[]) => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>{videos.map(video =>
    <div key={video.id} data-registered-video={video.id.replace("youtube:", "")}><VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} /></div>)}</div>;
  return <div data-character-registered-videos={characterSlug}>
    {preview ? <p>掲載前の確認用です。登録済みの動画のみ表示しています。</p> : null}
    {guide.length ? <section aria-label="解説" data-video-group="guide"><h3>解説</h3>{list(guide)}</section> : null}
    {match.length ? <section aria-label="対戦" data-video-group="match"><h3>対戦</h3>{list(match)}</section> : null}
  </div>;
}
