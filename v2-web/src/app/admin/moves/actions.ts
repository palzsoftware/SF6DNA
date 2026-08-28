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

type MoveCommandInput = {
  move_id: string;
  control_scheme: "classic" | "modern";
  command_text: string;
  numeric_notation: string | null;
  button_notation: string | null;
  condition_text: string | null;
  sort_order: number;
};

export async function createMove(formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  const moveType = text(formData, "move_type");
  if (!characterId || !slug || !nameJa || !moveType) throw new Error("character, slug, name_ja and move_type are required");

  const commands = [
    buildCommand(formData, "pending", "classic"),
    buildCommand(formData, "pending", "modern"),
  ].filter((command): command is MoveCommandInput => command !== null);
  await ensureNewMovePublishable(formData, commands.length);

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
      status: text(formData, "status") || "draft",
    })
    .select("id")
    .single();
  if (moveError) throw new Error(moveError.message);

  const persistedCommands = commands.map((command) => ({ ...command, move_id: move.id }));
  if (persistedCommands.length) {
    const { error } = await supabase.from("move_commands").insert(persistedCommands);
    if (error) throw new Error(error.message);
  }

  if (hasFrameData(formData)) await insertFrameData(supabase, move.id, formData);

  const sourceId = text(formData, "source_id");
  if (sourceId) await insertMoveSource(supabase, move.id, sourceId, nullable(formData, "source_note"));

  revalidatePath("/admin/moves");
  revalidatePath("/admin/data-quality");
  revalidatePath("/characters");
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
  await insertMoveSource(supabase, moveId, sourceId, nullable(formData, "source_note"));
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

async function ensureNewMovePublishable(formData: FormData, commandCount: number) {
  if ((text(formData, "status") || "draft") !== "published") return;
  if (!commandCount) throw new Error("published MoveにはClassicまたはModern Commandが必要です");
  if (!hasFrameData(formData)) throw new Error("published MoveにはFrame Dataが必要です");
  if (text(formData, "verification_status") !== "verified") throw new Error("published MoveのFrameはverifiedである必要があります");
  if (!text(formData, "valid_from_patch_id")) throw new Error("published MoveにはFrameのValid-from Patchが必要です");
  if (!text(formData, "source_id")) throw new Error("published MoveにはSourceが必要です");
}

async function ensureExistingMovePublishable(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  moveId: string,
) {
  const [commands, frames, sources] = await Promise.all([
    supabase.from("move_commands").select("id", { count: "exact", head: true }).eq("move_id", moveId),
    supabase.from("move_frame_data").select("id", { count: "exact", head: true }).eq("move_id", moveId).eq("verification_status", "verified").not("valid_from_patch_id", "is", null),
    supabase.from("entity_sources").select("id", { count: "exact", head: true }).eq("entity_type", "move").eq("entity_id", moveId),
  ]);
  const error = [commands, frames, sources].find((result) => result.error)?.error;
  if (error) throw new Error(error.message);
  if (!commands.count) throw new Error("published MoveにはCommandが必要です");
  if (!frames.count) throw new Error("published MoveにはPatch付きverified Frameが必要です");
  if (!sources.count) throw new Error("published MoveにはSourceが必要です");
}

async function insertFrameData(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], moveId: string, formData: FormData) {
  const { error } = await supabase.from("move_frame_data").insert({
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
  });
  if (error) throw new Error(error.message);
}

async function insertMoveSource(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  moveId: string,
  sourceId: string,
  note: string | null,
) {
  const { error } = await supabase.from("entity_sources").insert({
    entity_type: "move",
    entity_id: moveId,
    source_id: sourceId,
    relationship: "primary",
    note,
  });
  if (error) throw new Error(error.message);
}
