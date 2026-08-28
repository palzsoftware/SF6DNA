"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { isStrategyKind, STRATEGY_META, type StrategyKind } from "@/lib/admin-strategy";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const nullableNumber = (fd: FormData, key: string) => {
  const raw = text(fd, key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};
const nullableBoolean = (fd: FormData, key: string) => {
  const raw = text(fd, key);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
};

function assertKind(kind: string): asserts kind is StrategyKind {
  if (!isStrategyKind(kind)) throw new Error("Unsupported content kind");
}

function entityTypeFor(kind: StrategyKind) {
  return kind === "trainings" ? "training" : kind.slice(0, -1);
}

function payloadFor(kind: StrategyKind, fd: FormData) {
  const common = {
    slug: text(fd, "slug"),
    valid_from_patch_id: nullable(fd, "valid_from_patch_id"),
    valid_to_patch_id: nullable(fd, "valid_to_patch_id"),
    verification_status: text(fd, "verification_status") || "unverified",
    status: text(fd, "status") || "draft",
  };

  switch (kind) {
    case "combos":
      return {
        ...common,
        character_id: text(fd, "character_id"),
        name: text(fd, "name"),
        combo_type: text(fd, "combo_type"),
        notation: text(fd, "notation"),
        starter_text: nullable(fd, "starter_text"),
        damage: nullableNumber(fd, "damage"),
        drive_cost: nullableNumber(fd, "drive_cost"),
        drive_gain: nullableNumber(fd, "drive_gain"),
        sa_cost: nullableNumber(fd, "sa_cost"),
        position: nullable(fd, "position"),
        side_requirement: nullable(fd, "side_requirement"),
        difficulty: nullableNumber(fd, "difficulty"),
        purpose: nullable(fd, "purpose"),
        conditions: nullable(fd, "conditions"),
        notes: nullable(fd, "notes"),
        video_url: nullable(fd, "video_url"),
        content_kind: text(fd, "content_kind") || "verified_strategy",
      };
    case "setups":
      return {
        ...common,
        character_id: text(fd, "character_id"),
        name: text(fd, "name"),
        setup_type: nullable(fd, "setup_type"),
        starter_condition: nullable(fd, "starter_condition"),
        sequence_text: text(fd, "sequence_text"),
        frame_advantage: nullableNumber(fd, "frame_advantage"),
        position: nullable(fd, "position"),
        meter_condition: nullable(fd, "meter_condition"),
        description: nullable(fd, "description"),
        counter_notes: nullable(fd, "counter_notes"),
        content_kind: text(fd, "content_kind") || "verified_strategy",
      };
    case "sequences":
      return {
        ...common,
        character_id: text(fd, "character_id"),
        name: text(fd, "name"),
        sequence_type: nullable(fd, "sequence_type"),
        sequence_text: text(fd, "sequence_text"),
        is_true_blockstring: nullableBoolean(fd, "is_true_blockstring"),
        mash_point: nullable(fd, "mash_point"),
        throw_point: nullable(fd, "throw_point"),
        shimmy_point: nullable(fd, "shimmy_point"),
        jump_option: nullable(fd, "jump_option"),
        parry_option: nullable(fd, "parry_option"),
        drive_reversal_option: nullable(fd, "drive_reversal_option"),
        invincible_option: nullable(fd, "invincible_option"),
        notes: nullable(fd, "notes"),
        content_kind: text(fd, "content_kind") || "verified_strategy",
      };
    case "counters":
      return {
        ...common,
        defender_character_id: nullable(fd, "defender_character_id"),
        opponent_character_id: nullable(fd, "opponent_character_id"),
        target_type: text(fd, "target_type"),
        target_id: nullable(fd, "target_id"),
        situation: nullable(fd, "situation"),
        counter_type: text(fd, "counter_type"),
        title: text(fd, "title"),
        summary: nullable(fd, "summary"),
        method: text(fd, "method"),
        benefit: nullable(fd, "benefit"),
        risk: nullable(fd, "risk"),
        difficulty: nullableNumber(fd, "difficulty"),
        conditions: nullable(fd, "conditions"),
        content_kind: text(fd, "content_kind") || "verified_strategy",
      };
    case "trainings":
      return {
        ...common,
        name: text(fd, "name"),
        training_type: text(fd, "training_type"),
        purpose: text(fd, "purpose"),
        level: nullable(fd, "level"),
        duration_minutes: nullableNumber(fd, "duration_minutes"),
        player_character_id: nullable(fd, "player_character_id"),
        dummy_character_id: nullable(fd, "dummy_character_id"),
        recording_instructions: nullable(fd, "recording_instructions"),
        playback_settings: nullable(fd, "playback_settings"),
        cpu_settings: nullable(fd, "cpu_settings"),
        method: text(fd, "method"),
        success_criteria: nullable(fd, "success_criteria"),
        recommended_reps: nullableNumber(fd, "recommended_reps"),
        next_step: nullable(fd, "next_step"),
      };
  }
}

function validate(kind: StrategyKind, payload: Record<string, unknown>) {
  if (!payload.slug) throw new Error("slug is required");
  if ((kind === "combos" || kind === "setups" || kind === "sequences") && !payload.character_id) throw new Error("character is required");
  if (kind === "combos" && (!payload.name || !payload.combo_type || !payload.notation)) throw new Error("name, combo_type and notation are required");
  if ((kind === "setups" || kind === "sequences") && (!payload.name || !payload.sequence_text)) throw new Error("name and sequence_text are required");
  if (kind === "counters" && (!payload.title || !payload.target_type || !payload.counter_type || !payload.method)) throw new Error("title, target_type, counter_type and method are required");
  if (kind === "trainings" && (!payload.name || !payload.training_type || !payload.purpose || !payload.method)) throw new Error("name, training_type, purpose and method are required");
}

async function ensurePublishable(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  kind: StrategyKind,
  id: string | null,
  payload: Record<string, unknown>,
  sourceId: string,
) {
  if (payload.status !== "published") return;
  if (payload.verification_status !== "verified") {
    throw new Error("publishedにするにはverification_status=verifiedが必要です");
  }
  if (sourceId) return;
  if (!id) throw new Error("publishedにするにはSourceが必要です");

  const { count, error } = await supabase
    .from("entity_sources")
    .select("id", { count: "exact", head: true })
    .eq("entity_type", entityTypeFor(kind))
    .eq("entity_id", id);
  if (error) throw new Error(error.message);
  if (!count) throw new Error("publishedにするには既存Sourceまたは新しいSource指定が必要です");
}

export async function saveStrategyContent(kindValue: string, id: string | null, formData: FormData) {
  assertKind(kindValue);
  const kind = kindValue;
  const { supabase } = await requireAdmin();
  const payload = payloadFor(kind, formData) as Record<string, unknown>;
  validate(kind, payload);
  const table = STRATEGY_META[kind].table;
  const sourceId = text(formData, "source_id");
  await ensurePublishable(supabase, kind, id, payload, sourceId);

  let entityId = id;
  if (id) {
    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from(table).insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    entityId = String(data.id);
  }

  if (sourceId && entityId) {
    const { error } = await supabase.from("entity_sources").insert({
      entity_type: entityTypeFor(kind),
      entity_id: entityId,
      source_id: sourceId,
      relationship: text(formData, "source_relationship") || "primary",
      note: nullable(formData, "source_note"),
    });
    if (error && !error.message.toLowerCase().includes("duplicate")) throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${kind}`);
  revalidatePath("/admin/data-quality");
  revalidatePath(STRATEGY_META[kind].publicPath);
  redirect(`/admin/content/${kind}`);
}

export async function archiveStrategyContent(kindValue: string, id: string) {
  assertKind(kindValue);
  const kind = kindValue;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(STRATEGY_META[kind].table).update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/content/${kind}`);
  revalidatePath("/admin/data-quality");
}
