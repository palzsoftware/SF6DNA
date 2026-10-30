export type PlayerVideoRecommendation = {
  key: string; playerSlug: string; title: string; youtubeId: string;
  channelName: string; reason: string; kind: "本人解説" | "大会対戦";
  relationConfirmed: boolean; publicationApproval: "PENDING" | "APPROVED";
};
export function PlayerRecommendedVideos({ playerSlug, items, draftPreview = false }: {
  playerSlug: string; items: readonly PlayerVideoRecommendation[]; draftPreview?: boolean;
}) {
  const seen = new Set<string>();
  const accepted = items.filter(item => {
    if (item.playerSlug !== playerSlug || !item.relationConfirmed ||
      !/^[A-Za-z0-9_-]{11}$/.test(item.youtubeId) ||
      (!draftPreview && item.publicationApproval !== "APPROVED") || seen.has(item.youtubeId)) return false;
    seen.add(item.youtubeId); return true;
  });
  if (!accepted.length) return null;
  return <section className="info-panel" aria-label="おすすめ動画">
    <h2>おすすめ動画</h2>
    {draftPreview ? <p>掲載前の確認用です。動画公開時点の内容をご確認ください。</p> : null}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
      {accepted.map(item => <article className="video-card" key={item.key} style={{ minWidth: 0, overflowWrap: "anywhere" }}>
        <a className="video-card__thumbnail" href={`https://www.youtube.com/watch?v=${item.youtubeId}`} target="_blank" rel="noopener noreferrer" aria-label={`${item.title}をYouTubeで再生`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail with reserved aspect ratio. */}
          <img src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`} alt={item.title} width={480} height={270} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "cover" }} />
        </a>
        <div className="video-card__body"><span>{item.kind}</span><h3>{item.title}</h3><p>{item.channelName}</p><p>{item.reason}</p>
          <a href={`https://www.youtube.com/watch?v=${item.youtubeId}`} target="_blank" rel="noopener noreferrer">YouTubeで再生 ↗</a>
        </div>
      </article>)}
    </div>
  </section>;
}
