import { VideoSearchForm, VideoSearchResults } from "@/components/video-search-panel";
import { parseVideoSearchFilters, type VideoSearchParams } from "@/lib/video-search-filters";
import { Suspense } from "react";
import { AutoVideoLoading } from "@/components/auto-youtube-videos";
import { publicPageMetadata } from "@/lib/public-page-metadata";
export const dynamic = "force-dynamic";

import { listVideosResult } from "@/lib/event-media";
import Link from "next/link";
import { VideoRetrievalStatus } from "@/components/video-retrieval-status";
import { VideoLibrary } from "@/components/video-library";
import { getRegisteredVideoLearning } from "@/lib/video-learning-registered";
import { videoPlayerFromQuery, videoEntityIdFromQuery } from "@/lib/video-player-filter";

export const metadata = publicPageMetadata("/videos", { title: "動画" });

export default async function VideosPage({ searchParams }: {
  searchParams: Promise<VideoSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseVideoSearchFilters(params);
  const player = videoPlayerFromQuery(params.player);
  const playerId = videoEntityIdFromQuery(params.playerId);
  const characterId = videoEntityIdFromQuery(params.characterId);
  const tournamentId = videoEntityIdFromQuery(params.tournamentId);
  const invalidFilter = (params.playerId !== undefined && !playerId) || (params.characterId !== undefined && !characterId) || (params.tournamentId !== undefined && !tournamentId);
  const result = invalidFilter
    ? { state: "RELATION_UNRESOLVED" as const, items: [], warnings: ["INVALID_FILTER"] }
    : await listVideosResult({ playerId: playerId ?? undefined, characterId: characterId ?? undefined, tournamentId: tournamentId ?? undefined });
  const hasServerFilters = Boolean(playerId || characterId || tournamentId);

  return (
    <div className="site-shell page-stack experience-video">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画から、次のヒントを。</h1>
        <p>攻略・対戦・大会などの動画を探せます。</p><p className="experience-video-note">お気に入りは「また見たい動画」、視聴済みは「見終えた動画」の目印です。</p>
      </section>

      {process.env.VERCEL_ENV === "preview" ? <p><Link href="/videos/ryu-preview">リュウ動画カード9件のPreview候補を見る</Link>（非公開・未承認）</p> : null}
      {hasServerFilters ? <p>指定された条件で表示しています。 <Link href="/videos">指定条件を解除</Link></p> : null}
      <VideoSearchForm key={JSON.stringify(params)} filters={filters} params={params} />
      <Suspense key={JSON.stringify(params)} fallback={<AutoVideoLoading />}><VideoSearchResults filters={filters}
        exact={{ playerId, characterId, tournamentId, player, invalidFilter }} /></Suspense>

      <section aria-label="掲載動画"><h2>掲載動画</h2><p>こちらは掲載済みの動画です。上の検索条件はYouTube検索に使用します。</p>
      {result.state === "SUCCESS_WITH_RESULTS" ? (
        <VideoLibrary videos={result.items} learningRecords={getRegisteredVideoLearning(result.items)} initialPlayer={playerId ? null : player} key={[player, playerId, characterId, tournamentId].join(":")} />
      ) : result.state === "SUCCESS_EMPTY" ? <p>掲載動画は準備中です。上のYouTube検索もご利用ください。</p>
        : <VideoRetrievalStatus state={result.state} invalidFilter={invalidFilter} />}
      </section>


    </div>
  );
}
