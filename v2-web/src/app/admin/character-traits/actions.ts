"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;

type AdminSupabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function saveCharacterTraitScore(formData: FormData) {
  const { supabase } = await requireAdmin();
  const characterId = text(formData, "character_id");
  const traitId = text(formData, "trait_id");
  const score = Number(text(formData, "score"));
  const verificationStatus = text(formData, "verification_status") || "unverified";
  const sourceId = nullable(formData, "source_id");
  const requestedStatus = text(formData, "status") || "draft";

  if (!characterId || !traitId || !Number.isInteger(score) || score < 0 || score > 5) {
    throw new Error("character, trait and score(0-5) are required");
  }
  if (requestedStatus === "published" && (verificationStatus !== "verified" || !sourceId)) {
    throw new Error("published character trait score requires verified status and a source");
  }

  const { data: existing, error: existingError } = await supabase
    .from("character_trait_scores")
    .select("id")
    .eq("character_id", characterId)
    .eq("trait_id", traitId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  const payload = {
    character_id: characterId,
    trait_id: traitId,
    score,
    verification_status: verificationStatus,
    source_id: sourceId,
    note: nullable(formData, "note"),
  };

  let scoreId = existing?.id ?? null;

  if (existing?.id) {
    if (requestedStatus === "published" && sourceId) {
      await ensureTraitSourceRelation(supabase, existing.id, sourceId);
    }

    const { error } = await supabase
      .from("character_trait_scores")
      .update({ ...payload, status: requestedStatus })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("character_trait_scores")
      .insert({ ...payload, status: requestedStatus === "published" ? "draft" : requestedStatus })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    scoreId = data.id;

    if (sourceId) await ensureTraitSourceRelation(supabase, scoreId, sourceId);

    if (requestedStatus === "published") {
      const { error: publishError } = await supabase
        .from("character_trait_scores")
        .update({ status: "published" })
        .eq("id", scoreId);
      if (publishError) throw new Error(publishError.message);
    }
  }

  if (scoreId && sourceId && requestedStatus !== "published") {
    await ensureTraitSourceRelation(supabase, scoreId, sourceId);
  }

  revalidatePath("/admin/character-traits");
  revalidatePath("/diagnosis");
}

export async function archiveCharacterTraitScore(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("character_trait_scores").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/character-traits");
  revalidatePath("/diagnosis");
}

async function ensureTraitSourceRelation(supabase: AdminSupabase, scoreId: string, sourceId: string) {
  const { count, error: countError } = await supabase
    .from("entity_sources")
    .select("id", { count: "exact", head: true })
    .eq("entity_type", "character_trait_score")
    .eq("entity_id", scoreId)
    .eq("source_id", sourceId);
  if (countError) throw new Error(countError.message);
  if (count) return;

  const { error } = await supabase.from("entity_sources").insert({
    entity_type: "character_trait_score",
    entity_id: scoreId,
    source_id: sourceId,
    relationship: "primary",
  });
  if (error) throw new Error(error.message);
}
