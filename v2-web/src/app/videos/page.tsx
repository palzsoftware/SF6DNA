import { VideoSearchForm, VideoSearchResults } from "@/components/video-search-panel";
import { parseVideoSearchFilters, type VideoSearchParams } from "@/lib/video-search-filters";
import { Suspense } from "react";
import { AutoVideoLoading } from "@/components/auto-youtube-videos";
import { LatestYouTubeVideos } from "@/components/latest-youtube-videos";
import { publicPageMetadata } from "@/lib/public-page-metadata";
export const dynamic = "force-dynamic";

import { listVideosResult } from "@/lib/event-media";
import Link from "next/link";
import { VideoRetrievalStatus } from "@/components/video-retrieval-status";
import { VideoLibrary } from "@/components/video-library";
import { getRegisteredVideoLearning } from "@/lib/video-learning-registered";
import { videoPlayerFromQuery, videoEntityIdFromQuery } from "@/lib/video-player-filter";
import { headers } from "next/headers";
import { playerLocalPreviewEnabled } from "@/lib/player-local-preview";
import { registeredYouTubeVideos, mergeWithListedVideos } from "@/lib/registered-youtube-videos";

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
  // Registered YouTube data (same projection as character pages and Player図鑑). APPROVED rows only,
  // unless loopback local preview is on. DB rows keep priority; duplicates by YouTube ID are dropped.
  let environment = "";
  try { environment = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname.split(".")[0]; } catch { /* unknown environment: nothing registered */ }
  const registered = invalidFilter || tournamentId ? [] : registeredYouTubeVideos(environment, playerLocalPreviewEnabled(process.env, (await headers()).get("host")))
    .filter(v => (!playerId || v.entityRefs?.players.some(p => p.id === playerId)) && (!characterId || v.entityRefs?.characters.some(c => c.id === characterId)));
  const listedOk = result.state === "SUCCESS_WITH_RESULTS" || result.state === "SUCCESS_EMPTY";
  const youtubeSearchActive = ["character", "playerName", "kind", "topic", "targetRank", "level", "control", "tournament", "language"]
    .some(key => typeof params[key] === "string" && (params[key] as string).trim() !== "");
  const libraryVideos = mergeWithListedVideos(result.state === "SUCCESS_WITH_RESULTS" ? result.items : [], registered);

  return (
    <div className="site-shell page-stack experience-video">
      <section className="hero">
        <p className="eyebrow">VIDEOS</p>
        <h1>動画リスト</h1>
        <p>攻略・対戦・大会などの動画を探せます。</p><p className="experience-video-note">お気に入りは「また見たい動画」、視聴済みは「見終えた動画」の目印です。</p>
      </section>

      <nav aria-label="動画リスト内の移動">
        <ul>
          <li><a href="#listed-videos">掲載動画から探す</a></li>
          <li><a href="#youtube-search">YouTube全体から探す</a></li>
        </ul>
      </nav>

      {hasServerFilters || invalidFilter ? (
        <p>{invalidFilter ? "指定された条件を確認できませんでした。" : "指定された条件で表示しています。"} <Link href="/videos">指定条件を解除</Link></p>
      ) : null}
      {/* The listed videos carry the page's one main search box. */}
      <section id="listed-videos" aria-labelledby="listed-videos-title"><h2 id="listed-videos-title">掲載動画</h2>
      {libraryVideos.length && (listedOk || registered.length) ? (
        <VideoLibrary videos={libraryVideos} learningRecords={getRegisteredVideoLearning(libraryVideos)} initialPlayer={playerId ? null : player} key={[player, playerId, characterId, tournamentId].join(":")} />
      ) : result.state === "SUCCESS_EMPTY" ? <p>掲載動画は準備中です。下の「YouTube全体から探す」もご利用ください。</p>
        : <VideoRetrievalStatus state={result.state} invalidFilter={invalidFilter} />}
      </section>

      {/* YouTube search (URL parameters unchanged) is folded away; it opens when the URL already carries its conditions. */}
      <details id="youtube-search" className="experience-video-external" open={youtubeSearchActive}>
      <summary><h2 id="youtube-search-title">YouTube全体から探す（外部の検索結果）</h2></summary>
      <VideoSearchForm key={`form:${JSON.stringify(params)}`} filters={filters} params={params} />
      <Suspense key={`results:${JSON.stringify(params)}`} fallback={<AutoVideoLoading />}><VideoSearchResults filters={filters}
        exact={{ playerId, characterId, tournamentId, player, invalidFilter }} /></Suspense>
      </details>

      <Suspense fallback={null}><LatestYouTubeVideos /></Suspense>


    </div>
  );
}
