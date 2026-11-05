import Link from "next/link";
import { VideoCard } from "./video-card";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import { CHARACTER_VIDEO_CATEGORIES, groupCharacterVideos } from "@/lib/character-video-categories";
import { videoRetrievalMessage, type VideoRetrievalState } from "@/lib/video-retrieval-state";
import styles from "./character-related-videos.module.css";

export function CharacterRelatedVideos({ videos, state }: { videos: VideoSummary[]; state?: VideoRetrievalState }) {
  const { groups, unclassified } = groupCharacterVideos(videos);
  const resolvedState = state ?? (videos.length ? "SUCCESS_WITH_RESULTS" : "SUCCESS_EMPTY");
  const message = videoRetrievalMessage(resolvedState);
  return <div className="experience-video">
    {message ? <p role={resolvedState === "API_ERROR" ? "alert" : "status"}>{message}</p> : null}
    {CHARACTER_VIDEO_CATEGORIES.map(category => <section key={category.id} aria-labelledby={`character-video-${category.id}`} className={styles.category}>
      <h3 id={`character-video-${category.id}`}>{category.label}<span className={styles.count}>（{groups[category.id].length}件）</span></h3>
      {groups[category.id].length ? <div className={styles.rail} tabIndex={0} role="region" aria-label={`${category.label}の動画。横にスクロールできます。`}>
        {groups[category.id].map(video => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}
      </div> : <p className={styles.empty}>このカテゴリで表示できる動画はまだありません。</p>}
    </section>)}
    {unclassified.length ? <details open className={styles.pending}><summary>分類確認中の関連動画を見る（{unclassified.length}件）</summary>
      <div className={styles.rail} tabIndex={0} role="region" aria-label="分類確認中の関連動画">
        {unclassified.map(video => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}
      </div></details> : null}
    <Link className="text-link" href="/videos">動画一覧を見る →</Link>
  </div>;
}
