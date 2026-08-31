import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { KnowledgeCategory, KnowledgeListItem, TrainingListItem } from "@/types/knowledge";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listKnowledge(category: KnowledgeCategory): Promise<KnowledgeListItem[]> {
  if (!isConfigured()) return [];
  const supabase = getSupabaseServerClient();

  if (category === "combo") {
    const { data, error } = await supabase
      .from("combos")
      .select("id, slug, name, purpose, difficulty, characters(name_ja)")
      .eq("status", "published")
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return logAndEmpty(category, error.message);
    return (data ?? []).map((row) => mapItem(row, "name", "purpose", "difficulty"));
  }

  if (category === "setup") {
    const { data, error } = await supabase
      .from("setups")
      .select("id, slug, name, description, characters(name_ja)")
      .eq("status", "published")
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return logAndEmpty(category, error.message);
    return (data ?? []).map((row) => mapItem(row, "name", "description"));
  }

  if (category === "sequence") {
    const { data, error } = await supabase
      .from("sequences")
      .select("id, slug, name, sequence_text, characters(name_ja)")
      .eq("status", "published")
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return logAndEmpty(category, error.message);
    return (data ?? []).map((row) => mapItem(row, "name", "sequence_text"));
  }

  if (category === "counter") {
    const { data, error } = await supabase
      .from("counters")
      .select("id, slug, title, summary, difficulty")
      .eq("status", "published")
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return logAndEmpty(category, error.message);
    return (data ?? []).map((row) => mapItem(row, "title", "summary", "difficulty", false));
  }

  const trainings = await listTrainingLibrary();
  return trainings;
}

export async function listTrainingLibrary(): Promise<TrainingListItem[]> {
  if (!isConfigured()) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trainings")
    .select(
      "id, slug, name, purpose, training_type, level, duration_minutes, player_character:characters!trainings_player_character_id_fkey(name_ja,slug)"
    )
    .eq("status", "published")
    .eq("verification_status", "verified")
    .order("name", { ascending: true })
    .limit(500);

  if (error) {
    console.error("[knowledge] training library failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const rawCharacter = row.player_character as unknown;
    const character = Array.isArray(rawCharacter)
      ? (rawCharacter[0] as { name_ja?: string; slug?: string } | undefined)
      : (rawCharacter as { name_ja?: string; slug?: string } | null);

    return {
      id: String(row.id),
      slug: String(row.slug),
      title: String(row.name ?? ""),
      characterName: character?.name_ja ?? null,
      characterSlug: character?.slug ?? null,
      summary: typeof row.purpose === "string" ? row.purpose : null,
      difficulty: null,
      trainingType: typeof row.training_type === "string" ? row.training_type : null,
      level: typeof row.level === "string" ? row.level : null,
      durationMinutes: typeof row.duration_minutes === "number" ? row.duration_minutes : null,
    };
  });
}

function mapItem(
  row: Record<string, unknown>,
  titleKey: string,
  summaryKey: string,
  difficultyKey?: string,
  includeCharacter = true
): KnowledgeListItem {
  const character = includeCharacter
    ? (row.characters as unknown as { name_ja?: string } | null)
    : null;

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row[titleKey] ?? ""),
    characterName: character?.name_ja ?? null,
    summary: typeof row[summaryKey] === "string" ? String(row[summaryKey]) : null,
    difficulty:
      difficultyKey && typeof row[difficultyKey] === "number" ? Number(row[difficultyKey]) : null,
  };
}

function logAndEmpty(category: KnowledgeCategory, message: string): KnowledgeListItem[] {
  console.error(`[knowledge] ${category} list failed`, message);
  return [];
}
