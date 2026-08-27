import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { KnowledgeCategory, KnowledgeListItem } from "@/types/knowledge";

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

  const { data, error } = await supabase
    .from("trainings")
    .select("id, slug, name, purpose")
    .eq("status", "published")
    .eq("verification_status", "verified")
    .limit(100);
  if (error) return logAndEmpty(category, error.message);
  return (data ?? []).map((row) => mapItem(row, "name", "purpose", undefined, false));
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
