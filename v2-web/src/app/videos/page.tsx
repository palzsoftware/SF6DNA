export const dynamic = "force-dynamic";

import { formatVideoPublishedDate, listVideos } from "@/lib/event-media";
import { VideoCard } from "@/components/video-card";

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
        <section className="video-card-grid">
          {videos.map((video) => (
            <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開済み動画はまだありません</h2>
          <p>公開前・確認中の動画は公開画面に表示しません。</p>
        </section>
      )}
    </div>
  );
}
