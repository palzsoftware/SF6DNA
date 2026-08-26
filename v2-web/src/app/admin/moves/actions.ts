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

export async function createMove(formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  const moveType = text(formData, "move_type");
  if (!characterId || !slug || !nameJa || !moveType) throw new Error("character, slug, name_ja and move_type are required");

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

  const commands = [
    buildCommand(formData, move.id, "classic"),
    buildCommand(formData, move.id, "modern"),
  ].filter(Boolean);
  if (commands.length) {
    const { error } = await supabase.from("move_commands").insert(commands);
    if (error) throw new Error(error.message);
  }

  if (hasFrameData(formData)) {
    const { error } = await supabase.from("move_frame_data").insert({
      move_id: move.id,
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

  const sourceId = text(formData, "source_id");
  if (sourceId) {
    const { error } = await supabase.from("entity_sources").insert({
      entity_type: "move",
      entity_id: move.id,
      source_id: sourceId,
      relationship: "primary",
      note: nullable(formData, "source_note"),
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/moves");
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
  revalidatePath(`/admin/moves/${id}`);
  revalidatePath(`/moves/${slug}`);
  redirect("/admin/moves");
}

export async function archiveMove(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("moves").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/moves");
}

function buildCommand(fd: FormData, moveId: string, scheme: "classic" | "modern") {
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
