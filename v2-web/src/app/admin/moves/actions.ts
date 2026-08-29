"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const nullableNumber = (fd: FormData, key: string) => {
  const value = text(fd, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

type AdminSupabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

type MoveCommandInput = {
  move_id: string;
  control_scheme: "classic" | "modern";
  command_text: string;
  numeric_notation: string | null;
  button_notation: string | null;
  condition_text: string | null;
  sort_order: number;
};

type EvidenceEntityType = "move" | "move_command" | "move_frame_data";

export async function createMove(formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  const moveType = text(formData, "move_type");
  const requestedStatus = text(formData, "status") || "draft";
  if (!characterId || !slug || !nameJa || !moveType) throw new Error("character, slug, name_ja and move_type are required");

  const commands = [
    buildCommand(formData, "pending", "classic"),
    buildCommand(formData, "pending", "modern"),
  ].filter((command): command is MoveCommandInput => command !== null);

  await ensureNewMovePublishable(supabase, formData, commands, requestedStatus);

  const { data: move, error: moveError } = await supabase
    .from("moves")
    .insert({
      character_id: characterId,
      slug,
      name_ja: nameJa,
      name_en: nullable(formData, "name_en"),
      move_type: moveType,
      strength_variant: nullable(formData, "strength_variant"),
      description: nullable(formData, "description"),
      usage_summary: nullable(formData, "usage_summary"),
      display_order: nullableNumber(formData, "display_order") ?? 0,
      status: requestedStatus === "published" ? "draft" : requestedStatus,
    })
    .select("id")
    .single();
  if (moveError) throw new Error(moveError.message);

  const persistedCommands = commands.length
    ? await insertCommands(supabase, move.id, commands)
    : [];
  const frame = hasFrameData(formData)
    ? await insertFrameData(supabase, move.id, formData)
    : null;

  const sourceId = text(formData, "source_id");
  if (sourceId) {
    const note = nullable(formData, "source_note");
    await insertEntitySource(supabase, "move", move.id, sourceId, note);
    for (const command of persistedCommands) {
      await insertEntitySource(supabase, "move_command", command.id, sourceId, note);
    }
    if (frame) await insertEntitySource(supabase, "move_frame_data", frame.id, sourceId, note);
  }

  if (requestedStatus === "published") {
    await ensureExistingMovePublishable(supabase, move.id);
    const { error: publishError } = await supabase.from("moves").update({ status: "published" }).eq("id", move.id);
    if (publishError) throw new Error(publishError.message);
  }

  revalidatePath("/admin/moves");
  revalidatePath("/admin/data-quality");
  revalidatePath("/characters");
  revalidatePath(`/moves/${slug}`);
  redirect("/admin/moves");
}

export async function updateMove(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  const moveType = text(formData, "move_type");
  if (!characterId || !slug || !nameJa || !moveType) throw new Error("character, slug, name_ja and move_type are required");
  if ((text(formData, "status") || "draft") === "published") await ensureExistingMovePublishable(supabase, id);

  const { error } = await supabase.from("moves").update({
    character_id: characterId,
    slug,
    name_ja: nameJa,
    name_en: nullable(formData, "name_en"),
    move_type: moveType,
    strength_variant: nullable(formData, "strength_variant"),
    description: nullable(formData, "description"),
    usage_summary: nullable(formData, "usage_summary"),
    display_order: nullableNumber(formData, "display_order") ?? 0,
    status: text(formData, "status") || "draft",
  }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/moves");
  revalidatePath("/admin/data-quality");
  revalidatePath(`/admin/moves/${id}`);
  revalidatePath(`/moves/${slug}`);
  redirect("/admin/moves");
}

export async function archiveMove(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("moves").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/moves");
  revalidatePath("/admin/data-quality");
}

export async function addFrameVersion(moveId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  if (!hasFrameData(formData)) throw new Error("frame data is required");
  if (text(formData, "verification_status") === "verified" && !text(formData, "valid_from_patch_id")) {
    throw new Error("verified FrameにはValid-from Patchが必要です");
  }
  await insertFrameData(supabase, moveId, formData);
  revalidatePath(`/admin/moves/${moveId}`);
  revalidatePath("/admin/data-quality");
}

export async function attachMoveSource(moveId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const sourceId = text(formData, "source_id");
  if (!sourceId) throw new Error("source_id is required");
  await insertEntitySource(supabase, "move", moveId, sourceId, nullable(formData, "source_note"));
  revalidatePath(`/admin/moves/${moveId}`);
  revalidatePath("/admin/data-quality");
}

export async function attachMoveEvidenceSource(moveId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const sourceId = text(formData, "source_id");
  const target = text(formData, "evidence_target");
  if (!sourceId || !target) throw new Error("evidence_target and source_id are required");

  const separator = target.indexOf(":");
  if (separator < 1) throw new Error("invalid evidence target");
  const entityType = target.slice(0, separator) as EvidenceEntityType;
  const entityId = target.slice(separator + 1);
  if (!(["move", "move_command", "move_frame_data"] as string[]).includes(entityType) || !entityId) {
    throw new Error("invalid evidence target");
  }

  await assertEvidenceTargetBelongsToMove(supabase, moveId, entityType, entityId);
  await insertEntitySource(supabase, entityType, entityId, sourceId, nullable(formData, "source_note"));
  revalidatePath(`/admin/moves/${moveId}`);
  revalidatePath("/admin/data-quality");
}

function buildCommand(fd: FormData, moveId: string, scheme: "classic" | "modern"): MoveCommandInput | null {
  const commandText = text(fd, `${scheme}_command_text`);
  if (!commandText) return null;
  return {
    move_id: moveId,
    control_scheme: scheme,
    command_text: commandText,
    numeric_notation: nullable(fd, `${scheme}_numeric_notation`),
    button_notation: nullable(fd, `${scheme}_button_notation`),
    condition_text: nullable(fd, `${scheme}_condition_text`),
    sort_order: scheme === "classic" ? 0 : 1,
  };
}

function hasFrameData(fd: FormData) {
  return ["startup", "active", "recovery", "on_hit", "on_block", "damage", "drive_damage", "hit_level", "cancel_type", "invincibility"]
    .some((key) => Boolean(text(fd, key)));
}

async function ensureNewMovePublishable(
  supabase: AdminSupabase,
  formData: FormData,
  commands: MoveCommandInput[],
  requestedStatus: string,
) {
  if (requestedStatus !== "published") return;

  if (!commands.some((command) => command.control_scheme === "classic")) {
    throw new Error("published MoveにはClassic Commandが必要です");
  }
  if (!hasFrameData(formData)) throw new Error("published MoveにはFrame Dataが必要です");
  if (text(formData, "verification_status") !== "verified") {
    throw new Error("published MoveのFrameはverifiedである必要があります");
  }

  const patchId = text(formData, "valid_from_patch_id");
  const sourceId = text(formData, "source_id");
  if (!patchId) throw new Error("published MoveにはCurrent PatchのFrameが必要です");
  if (!sourceId) throw new Error("published Moveにはofficial Sourceが必要です");

  const [{ data: patch, error: patchError }, { data: source, error: sourceError }] = await Promise.all([
    supabase.from("patches").select("id, is_current").eq("id", patchId).maybeSingle(),
    supabase.from("sources").select("id, reliability_level").eq("id", sourceId).maybeSingle(),
  ]);
  if (patchError) throw new Error(patchError.message);
  if (sourceError) throw new Error(sourceError.message);
  if (!patch?.is_current) throw new Error("published MoveのFrameはCurrent Patchである必要があります");
  if (source?.reliability_level !== "official") throw new Error("published Moveにはofficial Sourceが必要です");
}

async function ensureExistingMovePublishable(supabase: AdminSupabase, moveId: string) {
  const [{ data: classicCommands, error: commandError }, { data: currentPatches, error: patchError }] = await Promise.all([
    supabase.from("move_commands").select("id").eq("move_id", moveId).eq("control_scheme", "classic"),
    supabase.from("patches").select("id").eq("is_current", true),
  ]);
  if (commandError) throw new Error(commandError.message);
  if (patchError) throw new Error(patchError.message);
  if (!classicCommands?.length) throw new Error("published MoveにはClassic Commandが必要です");
  if (!currentPatches?.length) throw new Error("Current Patchが設定されていません");

  const { data: frames, error: frameError } = await supabase
    .from("move_frame_data")
    .select("id")
    .eq("move_id", moveId)
    .eq("verification_status", "verified")
    .is("valid_to_patch_id", null)
    .in("valid_from_patch_id", currentPatches.map((patch) => patch.id));
  if (frameError) throw new Error(frameError.message);
  if (!frames?.length) throw new Error("published MoveにはCurrent Patchのverified Frameが必要です");

  const [moveEvidence, commandEvidence, frameEvidence] = await Promise.all([
    hasOfficialEvidence(supabase, ["move"], [moveId]),
    hasOfficialEvidence(supabase, ["move_command"], classicCommands.map((command) => command.id)),
    hasOfficialEvidence(supabase, ["frame", "move_frame_data"], frames.map((frame) => frame.id)),
  ]);

  if (!moveEvidence) throw new Error("published MoveにはMove本体のofficial Sourceが必要です");
  if (!commandEvidence) throw new Error("published MoveにはClassic Commandのofficial Sourceが必要です");
  if (!frameEvidence) throw new Error("published MoveにはCurrent Frameのofficial Sourceが必要です");
}

async function hasOfficialEvidence(
  supabase: AdminSupabase,
  entityTypes: string[],
  entityIds: string[],
) {
  if (!entityIds.length) return false;

  const { data: links, error: linkError } = await supabase
    .from("entity_sources")
    .select("source_id")
    .in("entity_type", entityTypes)
    .in("entity_id", entityIds);
  if (linkError) throw new Error(linkError.message);
  if (!links?.length) return false;

  const sourceIds = [...new Set(links.map((link) => link.source_id))];
  const { count, error: sourceError } = await supabase
    .from("sources")
    .select("id", { count: "exact", head: true })
    .in("id", sourceIds)
    .eq("reliability_level", "official");
  if (sourceError) throw new Error(sourceError.message);
  return Boolean(count);
}

async function insertCommands(supabase: AdminSupabase, moveId: string, commands: MoveCommandInput[]) {
  const { data, error } = await supabase
    .from("move_commands")
    .insert(commands.map((command) => ({ ...command, move_id: moveId })))
    .select("id, control_scheme");
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function insertFrameData(supabase: AdminSupabase, moveId: string, formData: FormData) {
  const { data, error } = await supabase.from("move_frame_data").insert({
    move_id: moveId,
    startup: nullable(formData, "startup"),
    active: nullable(formData, "active"),
    recovery: nullable(formData, "recovery"),
    on_hit: nullable(formData, "on_hit"),
    on_block: nullable(formData, "on_block"),
    damage: nullableNumber(formData, "damage"),
    drive_damage: nullableNumber(formData, "drive_damage"),
    super_gain: nullableNumber(formData, "super_gain"),
    hit_level: nullable(formData, "hit_level"),
    cancel_type: nullable(formData, "cancel_type"),
    invincibility: nullable(formData, "invincibility"),
    notes: nullable(formData, "frame_notes"),
    valid_from_patch_id: nullable(formData, "valid_from_patch_id"),
    verification_status: text(formData, "verification_status") || "unverified",
  }).select("id").single();
  if (error) throw new Error(error.message);
  return data;
}

async function insertEntitySource(
  supabase: AdminSupabase,
  entityType: EvidenceEntityType,
  entityId: string,
  sourceId: string,
  note: string | null,
) {
  const { error } = await supabase.from("entity_sources").insert({
    entity_type: entityType,
    entity_id: entityId,
    source_id: sourceId,
    relationship: "primary",
    note,
  });
  if (error) throw new Error(error.message);
}

async function assertEvidenceTargetBelongsToMove(
  supabase: AdminSupabase,
  moveId: string,
  entityType: EvidenceEntityType,
  entityId: string,
) {
  if (entityType === "move") {
    if (entityId !== moveId) throw new Error("invalid Move evidence target");
    return;
  }

  const table = entityType === "move_command" ? "move_commands" : "move_frame_data";
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", entityId)
    .eq("move_id", moveId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("evidence target does not belong to this Move");
}
