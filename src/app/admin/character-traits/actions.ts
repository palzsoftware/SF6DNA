"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;

export async function saveCharacterTraitScore(formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const traitId = text(formData, "trait_id");
  const score = Number(text(formData, "score"));
  const verificationStatus = text(formData, "verification_status") || "unverified";
  const sourceId = nullable(formData, "source_id");
  const status = text(formData, "status") || "draft";

  if (!characterId || !traitId || !Number.isInteger(score) || score < 0 || score > 5) {
    throw new Error("character, trait and score(0-5) are required");
  }
  if (status === "published" && (verificationStatus !== "verified" || !sourceId)) {
    throw new Error("published character trait score requires verified status and a source");
  }

  const { error } = await supabase.from("character_trait_scores").upsert({
    character_id: characterId,
    trait_id: traitId,
    score,
    verification_status: verificationStatus,
    source_id: sourceId,
    note: nullable(formData, "note"),
    status,
  }, { onConflict: "character_id,trait_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/character-traits");
}

export async function archiveCharacterTraitScore(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("character_trait_scores").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/character-traits");
}
