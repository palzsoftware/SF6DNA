import { resolveReleaseCharacterMoves } from "@/lib/release-character-move-resolver";
import { getGeneratedReleaseFixture } from "@/lib/generated-release-fixture";
import { getNineCharacterIntegrationCandidate, hasNineCharacterIntegrationCandidate } from "@/lib/nine-character-integration-candidate";
import { getCharacterProductionApproval, isProductionMoveApproved, type CharacterApproval } from "@/lib/production-character-approval";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import { getDevicePreviewBundle } from "@/lib/device-preview";
import { getCharacterDetailV21Fixture } from "@/lib/character-detail-v21-fixture";
import { isCharacterDetailV2Route } from "@/lib/character-detail-route";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isMovePublicReady } from "@/lib/public-move-gate";
import { getYasmineMoveMediaPilot } from "@/lib/yasmine-move-media-pilot";
import { getPublicEntitySources } from "@/lib/public-source-links";
import type { VideoSummary } from "@/lib/event-media";

export type CharacterDetailData = {
  bundle: DevicePreviewBundle | null;
  source: "device-preview" | "public" | "fixture" | "unavailable";
};

/** Normal requests use the existing public gate, never privileged DB access. */
export async function loadPublicCharacterMoves(characterId: string, approval?: CharacterApproval): Promise<DevicePreviewBundle["moves"] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = getSupabaseServerClient();
  const [{ data: moves, error }, { data: patch, error: patchError }] = await Promise.all([
    supabase.from("moves")
      .select("id, character_id, slug, name_ja, move_type, strength_variant, usage_summary, usage_summary_ja, description_ja, status")
      .eq("character_id", characterId).eq("status", "published")
      .order("display_order", { ascending: true }),
    supabase.from("patches").select("id").eq("is_current", true).maybeSingle(),
  ]);
  if (error || patchError || !patch?.id) return null;
  const rows = moves ?? [];
  if (!rows.length) return [];
  // Reuse the complete Move / Classic / current verified Frame evidence contract.
  const readiness = await Promise.all(rows.map((move) => isMovePublicReady(String(move.slug))));
  const ready = rows.filter((move, index) => move.status === "published" && readiness[index]);
  if (!ready.length) return [];
  const ids = ready.map((move) => String(move.id));
  const [{ data: commands, error: commandError }, { data: frames, error: frameError }] = await Promise.all([
    supabase.from("move_commands")
      .select("id, move_id, control_scheme, command_text, numeric_notation, button_notation, condition_text, sort_order")
      .in("move_id", ids).eq("control_scheme", "classic").order("sort_order", { ascending: true }),
    supabase.from("move_frame_data")
      .select("id, move_id, startup, active, recovery, on_hit, on_block, damage, verification_status, valid_from_patch_id, valid_to_patch_id")
      .in("move_id", ids).eq("valid_from_patch_id", patch.id)
      .is("valid_to_patch_id", null).eq("verification_status", "verified"),
  ]);
  if (commandError || frameError) return null;
  const [commandSources, frameSources, moveSources] = await Promise.all([
    getPublicEntitySources(["move_command"], (commands ?? []).map((command) => String(command.id))),
    getPublicEntitySources(["frame", "move_frame_data"], (frames ?? []).map((frame) => String(frame.id))),
    approval ? getPublicEntitySources(["move"], ids) : Promise.resolve([]),
  ]);
  const officialCommands = new Set(commandSources.filter((source) => source.reliabilityLevel === "official").map((source) => source.entityId));
  const officialFrames = new Set(frameSources.filter((source) => source.reliabilityLevel === "official").map((source) => source.entityId));
  const selected = resolveReleaseCharacterMoves({ characterId, currentPatchId: String(patch.id),
    moves: ready, commands: commands ?? [], frames: frames ?? [],
    gateReadyIds: new Set(ids), officialCommandIds: officialCommands, officialFrameIds: officialFrames });
  if (!approval) return selected;
  return selected.filter(move => {
    const selectedCommands = (commands ?? []).filter(c => c.move_id === move.id && officialCommands.has(String(c.id)));
    const selectedFrames = (frames ?? []).filter(f => f.move_id === move.id);
    const entityIds = new Set([move.id, ...selectedCommands.map(c => String(c.id)), ...selectedFrames.map(f => String(f.id))]);
    const sources = [...moveSources, ...commandSources, ...frameSources].filter(s => entityIds.has(s.entityId))
      .sort((a,b) => `${a.entityType}:${a.entityId}:${a.sourceId}`.localeCompare(`${b.entityType}:${b.entityId}:${b.sourceId}`));
    return isProductionMoveApproved(approval, { move, characterId, patchId: String(patch.id),
      rawMove: ready.find(r => r.id === move.id), commands: selectedCommands, frames: selectedFrames, sources });
  });
}

export async function resolveCharacterDetailData(characterId: string, slug: string, previewToken: string | null): Promise<CharacterDetailData> {
  if (process.env.VERCEL_ENV === "production") {
    const approval = getCharacterProductionApproval(characterId, slug);
    if (!approval) return { bundle: null, source: "unavailable" };
    const moves = await loadPublicCharacterMoves(characterId, approval).catch(() => null);
    if (!moves?.length) return { bundle: null, source: "unavailable" };
    return { bundle: { guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] }, source: "public" };
  }
  // Owner-reviewed Preview candidates retain pending fields and held identities.
  // Failure must not restore a held identity through older fixture fallback.
  if (hasNineCharacterIntegrationCandidate(slug) && process.env.VERCEL_ENV === "preview") {
    const candidate = getNineCharacterIntegrationCandidate(characterId, slug);
    return candidate ? { bundle: candidate.bundle, source: "fixture" } : { bundle: null, source: "unavailable" };
  }
  // The reviewed capture is Preview-only; remote DB identities must not mask it.
  const canonical = slug === "yasmine" ? getYasmineMoveMediaPilot() : null;
  if (canonical) return { bundle: canonical, source: "fixture" };
  const remote = await getDevicePreviewBundle(characterId, previewToken);
  if (remote) return { bundle: remote, source: "device-preview" };
  const publicMoves = await loadPublicCharacterMoves(characterId);
  const fallback = isCharacterDetailV2Route(slug) ? getCharacterDetailV21Fixture(slug) : null;
  if (publicMoves?.length) {
    return { bundle: { guideSections: [], moves: publicMoves, combos: [], setups: [], sequences: [], matchups: [], training: [] }, source: "public" };
  }
  const generated = await getGeneratedReleaseFixture(characterId, slug);
  if (generated) return { bundle: generated, source: "fixture" };
  // Reviewed pilot fallback stays Preview-only at the route boundary. Do not
  // turn a missing public grant into an admin/secret-key query or draft export.
  return { bundle: fallback ? { ...fallback, moves: fallback.moves.map((move) => ({ ...move })) } : null,
    source: publicMoves === null ? "unavailable" : "fixture" };
}

/** Match the same entity_videos IDs used by Character sections, not display names. */
export function resolveCharacterRelatedVideos(videos: VideoSummary[], relatedVideoIds: string[]): VideoSummary[] {
  const byId = new Map(videos.map((video) => [video.id, video]));
  return [...new Set(relatedVideoIds)].flatMap((id) => {
    const video = byId.get(id);
    return video ? [video] : [];
  });
}
