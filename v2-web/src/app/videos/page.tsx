import { publicPageMetadata } from "@/lib/public-page-metadata";
export const dynamic = "force-dynamic";

import { listVideos } from "@/lib/event-media";
import { VideoLibrary } from "@/components/video-library";
import { videoPlayerFromQuery, videoEntityIdFromQuery } from "@/lib/video-player-filter";

export const metadata = publicPageMetadata("/videos", { title: "動画" });

export default async function VideosPage({ searchParams }: {
  searchParams: Promise<{ player?: string | string[]; playerId?: string | string[]; characterId?: string | string[] }>;
}) {
  const params = await searchParams;
  const player = videoPlayerFromQuery(params.player);
  const playerId = videoEntityIdFromQuery(params.playerId);
  const characterId = videoEntityIdFromQuery(params.characterId);
  const invalidFilter = (params.playerId !== undefined && !playerId) || (params.characterId !== undefined && !characterId);
  const videos = invalidFilter ? [] : await listVideos({ playerId: playerId ?? undefined, characterId: characterId ?? undefined });

  return (
    <div className="site-shell page-stack experience-video">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画から、次のヒントを。</h1>
        <p>攻略・対戦・大会などの動画を探せます。</p><p className="experience-video-note">お気に入りは「また見たい動画」、視聴済みは「見終えた動画」の目印です。</p>
      </section>

      {videos.length ? (
        <VideoLibrary videos={videos} initialPlayer={playerId ? null : player} key={player ?? "all"} />
      ) : (
        <section className="empty-state">
          <h2>{playerId || characterId ? "条件に合う公開動画はまだありません" : "公開済み動画はまだありません"}</h2>
          <p>掲載できる動画から順次追加します。</p>
        </section>
      )}
    </div>
  );
}
