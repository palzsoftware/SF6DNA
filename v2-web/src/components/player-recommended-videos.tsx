export type PlayerVideoRecommendation = {
  key: string; playerSlug: string; title: string; youtubeId: string;
  channelName: string; reason: string;
  /** 「配信・ランクマ」は本人の配信やランクマッチでの使用。本人が解説している動画（本人解説）とは区別する。 */
  kind: "本人解説" | "大会対戦" | "配信・ランクマ";
  relationConfirmed: boolean; publicationApproval: "PENDING" | "APPROVED";
  /** 動画で使われているキャラ。キャラクター詳細ページ(/characters/[slug])へのリンクに使う。任意。 */
  characterLinks?: readonly { slug: string; name: string }[];
  /** 映像で確認した試合（ゲーム）の開始位置（秒）。0 はクリップ全体が当該試合。任意。 */
  startSeconds?: number;
  /**
   * 同じ試合を収めたフル配信。この項目があると、同じ選手のフル配信カードは別に表示せず、このカードの中にリンクとして出す。
   * startSeconds は映像で確認した開始位置だけを入れる（概要欄の章など未照合の時刻は chapterNote に原文のまま残す）。
   */
  sameMatchFullStream?: { youtubeId: string; startSeconds: number | null; chapterNote?: string | null };
};
const CHARACTER_SLUG = /^[a-z][a-z0-9-]{0,30}$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const validStart = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 86400;
export function youtubeWatchUrl(youtubeId: string, startSeconds?: number | null) {
  return `https://www.youtube.com/watch?v=${youtubeId}${validStart(startSeconds) && startSeconds > 0 ? `&t=${startSeconds}s` : ""}`;
}
export function formatVideoTimestamp(seconds: number) {
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
export function PlayerRecommendedVideos({ playerSlug, items, draftPreview = false }: {
  playerSlug: string; items: readonly PlayerVideoRecommendation[]; draftPreview?: boolean;
}) {
  const visible = (item: PlayerVideoRecommendation) => item.playerSlug === playerSlug && item.relationConfirmed &&
    YOUTUBE_ID.test(item.youtubeId) && (draftPreview || item.publicationApproval === "APPROVED");
  // Same match: the single-match clip card carries the full stream, so the separate full-stream card is not shown twice.
  const coveredFullStreams = new Set(items.filter(visible).map(item => item.sameMatchFullStream?.youtubeId)
    .filter((id): id is string => typeof id === "string" && YOUTUBE_ID.test(id)));
  const seen = new Set<string>();
  const accepted = items.filter(item => {
    if (!visible(item) || seen.has(item.youtubeId) || (coveredFullStreams.has(item.youtubeId) && !item.sameMatchFullStream)) return false;
    seen.add(item.youtubeId); return true;
  });
  if (!accepted.length) return null;
  return <section className="info-panel" aria-label="おすすめ動画">
    <h2>おすすめ動画</h2>
    {draftPreview ? <p>掲載前の確認用です。動画公開時点の内容をご確認ください。</p> : null}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
      {accepted.map(item => {
        const start = validStart(item.startSeconds) ? item.startSeconds : null;
        const watch = youtubeWatchUrl(item.youtubeId, start);
        const full = item.sameMatchFullStream && YOUTUBE_ID.test(item.sameMatchFullStream.youtubeId) ? item.sameMatchFullStream : null;
        const fullStart = full && validStart(full.startSeconds) ? full.startSeconds : null;
        return <article className="video-card" key={item.key} data-recommendation-key={item.key} style={{ minWidth: 0, overflowWrap: "anywhere" }}>
          <a className="video-card__thumbnail" href={watch} target="_blank" rel="noopener noreferrer" aria-label={`${item.title}をYouTubeで再生`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail with reserved aspect ratio. */}
            <img src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`} alt={item.title} width={480} height={270} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "cover" }} />
          </a>
          <div className="video-card__body"><span>{item.kind}</span><h3>{item.title}</h3><p>{item.channelName}</p><p>{item.reason}</p>
            {item.characterLinks?.some(c => CHARACTER_SLUG.test(c.slug)) ? <p>キャラクター: {item.characterLinks.filter(c => CHARACTER_SLUG.test(c.slug)).map((c, i) => <span key={c.slug}>{i ? "、" : ""}<a href={`/characters/${c.slug}`}>{c.name}</a></span>)}</p> : null}
            {start !== null ? <p data-video-start={start}>開始時刻: {formatVideoTimestamp(start)}{start === 0 ? "（動画の最初から当該試合）" : "（試合の開始位置）"}</p> : null}
            <a href={watch} target="_blank" rel="noopener noreferrer">{start ? `YouTubeで再生（${formatVideoTimestamp(start)}から） ↗` : "YouTubeで再生 ↗"}</a>
            {full ? <p data-same-match-full-stream={full.youtubeId}><a href={youtubeWatchUrl(full.youtubeId, fullStart)} target="_blank" rel="noopener noreferrer">{fullStart !== null ? `同じ試合のフル配信（${formatVideoTimestamp(fullStart)}から） ↗` : "同じ試合のフル配信 ↗"}</a>{fullStart === null && full.chapterNote ? <small>（{full.chapterNote}）</small> : null}</p> : null}
          </div>
        </article>;
      })}
    </div>
  </section>;
}
