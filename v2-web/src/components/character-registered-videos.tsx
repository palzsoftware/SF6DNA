import registered from "../data/character-videos/registered.json";
import playerVideos from "../data/player-research/videos.json";
import { youtubeWatchUrl, type PlayerVideoRecommendation } from "./player-recommended-videos";

export type CharacterRegisteredVideo = {
  key: string; characterSlug: string | null; youtubeId: string; title: string; channelName: string; sourceDate: string;
  category: "解説"; origin: string; playerSlug: string | null; evidenceBasis: string; caution: string | null;
  publicationApproval: "PENDING" | "APPROVED";
};
type Card = { key: string; youtubeId: string; title: string; channelName: string; note: string; startSeconds: number | null };
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * 解説: registered character videos (official guides and player explainers).
 * 対戦: player match rows linked to this character. Each video appears once; a full stream already covered
 * by a single-match clip is not shown separately. Pending rows appear only in local preview.
 */
export function characterRegisteredVideoGroups(characterSlug: string, preview: boolean,
  guides: readonly CharacterRegisteredVideo[] = registered as CharacterRegisteredVideo[],
  matches: readonly PlayerVideoRecommendation[] = playerVideos as PlayerVideoRecommendation[]) {
  const allowed = (approval: string) => preview || approval === "APPROVED";
  const seen = new Set<string>();
  const once = (id: string) => YOUTUBE_ID.test(id) && !seen.has(id) && Boolean(seen.add(id));
  const guide: Card[] = guides.filter(v => v.characterSlug === characterSlug && allowed(v.publicationApproval) && once(v.youtubeId))
    .map(v => ({ key: v.key, youtubeId: v.youtubeId, title: v.title, channelName: v.channelName, startSeconds: null,
      note: [v.origin, v.sourceDate && `公開日 ${v.sourceDate}`, v.caution].filter(Boolean).join("・") }));
  const linked = matches.filter(v => v.kind === "大会対戦" && v.relationConfirmed && allowed(v.publicationApproval)
    && v.characterLinks?.some(c => c.slug === characterSlug));
  const covered = new Set(linked.map(v => v.sameMatchFullStream?.youtubeId).filter(Boolean));
  const match: Card[] = linked.filter(v => !(covered.has(v.youtubeId) && !v.sameMatchFullStream) && once(v.youtubeId))
    .map(v => ({ key: v.key, youtubeId: v.youtubeId, title: v.title, channelName: v.channelName,
      startSeconds: typeof v.startSeconds === "number" && v.startSeconds > 0 ? v.startSeconds : null, note: v.reason }));
  return { guide, match };
}

function CardList({ cards }: { cards: readonly Card[] }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
    {cards.map(card => <article className="video-card" key={card.key} data-registered-video={card.youtubeId} style={{ minWidth: 0, overflowWrap: "anywhere" }}>
      <a className="video-card__thumbnail" href={youtubeWatchUrl(card.youtubeId, card.startSeconds)} target="_blank" rel="noopener noreferrer" aria-label={`${card.title}をYouTubeで再生`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail with reserved aspect ratio. */}
        <img src={`https://i.ytimg.com/vi/${card.youtubeId}/hqdefault.jpg`} alt={card.title} width={480} height={270} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "cover" }} />
      </a>
      <div className="video-card__body"><h3>{card.title}</h3><p>{card.channelName}</p><p>{card.note}</p></div>
    </article>)}
  </div>;
}

export function CharacterRegisteredVideos({ characterSlug, preview }: { characterSlug: string; preview: boolean }) {
  const { guide, match } = characterRegisteredVideoGroups(characterSlug, preview);
  if (!guide.length && !match.length) return null;
  return <div data-character-registered-videos={characterSlug}>
    {preview ? <p>掲載前の確認用です。登録済みの動画のみ表示しています。</p> : null}
    {guide.length ? <section aria-label="解説動画" data-video-group="guide"><h3>解説動画</h3><CardList cards={guide} /></section> : null}
    {match.length ? <section aria-label="対戦動画" data-video-group="match"><h3>対戦動画</h3><CardList cards={match} /></section> : null}
  </div>;
}
