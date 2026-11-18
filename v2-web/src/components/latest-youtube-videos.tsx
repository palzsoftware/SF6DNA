import { getLatestVideoShelves } from "@/lib/latest-youtube-videos";
import type { LatestVideoShelf } from "@/lib/latest-youtube-core";
import styles from "./auto-youtube-videos.module.css";

const dateLabel = (iso: string) => new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

export function LatestVideoShelfView({ shelf }: { shelf: LatestVideoShelf }) {
  return <section className={styles.panel} data-latest-video-category={shelf.category} data-latest-video-state={shelf.state}>
    <h3>{shelf.label}</h3>
    {shelf.category !== "curated" ? <p className={styles.note}>YouTubeから自動取得した新着動画です（1日1回更新）。内容や人物の一致を保証するものではありません。</p> : null}
    {shelf.state === "FALLBACK" ? <p role="status">新着動画を取得できなかったため、SF6DNA掲載動画を表示しています。</p> : null}
    {shelf.items.length ? <ul className={styles.grid}>{shelf.items.slice(0, 12).map(video => <li key={video.videoId}>
      <a className={styles.card} href={video.watchUrl} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, not an optimized asset. */}
        <img src={video.thumbnailUrl} alt="" width={480} height={360} loading="lazy" referrerPolicy="no-referrer" />
        <div><strong>{video.title}</strong>{video.channelTitle ? <span>{video.channelTitle}</span> : null}<span><time dateTime={video.publishedAt}>{dateLabel(video.publishedAt)}</time></span><span className={styles.cta}>YouTubeで見る ↗</span></div>
      </a>
    </li>)}</ul> : <p role="status">{shelf.state === "EMPTY" ? "該当する動画はまだありません。" : "現在、動画を取得できません。時間をおいて再度お試しください。"}</p>}
  </section>;
}

/** Server component. Renders nothing unless enabled server-side (Preview/Production need separate approval). */
export async function LatestYouTubeVideos() {
  const shelves = await getLatestVideoShelves();
  if (!shelves) return null;
  return <section aria-label="新着動画"><h2>新着動画</h2>{shelves.map(shelf => <LatestVideoShelfView key={shelf.category} shelf={shelf} />)}</section>;
}
