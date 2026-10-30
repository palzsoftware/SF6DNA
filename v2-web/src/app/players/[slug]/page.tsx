import { attachPlayerTeamResults, playerDetailSupplements } from "@/components/player-detail-supplements";
import { Suspense } from "react";
import { AutoYouTubeVideos, AutoVideoLoading } from "@/components/auto-youtube-videos";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { getPlayerBySlug } from "@/lib/players";
import { listVideosResult } from "@/lib/event-media";
import { PlayerProfile } from "@/components/player-profile";
import { notFound } from "next/navigation";
import { safePlayerDirectoryReturn } from "@/lib/player-directory-navigation";

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
  const supplements = playerDetailSupplements(player, researchEnvironment);
  const displayPlayer = attachPlayerTeamResults(player, researchEnvironment);
  return <PlayerProfile {...supplements} automaticVideos={<Suspense fallback={<AutoVideoLoading />}><AutoYouTubeVideos names={[player.displayName]} /></Suspense>} player={displayPlayer} relatedVideos={related.items} relatedVideoState={related.state} directoryHref={directoryHref} />;
}
