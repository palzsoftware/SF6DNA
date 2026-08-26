import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CharacterDetail, CharacterGuideSection, CharacterSummary } from "@/types/character";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function toSummary(row: Record<string, unknown>): CharacterSummary {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name_ja),
    nameEn: typeof row.name_en === "string" ? row.name_en : null,
    shortDescription: typeof row.summary === "string" ? row.summary : null,
    imageUrl: typeof row.image_url === "string" ? row.image_url : null,
    difficulty: typeof row.difficulty === "number" ? row.difficulty : null,
    rangeLabel:
      typeof row.preferred_range === "string" ? row.preferred_range : null,
    archetypeLabel: typeof row.archetype === "string" ? row.archetype : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export async function listCharacters(): Promise<CharacterSummary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("characters")
    .select(
      "id, slug, name_ja, name_en, summary, image_url, difficulty, preferred_range, archetype, updated_at"
    )
    .eq("status", "published")
    .eq("is_playable", true)
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name_ja", { ascending: true });

  if (error) {
    console.error("[characters] list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => toSummary(row));
}

export async function getCharacterBySlug(slug: string): Promise<CharacterDetail | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data: character, error } = await supabase
    .from("characters")
    .select(
      "id, slug, name_ja, name_en, summary, image_url, difficulty, preferred_range, archetype, updated_at, strengths_summary, weaknesses_summary"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_playable", true)
    .maybeSingle();

  if (error || !character) {
    if (error) console.error("[characters] detail failed", error.message);
    return null;
  }

  const { data: sections, error: sectionError } = await supabase
    .from("character_guide_sections")
    .select("id, section_type, title, body, display_order")
    .eq("character_id", character.id)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (sectionError) {
    console.error("[characters] guide sections failed", sectionError.message);
  }

  const guideSections: CharacterGuideSection[] = (sections ?? []).map((row) => ({
    id: String(row.id),
    sectionKey: String(row.section_type),
    title: String(row.title),
    body: String(row.body),
    sortOrder: Number(row.display_order ?? 0),
  }));

  return {
    ...toSummary(character),
    strengthsSummary:
      typeof character.strengths_summary === "string" ? character.strengths_summary : null,
    weaknessesSummary:
      typeof character.weaknesses_summary === "string" ? character.weaknesses_summary : null,
    guideSections,
  };
}

export function characterDataSourceStatus() {
  return isSupabaseConfigured() ? "connected" : "unconfigured";
}
