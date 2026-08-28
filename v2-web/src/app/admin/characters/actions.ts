"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function nullableNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createCharacter(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  if (!slug || !nameJa) throw new Error("slug and name_ja are required");

  const { error } = await supabase.from("characters").insert({
    slug,
    name_ja: nameJa,
    name_en: nullableText(formData, "name_en"),
    short_name: nullableText(formData, "short_name"),
    summary: nullableText(formData, "summary"),
    archetype: nullableText(formData, "archetype"),
    preferred_range: nullableText(formData, "preferred_range"),
    difficulty: nullableNumber(formData, "difficulty"),
    release_date: nullableText(formData, "release_date"),
    display_order: nullableNumber(formData, "display_order"),
    image_url: nullableText(formData, "image_url"),
    strengths_summary: nullableText(formData, "strengths_summary"),
    weaknesses_summary: nullableText(formData, "weaknesses_summary"),
    is_playable: formData.get("is_playable") === "on",
    status: text(formData, "status") || "draft",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/characters");
  revalidatePath("/characters");
  redirect("/admin/characters");
}

export async function updateCharacter(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = text(formData, "slug");
  const nameJa = text(formData, "name_ja");
  if (!slug || !nameJa) throw new Error("slug and name_ja are required");

  const { error } = await supabase
    .from("characters")
    .update({
      slug,
      name_ja: nameJa,
      name_en: nullableText(formData, "name_en"),
      short_name: nullableText(formData, "short_name"),
      summary: nullableText(formData, "summary"),
      archetype: nullableText(formData, "archetype"),
      preferred_range: nullableText(formData, "preferred_range"),
      difficulty: nullableNumber(formData, "difficulty"),
      release_date: nullableText(formData, "release_date"),
      display_order: nullableNumber(formData, "display_order"),
      image_url: nullableText(formData, "image_url"),
      strengths_summary: nullableText(formData, "strengths_summary"),
      weaknesses_summary: nullableText(formData, "weaknesses_summary"),
      is_playable: formData.get("is_playable") === "on",
      status: text(formData, "status") || "draft",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/characters");
  revalidatePath(`/admin/characters/${id}`);
  revalidatePath("/characters");
  redirect("/admin/characters");
}

export async function archiveCharacter(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("characters").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/characters");
  revalidatePath("/characters");
}
