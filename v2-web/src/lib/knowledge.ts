import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { KnowledgeCategory, KnowledgeListItem } from "@/types/knowledge";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const CONFIG: Record<KnowledgeCategory, { table: string; title: string; summary: string; difficulty?: string }> = {
  combo: { table: "combos", title: "name", summary: "purpose", difficulty: "difficulty" },
  setup: { table: "setups", title: "name", summary: "description" },
  counter: { table: "counters", title: "title", summary: "summary", difficulty: "difficulty" },
  training: { table: "trainings", title: "name", summary: "purpose" },
};

export async function listKnowledge(category: KnowledgeCategory): Promise<KnowledgeListItem[]> {
  if (!isConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const config = CONFIG[category];
  const fields = ["id", "slug", config.title, config.summary, "character_id", "characters(name_ja)"];
  if (config.difficulty) fields.push(config.difficulty);

  const { data, error } = await supabase
    .from(config.table)
    .select(fields.join(","))
    .eq("status", "published")
    .limit(100);

  if (error) {
    console.error(`[knowledge] ${category} list failed`, error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const character = row.characters as unknown as { name_ja?: string } | null;
    return {
      id: String(row.id),
      slug: String(row.slug),
      title: String(row[config.title] ?? ""),
      characterName: character?.name_ja ?? null,
      summary: typeof row[config.summary] === "string" ? String(row[config.summary]) : null,
      difficulty: config.difficulty && typeof row[config.difficulty] === "number" ? Number(row[config.difficulty]) : null,
    };
  });
}
