"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const numberValue = (fd: FormData, key: string, fallback = 0) => {
  const value = Number(text(fd, key));
  return Number.isFinite(value) ? value : fallback;
};
const boolValue = (fd: FormData, key: string) => {
  const value = text(fd, key);
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};
const normalizeAlias = (value: string) => value.normalize("NFKC").trim().toLowerCase();
const refresh = () => revalidatePath("/admin/relations");

export async function addPlayerAlias(formData: FormData) {
  const { supabase } = await requireAdmin();
  const playerId = text(formData, "player_id");
  const alias = text(formData, "alias");
  if (!playerId || !alias) throw new Error("player and alias are required");
  const { error } = await supabase.from("player_aliases").insert({ player_id: playerId, alias, normalized_alias: normalizeAlias(alias) });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deletePlayerAlias(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("player_aliases").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addGlossaryAlias(formData: FormData) {
  const { supabase } = await requireAdmin();
  const glossaryId = text(formData, "glossary_id");
  const alias = text(formData, "alias");
  if (!glossaryId || !alias) throw new Error("glossary and alias are required");
  const { error } = await supabase.from("glossary_aliases").insert({ glossary_id: glossaryId, alias, normalized_alias: normalizeAlias(alias) });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteGlossaryAlias(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("glossary_aliases").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addPlayerCharacter(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    player_id: text(formData, "player_id"),
    character_id: text(formData, "character_id"),
    role: text(formData, "role"),
    valid_from_patch_id: nullable(formData, "valid_from_patch_id"),
    valid_to_patch_id: nullable(formData, "valid_to_patch_id"),
    note: nullable(formData, "note"),
  };
  if (!payload.player_id || !payload.character_id || !payload.role) throw new Error("player, character and role are required");
  const { error } = await supabase.from("player_characters").upsert(payload, { onConflict: "player_id,character_id,role" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deletePlayerCharacter(playerId: string, characterId: string, role: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("player_characters").delete().eq("player_id", playerId).eq("character_id", characterId).eq("role", role);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addTournamentResult(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    tournament_id: text(formData, "tournament_id"),
    player_id: text(formData, "player_id"),
    placement: text(formData, "placement") ? numberValue(formData, "placement") : null,
    note: nullable(formData, "note"),
  };
  if (!payload.tournament_id || !payload.player_id) throw new Error("tournament and player are required");
  const { error } = await supabase.from("tournament_results").upsert(payload, { onConflict: "tournament_id,player_id" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteTournamentResult(tournamentId: string, playerId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tournament_results").delete().eq("tournament_id", tournamentId).eq("player_id", playerId);
  if (error) throw new Error(error.message);
  refresh();
}

export async function createMatch(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    tournament_id: nullable(formData, "tournament_id"),
    round_name: nullable(formData, "round_name"),
    played_at: nullable(formData, "played_at"),
    best_of: text(formData, "best_of") ? numberValue(formData, "best_of") : null,
    winner_player_id: nullable(formData, "winner_player_id"),
    score_text: nullable(formData, "score_text"),
    video_id: nullable(formData, "video_id"),
    notes: nullable(formData, "notes"),
    status: text(formData, "status") || "draft",
  };
  const { error } = await supabase.from("matches").insert(payload);
  if (error) throw new Error(error.message);
  refresh();
}

export async function archiveMatch(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("matches").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addMatchParticipant(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    match_id: text(formData, "match_id"),
    player_id: text(formData, "player_id"),
    side: numberValue(formData, "side", 1),
    character_id: nullable(formData, "character_id"),
    is_winner: boolValue(formData, "is_winner"),
  };
  if (!payload.match_id || !payload.player_id) throw new Error("match and player are required");
  const { error } = await supabase.from("match_participants").upsert(payload, { onConflict: "match_id,side" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteMatchParticipant(matchId: string, side: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("match_participants").delete().eq("match_id", matchId).eq("side", side);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addEntityVideo(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    entity_type: text(formData, "entity_type"),
    entity_id: text(formData, "entity_id"),
    video_id: text(formData, "video_id"),
    relationship: text(formData, "relationship") || "reference",
    display_order: numberValue(formData, "display_order"),
    note: nullable(formData, "note"),
  };
  if (!payload.entity_type || !payload.entity_id || !payload.video_id) throw new Error("entity type, entity id and video are required");
  const { error } = await supabase.from("entity_videos").insert(payload);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteEntityVideo(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("entity_videos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addComboMove(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    combo_id: text(formData, "combo_id"),
    move_id: text(formData, "move_id"),
    step_order: numberValue(formData, "step_order", 1),
    note: nullable(formData, "note"),
  };
  if (!payload.combo_id || !payload.move_id) throw new Error("combo and move are required");
  const { error } = await supabase.from("combo_moves").upsert(payload, { onConflict: "combo_id,step_order" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteComboMove(comboId: string, stepOrder: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("combo_moves").delete().eq("combo_id", comboId).eq("step_order", stepOrder);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addSetupMove(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    setup_id: text(formData, "setup_id"),
    move_id: text(formData, "move_id"),
    step_order: numberValue(formData, "step_order", 1),
    note: nullable(formData, "note"),
  };
  if (!payload.setup_id || !payload.move_id) throw new Error("setup and move are required");
  const { error } = await supabase.from("setup_moves").upsert(payload, { onConflict: "setup_id,step_order" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteSetupMove(setupId: string, stepOrder: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("setup_moves").delete().eq("setup_id", setupId).eq("step_order", stepOrder);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addTrainingRelation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    training_id: text(formData, "training_id"),
    related_type: text(formData, "related_type"),
    related_id: text(formData, "related_id"),
    relationship: nullable(formData, "relationship"),
  };
  if (!payload.training_id || !payload.related_type || !payload.related_id) throw new Error("training, related type and related id are required");
  const { error } = await supabase.from("training_relations").upsert(payload, { onConflict: "training_id,related_type,related_id" });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteTrainingRelation(trainingId: string, relatedType: string, relatedId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("training_relations").delete().eq("training_id", trainingId).eq("related_type", relatedType).eq("related_id", relatedId);
  if (error) throw new Error(error.message);
  refresh();
}
