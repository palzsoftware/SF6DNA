import Link from "next/link";
import { listVideos } from "@/lib/event-media";

export const metadata = { title: "動画" };

export default async function VideosPage() {
  const videos = await listVideos();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画</h1>
        <p>攻略、対策、コンボ、大会試合など、公開済みの動画データを確認できます。</p>
      </section>

      {videos.length ? (
        <section className="search-result-list">
          {videos.map((video) => (
            <Link className="search-result" href={`/videos/${video.slug}`} key={video.id}>
              <span className="search-result__type">{[video.platform, video.videoType].filter(Boolean).join(" / ") || "VIDEO"}</span>
              <strong>{video.title}</strong>
              {video.description ? <span>{video.description}</span> : null}
              {video.publishedAt ? <small>{video.publishedAt}</small> : null}
            </Link>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開済み動画はまだありません</h2>
          <p>draft動画は公開画面へ表示しません。</p>
        </section>
      )}
    </div>
  );
}
