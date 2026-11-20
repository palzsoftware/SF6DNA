import { Suspense } from "react";
import { headers } from "next/headers";
import { AutoYouTubeVideos, AutoVideoLoading } from "@/components/auto-youtube-videos";
import { isLukeSampleRequest } from "@/lib/luke-sample-cards";
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
import { listVideos } from "@/lib/event-media";
import { getPlayerBySlug } from "@/lib/players";
import { getCharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { resolveCharacterDetailData, resolveCharacterRelatedVideos } from "@/lib/character-detail-data";
import { getReleaseConfirmedMedia } from "@/lib/release-confirmed-media";
import { isCharacterDetailV2Route } from "@/lib/character-detail-route";
import { adaptCharacterDetailV2Profile } from "@/lib/character-detail-v2-profile-adapter";
import { getWs5TxtPreviewCandidate } from "@/lib/official-txt-preview-snapshot";
import { connectOfficialTxtCharacterPageData, isWs5LocalCardRequest } from "@/lib/official-txt-character-page-connection.mjs";
import { getPreReleaseCharacter, preReleaseUnifiedProps } from "@/lib/pre-release-character";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import { getWs5CharacterReview, getWs5StrategyMoveLinks, getWs5StrategyReviewDescriptions, getWs5ReviewedStrategyCards, withoutMotionMedia } from "@/lib/ws5-character-review";
import { playerDirectoryHref } from "@/lib/player-directory-navigation";
import { videoEntityIdFromQuery } from "@/lib/video-player-filter";
import type { CanonicalTxtRecord } from "@/lib/canonical-txt-connection.mjs";
import { mergeOfficialTxtControlSchemeListings } from "@/lib/official-txt-control-scheme-merge";
import { withOfficialTxtMoveLinks, withOfficialTxtMultiHit, type OfficialTxtMoveLinkData, type OfficialTxtMultiHitData } from "@/lib/official-txt-move-links";

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
  searchParams: Promise<{ preview?: string | string[]; sample?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = process.env.VERCEL_ENV === "production" ? null : normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);

  const admission = { nodeEnv:process.env.NODE_ENV, vercelEnv:process.env.VERCEL_ENV,
    vercel:process.env.VERCEL, enabled:process.env.SF6DNA_WS5_TXT_PREVIEW,
    host:(await headers()).get("host") };
  const review = isWs5LocalCardRequest(admission);
  // Access-protected Vercel Preview: official TXT move data only (no local review data, no media).
  // Same rule as isOfficialTxtPreviewRequest in official-txt-character-page-connection.mjs.
  const officialTxtPreview = !review && admission.vercel === "1" && admission.vercelEnv === "preview";
  const txtRecords = review || officialTxtPreview
    ? (await import("@/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json")).default as unknown as Record<string, CanonicalTxtRecord>
    : null;
  if (!character && officialTxtPreview && !previewToken) {
    const record = getPreReleaseCharacter(slug);
    const candidate = record ? getWs5TxtPreviewCandidate(slug) : null;
    if (!record || !candidate || !txtRecords) notFound();
    const empty: DevicePreviewBundle = { guideSections: [], moves: [], combos: [], setups: [], sequences: [], matchups: [], training: [] };
    const placeholder = { id: "local-pre-release-arjun", slug: record.slug };
    const connected = connectOfficialTxtCharacterPageData({ character: placeholder, resolved: { bundle: empty, source: "fixture" },
      candidate, admission, records: txtRecords });
    const bundle = mergeOfficialTxtControlSchemeListings(withOfficialTotalFrames(connected.bundle ?? empty, txtRecords), txtRecords);
    const props = preReleaseUnifiedProps({ ...record, bundle, localCardDraft: true });
    return <CharacterUnifiedPage {...props} moveEvidence={{ ...props.moveEvidence, ...connected.moveEvidence }} />;
  }
  if (!character) {
    const local = !previewToken && review ? await getWs5CharacterReview(slug, admission) : null;
    if (!local) notFound();
    const strategyMoveLinks = await getWs5StrategyMoveLinks(local.bundle, admission);
    return <CharacterUnifiedPage {...local} strategyMoveLinks={strategyMoveLinks} strategyReviewDescriptions={await getWs5StrategyReviewDescriptions(admission)} reviewedStrategyCards={await getWs5ReviewedStrategyCards(slug, admission)} playerDirectoryUrl={reviewPlayerDirectoryUrl(local.character.slug)} />;
  }

  const [relatedPlayers, relatedVideos] = await Promise.all([
    listCharacterSectionItems(character.id, "players"),
    listCharacterSectionItems(character.id, "videos"),
  ]);
  const production = process.env.VERCEL_ENV === "production";
  const data = await resolveCharacterDetailData(character.id, character.slug, previewToken);
  const [allVideos, moveMedia] = await Promise.all([
    listVideos({ characterId: character.id }),
    production ? Promise.resolve([]) : getDevicePreviewMoveMotionMedia(character.id, previewToken),
  ]);
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
  const moveEvidence = await characterUnifiedEvidence(character.slug, bundle?.moves ?? [], process.env.VERCEL_ENV);
  const txtCandidate = review || officialTxtPreview ? getWs5TxtPreviewCandidate(character.slug) : null;
  const connectedTxt = txtCandidate ? connectOfficialTxtCharacterPageData({ character,
    resolved:{...data,bundle}, moveEvidence, candidate:txtCandidate, admission,
    mediaRegistry: review ? (await import("@/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json")).default : undefined,
    records: txtRecords as Record<string,CanonicalTxtRecord>,
  }) : null;
  const arjun = review && character.slug === "arjun" ? await getWs5CharacterReview(character.slug, admission) : null;
  // ① Round15 display overlay (official TXT values by move ID): Preview/local only, fills 確認中/empty fields only.
  const displayOverlay = review || officialTxtPreview
    ? ((await import("@/data/SF6DNA_R15_OFFICIAL_TXT_DISPLAY_OVERLAY_20261120.json")).default as unknown as { byMoveId: OfficialTxtDisplayOverlay }).byMoveId
    : null;
  // ① Round17 confirmed links (exact official command match) and duplicate labels: Preview/local only.
  const moveLinks = (review || officialTxtPreview) && txtRecords
    ? (await import("@/data/SF6DNA_R17_OFFICIAL_TXT_MOVE_LINKS_20261120.json")).default as unknown as OfficialTxtMoveLinkData
    : null;
  // ① Round18: first-hit links (startup/damage/name verified), whole-move per-hit details, labels, Classic supplements.
  const multiHit = moveLinks
    ? (await import("@/data/SF6DNA_R18_OFFICIAL_TXT_MULTIHIT_20261120.json")).default as unknown as OfficialTxtMultiHitData
    : null;
  const linkData: OfficialTxtMoveLinkData | null = moveLinks ? { links: { ...moveLinks.links, ...multiHit?.firstStageLinks },
    variantLabels: { ...moveLinks.variantLabels, ...multiHit?.variantLabels } } : null;
  const overlaid = (target: DevicePreviewBundle | null) => {
    const filled = target && displayOverlay ? withOfficialTxtDisplayOverlay(target, displayOverlay) : target;
    return filled && linkData && txtRecords ? withOfficialTxtMoveLinks(filled, linkData, txtRecords) : filled;
  };
  const withMultiHit = (target: DevicePreviewBundle) => multiHit && txtRecords ? withOfficialTxtMultiHit(target, bundle, multiHit, txtRecords) : target;
  const selectedBundle = arjun?.bundle ?? (txtRecords && (connectedTxt?.bundle ?? bundle) ? withMultiHit(mergeOfficialTxtControlSchemeListings(withOfficialTotalFrames(overlaid(connectedTxt?.bundle ?? bundle)!, txtRecords), txtRecords)) : bundle);
  const finalBundle = review ? withoutMotionMedia(selectedBundle) : selectedBundle;
  const strategyMoveLinks = review ? await getWs5StrategyMoveLinks(finalBundle, admission) : undefined;
  const characterId = review ? videoEntityIdFromQuery(character.id) : null;
  const combinedMoveEvidence = arjun?.moveEvidence ?? connectedTxt?.moveEvidence ?? moveEvidence;
  return <CharacterUnifiedPage automaticVideos={<Suspense fallback={<AutoVideoLoading />}><AutoYouTubeVideos names={[character.name]} englishNames={[character.nameEn || character.name]} /></Suspense>} character={character} bundle={finalBundle} players={players} videos={videos}
    moveEvidence={combinedMoveEvidence}
    strategyMoveLinks={strategyMoveLinks} strategyReviewDescriptions={await getWs5StrategyReviewDescriptions(admission)} reviewedStrategyCards={await getWs5ReviewedStrategyCards(slug, admission)}
    playerDirectoryUrl={review ? reviewPlayerDirectoryUrl(character.slug) : undefined}
    videoDirectoryUrl={characterId ? `/videos?${new URLSearchParams({ characterId })}` : undefined}
    localMoveReferences={!review && !production && isLukeSampleRequest(character.slug, query.sample, process.env.VERCEL_ENV) ?
      <LukeSampleCards slug={character.slug} requested={query.sample} environment={process.env.VERCEL_ENV} moveOnly /> : null}
    localReferences={!review && !production ? <LukeCanonicalComboReference characterSlug={character.slug} /> : null} />;
}

function reviewPlayerDirectoryUrl(slug: string) {
  return playerDirectoryHref({ query: "", teams: [], categories: [], characters: [slug] });
}

type OverlayField = "startup" | "active" | "recovery" | "onHit" | "onBlock" | "damage";
type OfficialTxtDisplayOverlay = Record<string, Partial<Record<OverlayField | "classicCommand" | "modernCommand", { value: string; status: string; txtKey: string }>>>;
const OVERLAY_FRAME_FIELDS: readonly OverlayField[] = ["startup", "active", "recovery", "onHit", "onBlock", "damage"];

/** Applies ① Round15's official TXT overlay. A field is filled only when the card shows no value
 * (PENDING/unset with an empty value); DB values and authoritative states are never overwritten.
 * Commands are added only when the move has no command text for that control scheme. */
function withOfficialTxtDisplayOverlay(bundle: DevicePreviewBundle, overlay: OfficialTxtDisplayOverlay): DevicePreviewBundle {
  return { ...bundle, moves: bundle.moves.map(move => {
    const entry = Object.prototype.hasOwnProperty.call(overlay, move.id) ? overlay[move.id] : undefined;
    if (!entry) return move;
    const frame = { ...(move.frame ?? {}) } as NonNullable<typeof move.frame>;
    const frameFieldStatus = { ...move.frameFieldStatus };
    for (const field of OVERLAY_FRAME_FIELDS) {
      const patch = entry[field];
      const current = frame[field];
      const empty = !(typeof current === "number" || (typeof current === "string" && current.trim() !== ""));
      const state = frameFieldStatus[field];
      if (!patch?.value.trim() || !empty || (state !== undefined && state !== "PENDING")) continue;
      (frame as Record<string, unknown>)[field] = patch.value;
      frameFieldStatus[field] = "LOCAL_OFFICIAL_TXT_CANONICAL";
    }
    const commands = [...(move.commands ?? [])];
    for (const [scheme, key, sortOrder] of [["classic", "classicCommand", 0], ["modern", "modernCommand", 1]] as const) {
      const patch = entry[key];
      const hasText = commands.some(row => row.moveId === move.id && row.scheme.toLowerCase().startsWith(scheme) &&
        [row.commandText, row.numericNotation, row.buttonNotation].some(value => typeof value === "string" && value.trim()));
      if (!patch?.value.trim() || hasText) continue;
      commands.push({ moveId: move.id, scheme, commandText: patch.value, numericNotation: null, buttonNotation: null, conditionText: null, sortOrder });
    }
    return { ...move, frame, frameFieldStatus, commands };
  }) };
}

/** Raw keys of the canonical official TXT row for each displayed frame field. */
const OFFICIAL_TXT_FRAME_KEYS = { startup: "startup_frame", active: "active_frame", recovery: "recovery_frame",
  onHit: "hit_frame", onBlock: "block_frame", damage: "damage" } as const;

/** Adds the official 全体 (total frames) from the canonical TXT row a move is connected to, and marks
 * fields that the connected official row leaves blank as 公式資料に記載なし (OFFICIAL_NOT_LISTED).
 * Only PENDING fields with no value are reclassified; DB/accepted states are never overwritten.
 * Moves without a canonical source keep their state (displayed as 確認中 = not yet obtained); nothing is derived. */
function withOfficialTotalFrames(bundle: DevicePreviewBundle, records: Record<string, CanonicalTxtRecord>): DevicePreviewBundle {
  return { ...bundle, moves: bundle.moves.map(move => {
    const key = (move as { ws5CanonicalSource?: string }).ws5CanonicalSource;
    const raw = key ? (records[key] as unknown as { raw?: Record<string, unknown> } | undefined)?.raw : undefined;
    if (!raw) return move;
    const blank = (value: unknown) => !(typeof value === "string" ? value.trim() : typeof value === "number");
    const total = typeof raw.frame === "string" && raw.frame.trim() ? raw.frame.trim() : null;
    const frameFieldStatus: NonNullable<typeof move.frameFieldStatus> = { ...move.frameFieldStatus,
      total: total ? "LOCAL_OFFICIAL_TXT_CANONICAL" : "OFFICIAL_NOT_LISTED" };
    for (const [field, rawKey] of Object.entries(OFFICIAL_TXT_FRAME_KEYS) as [keyof typeof OFFICIAL_TXT_FRAME_KEYS, string][]) {
      const state = frameFieldStatus[field];
      const value = move.frame?.[field];
      const hasValue = typeof value === "number" || (typeof value === "string" && value.trim() !== "");
      if ((state === undefined || state === "PENDING") && !hasValue && blank(raw[rawKey])) frameFieldStatus[field] = "OFFICIAL_NOT_LISTED";
    }
    return { ...move, frame: move.frame ? { ...move.frame, total } : move.frame, frameFieldStatus };
  }) };
}
