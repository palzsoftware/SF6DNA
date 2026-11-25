import { attachPlayerTeamResults, playerDetailSupplements } from "@/components/player-detail-supplements";
import { headers } from "next/headers";
import { playerLocalPreviewEnabled } from "@/lib/player-local-preview";
import { Suspense } from "react";
import { AutoYouTubeVideos, AutoVideoLoading } from "@/components/auto-youtube-videos";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { getPlayerBySlug } from "@/lib/players";
import { listVideosResult } from "@/lib/event-media";
import { PlayerProfile } from "@/components/player-profile";
import { notFound } from "next/navigation";
import { safePlayerDirectoryReturn } from "@/lib/player-directory-navigation";
import { registeredYouTubeVideos, mergeWithListedVideos } from "@/lib/registered-youtube-videos";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  return publicPageMetadata(`/players/${encodeURIComponent(slug)}`, { title: player ? `${player.displayName} | プレイヤー情報` : "プレイヤー情報", description: player ? `${player.displayName}の使用キャラクターやプロフィールを紹介します。` : undefined }, Boolean(player));
}

export default async function PlayerDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) notFound();
  const related = await listVideosResult({ playerId: player.id, limit: 8 });
  const query = await searchParams;
  const directoryHref = safePlayerDirectoryReturn(query.returnTo);
  let researchEnvironment = "";
  try { researchEnvironment = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname.split(".")[0]; } catch { /* Unknown environment keeps supplements hidden. */ }
  const preview = playerLocalPreviewEnabled(process.env, (await headers()).get("host"));
  // The reviewed player videos are shown in the existing 関連動画 section (shared data with /videos and character pages),
  // so the separate recommended-video card list is not rendered to avoid showing the same video twice.
  const { recommendedVideoSection: _recommended, ...supplements } = playerDetailSupplements(player, researchEnvironment, preview);
  void _recommended;
  const registered = registeredYouTubeVideos(researchEnvironment, preview, { onlyPlayerId: player.id });
  const listed = related.state === "SUCCESS_WITH_RESULTS" ? related.items : [];
  const relatedVideos = mergeWithListedVideos(listed, registered);
  const relatedVideoState = relatedVideos.length ? "SUCCESS_WITH_RESULTS" as const : related.state;
  const displayPlayer = attachPlayerTeamResults(player, researchEnvironment, undefined, preview);
  return <PlayerProfile {...supplements} automaticVideos={<Suspense fallback={<AutoVideoLoading />}><AutoYouTubeVideos names={[player.displayName]} /></Suspense>} player={displayPlayer} relatedVideos={relatedVideos} relatedVideoState={relatedVideoState} directoryHref={directoryHref} />;
}
