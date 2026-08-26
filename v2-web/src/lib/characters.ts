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
    name: String(row.name),
    nameEn: typeof row.name_en === "string" ? row.name_en : null,
    shortDescription:
      typeof row.short_description === "string" ? row.short_description : null,
    imageUrl: typeof row.image_url === "string" ? row.image_url : null,
    difficulty: typeof row.difficulty === "number" ? row.difficulty : null,
    rangeLabel: typeof row.range_label === "string" ? row.range_label : null,
    archetypeLabel:
      typeof row.archetype_label === "string" ? row.archetype_label : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export async function listCharacters(): Promise<CharacterSummary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("characters")
    .select(
      "id, slug, name, name_en, short_description, image_url, difficulty, range_label, archetype_label, updated_at"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

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
      "id, slug, name, name_en, short_description, image_url, difficulty, range_label, archetype_label, updated_at, concept, strengths, weaknesses"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !character) {
    if (error) console.error("[characters] detail failed", error.message);
    return null;
  }

  const { data: sections, error: sectionError } = await supabase
    .from("character_guide_sections")
    .select("id, section_key, title, body, sort_order")
    .eq("character_id", character.id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (sectionError) {
    console.error("[characters] guide sections failed", sectionError.message);
  }

  const guideSections: CharacterGuideSection[] = (sections ?? []).map((row) => ({
    id: String(row.id),
    sectionKey: String(row.section_key),
    title: String(row.title),
    body: String(row.body),
    sortOrder: Number(row.sort_order ?? 0),
  }));

  return {
    ...toSummary(character),
    concept: typeof character.concept === "string" ? character.concept : null,
    strengths: Array.isArray(character.strengths)
      ? character.strengths.filter((value): value is string => typeof value === "string")
      : [],
    weaknesses: Array.isArray(character.weaknesses)
      ? character.weaknesses.filter((value): value is string => typeof value === "string")
      : [],
    guideSections,
  };
}

export function characterDataSourceStatus() {
  return isSupabaseConfigured() ? "connected" : "unconfigured";
}
