export const dynamic = "force-dynamic";

import { listVideos } from "@/lib/event-media";
import { VideoLibrary } from "@/components/video-library";

export const metadata = { title: "動画" };

export default async function VideosPage() {
  const videos = await listVideos();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画</h1>
        <p>攻略・対戦・大会などの動画を探せます。</p>
      </section>

      {videos.length ? (
        <VideoLibrary videos={videos} />
      ) : (
        <section className="empty-state">
          <h2>公開済み動画はまだありません</h2>
          <p>掲載できる動画から順次追加します。</p>
        </section>
      )}
    </div>
  );
}
