import { getSupabaseServerClient } from "@/lib/supabase/server";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type SimpleDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: Array<[string, string | number | null]>;
};

export async function getMoveBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("moves")
    .select("id, slug, name_ja, name_en, move_type, strength_variant, description, usage_summary, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const c = data.characters as unknown as { name_ja?: string } | null;
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name_ja),
    summary: data.usage_summary ?? data.description ?? null,
    body: [["キャラクター", c?.name_ja ?? null], ["英語名", data.name_en ?? null], ["技種別", data.move_type ?? null], ["強度", data.strength_variant ?? null]],
  };
}

export async function getComboBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("combos")
    .select("id, slug, name, notation, starter_text, damage, drive_cost, sa_cost, position, difficulty, purpose, conditions, notes, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const c = data.characters as unknown as { name_ja?: string } | null;
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.purpose ?? null,
    body: [["キャラクター", c?.name_ja ?? null], ["入力", data.notation ?? null], ["始動", data.starter_text ?? null], ["ダメージ", data.damage ?? null], ["Dゲージ", data.drive_cost ?? null], ["SA", data.sa_cost ?? null], ["位置", data.position ?? null], ["難易度", data.difficulty ?? null], ["条件", data.conditions ?? null], ["補足", data.notes ?? null]],
  };
}

export async function getSetupBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("setups")
    .select("id, slug, name, setup_type, starter_condition, sequence_text, frame_advantage, position, meter_condition, description, counter_notes")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id), slug: String(data.slug), title: String(data.name), summary: data.description ?? null,
    body: [["種類", data.setup_type ?? null], ["始動条件", data.starter_condition ?? null], ["手順", data.sequence_text ?? null], ["有利F", data.frame_advantage ?? null], ["位置", data.position ?? null], ["ゲージ条件", data.meter_condition ?? null], ["対策メモ", data.counter_notes ?? null]],
  };
}

export async function getCounterBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("counters")
    .select("id, slug, title, summary, method, benefit, risk, difficulty, conditions, situation")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id), slug: String(data.slug), title: String(data.title), summary: data.summary ?? null,
    body: [["状況", data.situation ?? null], ["方法", data.method ?? null], ["利点", data.benefit ?? null], ["リスク", data.risk ?? null], ["難易度", data.difficulty ?? null], ["条件", data.conditions ?? null]],
  };
}

export async function getTrainingBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trainings")
    .select("id, slug, name, training_type, purpose, level, duration_minutes, recording_instructions, playback_settings, cpu_settings, method, success_criteria, recommended_reps, next_step")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id), slug: String(data.slug), title: String(data.name), summary: data.purpose ?? null,
    body: [["種類", data.training_type ?? null], ["レベル", data.level ?? null], ["目安時間", data.duration_minutes ?? null], ["録画", data.recording_instructions ?? null], ["再生設定", data.playback_settings ?? null], ["CPU設定", data.cpu_settings ?? null], ["方法", data.method ?? null], ["成功条件", data.success_criteria ?? null], ["回数", data.recommended_reps ?? null], ["次の練習", data.next_step ?? null]],
  };
}
