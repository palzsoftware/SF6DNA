import { VideoSearchForm, VideoSearchResults } from "@/components/video-search-panel";
import { parseVideoSearchFilters, videoSearchQuery, type VideoSearchParams } from "@/lib/video-search-filters";
import { Suspense } from "react";
import { AutoVideoLoading } from "@/components/auto-youtube-videos";
import { autoVideoEnabled } from "@/lib/auto-youtube-videos";
import { publicPageMetadata } from "@/lib/public-page-metadata";
export const dynamic = "force-dynamic";

import { listVideosResult } from "@/lib/event-media";
import Link from "next/link";
import { VideoRetrievalStatus } from "@/components/video-retrieval-status";
import { VideoLibrary } from "@/components/video-library";
import { getRegisteredVideoLearning } from "@/lib/video-learning-registered";
import { videoPlayerFromQuery, videoEntityIdFromQuery } from "@/lib/video-player-filter";
import { youtubeVideoIdFromUrl } from "@/lib/character-related-video-contract.mjs";
import { getAllPreviewVideoCandidates } from "@/lib/character-video-preview";

export const metadata = publicPageMetadata("/videos", { title: "動画" });

export default async function VideosPage({ searchParams }: {
  searchParams: Promise<VideoSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseVideoSearchFilters(params);
  const listingQuery = filters.valid ? videoSearchQuery(filters) : "";
  const sortChoices = ["recommended","newest","oldest","favorite","unwatched","watched"] as const;
  const selectedSort = typeof params.sort === "string" && sortChoices.some(value => value === params.sort) ? params.sort as typeof sortChoices[number] : "recommended";
  const candidateCatalog = process.env.VERCEL_ENV === "preview" ? getAllPreviewVideoCandidates() : [];
  const availablePreviewPlayers = [...new Set(candidateCatalog.flatMap(video => video.players))].sort((a,b) => a.localeCompare(b,"ja"));
  const selectedPreviewPlayer = typeof params.previewPlayer === "string" && availablePreviewPlayers.includes(params.previewPlayer) ? params.previewPlayer : "all";
  const selectedPreviewKind = filters.kind === "guide" || filters.kind === "combo" ? "guide" : filters.kind === "match" ? "match" : filters.kind === "counter" ? "counter" : "all";
  const player = videoPlayerFromQuery(params.player);
  const playerId = videoEntityIdFromQuery(params.playerId);
  const characterId = videoEntityIdFromQuery(params.characterId);
  const tournamentId = videoEntityIdFromQuery(params.tournamentId);
  const invalidFilter = (params.playerId !== undefined && !playerId) || (params.characterId !== undefined && !characterId) || (params.tournamentId !== undefined && !tournamentId);
  const result = invalidFilter
    ? { state: "RELATION_UNRESOLVED" as const, items: [], warnings: ["INVALID_FILTER"] }
    : await listVideosResult({ playerId: playerId ?? undefined, characterId: characterId ?? undefined, tournamentId: tournamentId ?? undefined });
  const hasServerFilters = Boolean(playerId || characterId || tournamentId);
  const showPreviewCandidates = process.env.VERCEL_ENV === "preview" && !invalidFilter && !hasServerFilters && !player;
  const publishedIds = new Set(result.items.flatMap(video => {
    const youtubeId = youtubeVideoIdFromUrl(video.url);
    return youtubeId ? [youtubeId] : [];
  }));
  const previewVideos = showPreviewCandidates ? candidateCatalog.filter(video => {
    const youtubeId = youtubeVideoIdFromUrl(video.url);
    return youtubeId !== null && !publishedIds.has(youtubeId);
  }) : [];
  // Preview candidates must be registered explicitly and remain outside public approval.
  const displayedVideos = showPreviewCandidates ? [...result.items, ...previewVideos] : result.items;

  return (
    <div className="site-shell page-stack experience-video">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画から、次のヒントを。</h1>
        <p>攻略・対戦・大会などの動画を探せます。</p><p className="experience-video-note">お気に入りは「また見たい動画」、視聴済みは「見終えた動画」の目印です。</p>
      </section>

      {hasServerFilters ? <p>指定された条件で表示しています。 <Link href="/videos">指定条件を解除</Link></p> : null}
      <VideoSearchForm key={JSON.stringify(params)} filters={filters} params={params} playerOptions={showPreviewCandidates ? availablePreviewPlayers : []} />
      {autoVideoEnabled() ? <Suspense key={JSON.stringify(params)} fallback={<AutoVideoLoading />}><VideoSearchResults filters={filters}
        exact={{ playerId, characterId, tournamentId, player, invalidFilter }} /></Suspense> : null}

      <section aria-label="掲載動画"><h2>掲載動画</h2>
        <p>{showPreviewCandidates ? "掲載済み動画とPreview限定の検証候補をまとめて表示しています。候補の出演者・使用キャラ・現行パッチ適合性は未確認です。" : "掲載済みの動画です。上の検索条件はYouTube検索に使用します。"}</p>
        {displayedVideos.length > 0 ? <VideoLibrary videos={displayedVideos}
          learningRecords={getRegisteredVideoLearning(result.items)}
          initialPlayer={playerId ? null : player}
          previewCandidates={showPreviewCandidates}
          initialQuery={listingQuery} hideSearchInput listingOnly
          initialSort={selectedSort} initialPreviewKind={showPreviewCandidates ? selectedPreviewKind : "all"} initialPreviewPlayer={showPreviewCandidates ? selectedPreviewPlayer : "all"}
          key={[player, playerId, characterId, tournamentId, showPreviewCandidates, listingQuery, selectedSort, selectedPreviewKind, selectedPreviewPlayer].join(":")} />
          : result.state === "SUCCESS_EMPTY" ? <p>掲載動画は準備中です。上のYouTube検索もご利用ください。</p>
          : <VideoRetrievalStatus state={result.state} invalidFilter={invalidFilter} />}
        {showPreviewCandidates && result.state !== "SUCCESS_WITH_RESULTS" && result.state !== "SUCCESS_EMPTY" ? <VideoRetrievalStatus state={result.state} invalidFilter={invalidFilter} /> : null}
      </section>

    </div>
  );
}
