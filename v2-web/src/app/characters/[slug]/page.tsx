import { Suspense } from "react";
import { youtubeVideoIdFromUrl } from "@/lib/character-related-video-contract.mjs";
import { headers } from "next/headers";
import { AutoYouTubeVideos, AutoVideoLoading } from "@/components/auto-youtube-videos";
import { isLukeSampleRequest } from "@/lib/luke-sample-cards";
import { projectPreviewStrategyCards } from "@/lib/strategy-card-projection";
import { projectRyuComboPreviewCards, RyuComboPreviewNotice } from "@/components/ryu-combo-preview-cards";
import { projectRyuSetplayPreviewCards, RyuSetplayPreviewNotice } from "@/components/ryu-setplay-preview-cards";
import { projectRyuSequencePreviewCards, RyuSequencePreviewNotice } from "@/components/ryu-sequence-preview-cards";
import { LukeSampleCards } from "@/components/luke-sample-cards";
import { LukeCanonicalComboReference } from "@/components/luke-canonical-combo-reference";
import { CharacterUnifiedPage } from "@/components/character-unified-page";
import { characterUnifiedEvidence } from "@/lib/character-unified-evidence";
import { projectJpSafeMoveCard } from "@/lib/jp-safe-move-reference";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { notFound } from "next/navigation";
import { getDevicePreviewMoveMotionMedia, normalizeDevicePreviewToken } from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import { listCharacterSectionItems } from "@/lib/character-sections";
import { listVideosResult } from "@/lib/event-media";
import { getPlayerBySlug } from "@/lib/players";
import { getCharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { resolveCharacterDetailData, resolveCharacterRelatedVideos } from "@/lib/character-detail-data";
import { getReleaseConfirmedMedia } from "@/lib/release-confirmed-media";
import { isCharacterDetailV2Route } from "@/lib/character-detail-route";
import { adaptCharacterDetailV2Profile } from "@/lib/character-detail-v2-profile-adapter";
import { getWs5TxtPreviewCandidate } from "@/lib/official-txt-preview-snapshot";
import { connectOfficialTxtCharacterPageData, isWs5LocalCardRequest } from "@/lib/official-txt-character-page-connection.mjs";
import type { CanonicalTxtRecord } from "@/lib/canonical-txt-connection.mjs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) return publicPageMetadata("", { title: "キャラクター情報" }, false);
  const pilotProfile = isCharacterDetailV2Route(character.slug)
    ? adaptCharacterDetailV2Profile({
        character,
        dedicatedProfile: getCharacterDetailV21Profile(character.slug),
      }).profile
    : null;

  return publicPageMetadata(`/characters/${encodeURIComponent(character.slug)}`, {
    title: `${character.name} | キャラクター情報`,
    description:
      pilotProfile?.tagline ?? character.shortDescription ?? `${character.name}の特徴、使用プレイヤー、関連動画。`,
  });
}

export default async function CharacterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[]; sample?: string | string[]; comboPreview?: string | string[]; setplayPreview?: string | string[]; sequencePreview?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const comboPreviewRequested = Array.isArray(query.comboPreview) ? query.comboPreview.includes("1") : query.comboPreview === "1";
  const setplayPreviewRequested = Array.isArray(query.setplayPreview) ? query.setplayPreview.includes("1") : query.setplayPreview === "1";
  const sequencePreviewRequested = Array.isArray(query.sequencePreview) ? query.sequencePreview.includes("1") : query.sequencePreview === "1";
  const previewToken = process.env.VERCEL_ENV === "production" ? null : normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);

  if (!character) notFound();

  const [relatedPlayers, relatedVideos] = await Promise.all([
    listCharacterSectionItems(character.id, "players"),
    listCharacterSectionItems(character.id, "videos"),
  ]);
  const production = process.env.VERCEL_ENV === "production";
  const data = await resolveCharacterDetailData(character.id, character.slug, previewToken);
  const [relatedVideoResult, moveMedia] = await Promise.all([
    listVideosResult({ characterId: character.id }),
    production ? Promise.resolve([]) : getDevicePreviewMoveMotionMedia(character.id, previewToken),
  ]);
  const allVideos = relatedVideoResult.items;
  const bundle = data.bundle ? { ...data.bundle } : null;
  if (bundle) {
    const mediaByMove = new Map(moveMedia.map(media => [media.moveId, media]));
    const confirmed = production ? new Map() : await getReleaseConfirmedMedia(character.slug, bundle.moves);
    const generatedCandidate = data.source === "fixture" &&
      ["c-viper", "elena", "sagat"].includes(character.slug);
    bundle.moves = bundle.moves.map(original => {
      const move = character.slug === "jp" ? projectJpSafeMoveCard(original, process.env.VERCEL_ENV) : original;
      return { ...move, media: production ? null : character.slug === "alex" ? move.media ?? null :
        confirmed.get(move.id) ?? (generatedCandidate ? null : mediaByMove.get(move.id) ?? move.media ?? null) };
    });
  }
  const players = (await Promise.all(relatedPlayers.map(item =>
    getPlayerBySlug(item.href.split("/").filter(Boolean).at(-1) ?? "")))).filter(player => player !== null);
  const videos = resolveCharacterRelatedVideos(allVideos,
    [...relatedVideos.map(video => video.id), ...allVideos.map(video => video.id)]);
  const registeredYoutubeIds = [...new Set(videos.flatMap(video => { const id = youtubeVideoIdFromUrl(video.url); return id ? [id] : []; }))];
  const moveEvidence = await characterUnifiedEvidence(character.slug, bundle?.moves ?? [], process.env.VERCEL_ENV);
  const admission = { nodeEnv:process.env.NODE_ENV, vercelEnv:process.env.VERCEL_ENV,
    vercel:process.env.VERCEL, enabled:process.env.SF6DNA_WS5_TXT_PREVIEW,
    host:(await headers()).get("host") };
  const txtCandidate = isWs5LocalCardRequest(admission) ? getWs5TxtPreviewCandidate(character.slug) : null;
  const connectedTxt = txtCandidate ? connectOfficialTxtCharacterPageData({ character,
    resolved:{...data,bundle}, moveEvidence, candidate:txtCandidate, admission,
    mediaRegistry:(await import("@/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json")).default,
    records:(await import("@/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json")).default as unknown as Record<string,CanonicalTxtRecord>,
  }) : null;
  const finalBundle = connectedTxt?.bundle ?? bundle;
  // Only the existing authenticated Preview RPC is eligible. Fixture/research are excluded.
  const strategyCardsAuthorized = process.env.VERCEL_ENV === "preview" && Boolean(previewToken) && data.source === "device-preview";
  const strategyCards = strategyCardsAuthorized && finalBundle ? projectPreviewStrategyCards(finalBundle) : [];
  const previewComboCards = process.env.VERCEL_ENV === "preview" && character.slug === "ryu" && comboPreviewRequested
    ? projectRyuComboPreviewCards() : [];
  const previewSetplayCards = process.env.VERCEL_ENV === "preview" && character.slug === "ryu" && setplayPreviewRequested
    ? projectRyuSetplayPreviewCards() : [];
  const previewSequenceCards = process.env.VERCEL_ENV === "preview" && character.slug === "ryu" && sequencePreviewRequested
    ? projectRyuSequencePreviewCards() : [];
  const combinedMoveEvidence = connectedTxt?.moveEvidence ?? moveEvidence;
  return <CharacterUnifiedPage automaticVideos={<Suspense fallback={<AutoVideoLoading />}><AutoYouTubeVideos names={[character.name]} englishNames={[character.nameEn || character.name]} registeredYoutubeIds={registeredYoutubeIds} /></Suspense>} character={character} bundle={finalBundle} players={players} videos={videos} videoState={relatedVideoResult.state}
    moveEvidence={combinedMoveEvidence}
    strategyCards={strategyCards} strategyCardsAuthorized={strategyCardsAuthorized} previewComboCards={previewComboCards} previewComboNotice={previewComboCards.length ? <RyuComboPreviewNotice /> : null}
    previewSetplayCards={previewSetplayCards} previewSetplayNotice={previewSetplayCards.length ? <RyuSetplayPreviewNotice /> : null}
    previewSequenceCards={previewSequenceCards} previewSequenceNotice={previewSequenceCards.length ? <RyuSequencePreviewNotice /> : null}
    localMoveReferences={!production && isLukeSampleRequest(character.slug, query.sample, process.env.VERCEL_ENV) ?
      <LukeSampleCards slug={character.slug} requested={query.sample} environment={process.env.VERCEL_ENV} moveOnly /> : null}
    localReferences={!production ? <LukeCanonicalComboReference characterSlug={character.slug} /> : null} />;
}
