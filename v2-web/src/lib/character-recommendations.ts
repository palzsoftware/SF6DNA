import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CharacterRecommendation = {
  characterId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  matchPercent: number;
  mappedTraits: number;
  activeTraits: number;
  reasons: Array<{ key: string; label: string; userWeight: number; characterScore: number }>;
};

type TraitInput = Record<string, number>;

export async function recommendCharacters(
  input: TraitInput,
  limit = 5,
): Promise<CharacterRecommendation[]> {
  const activeEntries = Object.entries(input)
    .map(([key, value]) => [key, Number(value || 0)] as const)
    .filter(([, value]) => Number.isFinite(value) && value > 0);

  if (!activeEntries.length) return [];

  const supabase = getSupabaseServerClient();
  const activeKeys = activeEntries.map(([key]) => key);

  const { data: traits, error: traitError } = await supabase
    .from("character_traits")
    .select("id, trait_key, label")
    .eq("status", "published")
    .in("trait_key", activeKeys);

  if (traitError || !traits?.length) {
    if (traitError) console.error("[recommendations] trait lookup failed", traitError.message);
    return [];
  }

  const traitById = new Map(
    traits.map((trait) => [
      String(trait.id),
      { key: String(trait.trait_key), label: String(trait.label) },
    ]),
  );
  const traitIds = [...traitById.keys()];

  const { data: rows, error: scoreError } = await supabase
    .from("character_trait_scores")
    .select("id, character_id, trait_id, score, characters!inner(id, slug, name_ja, image_url, status, is_playable)")
    .eq("status", "published")
    .eq("verification_status", "verified")
    .in("trait_id", traitIds)
    .eq("characters.status", "published")
    .eq("characters.is_playable", true);

  if (scoreError || !rows?.length) {
    if (scoreError) console.error("[recommendations] score lookup failed", scoreError.message);
    return [];
  }

  const scoreIds = rows.map((row) => String(row.id));
  const sourceLinks = await getPublicEntitySources(
    ["character_trait_score"],
    scoreIds,
  );

  const sourcedScoreIds = new Set(
    sourceLinks.map((row) => row.entityId),
  );
  if (!sourcedScoreIds.size) return [];

  const inputMap = new Map(activeEntries);
  const grouped = new Map<string, {
    characterId: string;
    slug: string;
    name: string;
    imageUrl: string | null;
    weighted: number;
    denominator: number;
    reasons: CharacterRecommendation["reasons"];
  }>();

  for (const row of rows) {
    if (!sourcedScoreIds.has(String(row.id))) continue;

    const trait = traitById.get(String(row.trait_id));
    if (!trait) continue;
    const userWeight = inputMap.get(trait.key) ?? 0;
    if (userWeight <= 0) continue;

    const character = row.characters as unknown as {
      id?: string;
      slug?: string;
      name_ja?: string;
      image_url?: string | null;
    } | null;
    if (!character?.id || !character.slug || !character.name_ja) continue;

    const characterScore = Number(row.score ?? 0);
    const current = grouped.get(character.id) ?? {
      characterId: character.id,
      slug: character.slug,
      name: character.name_ja,
      imageUrl: character.image_url ?? null,
      weighted: 0,
      denominator: 0,
      reasons: [],
    };

    current.weighted += userWeight * characterScore;
    current.denominator += userWeight * 5;
    current.reasons.push({
      key: trait.key,
      label: trait.label,
      userWeight,
      characterScore,
    });
    grouped.set(character.id, current);
  }

  const minimumMappedTraits = Math.max(1, Math.ceil(activeEntries.length * 0.75));

  return [...grouped.values()]
    .filter((item) => item.reasons.length >= minimumMappedTraits && item.denominator > 0)
    .map((item) => ({
      characterId: item.characterId,
      slug: item.slug,
      name: item.name,
      imageUrl: item.imageUrl,
      matchPercent: Math.round((item.weighted / item.denominator) * 100),
      mappedTraits: item.reasons.length,
      activeTraits: activeEntries.length,
      reasons: item.reasons
        .sort((a, b) => (b.userWeight * b.characterScore) - (a.userWeight * a.characterScore))
        .slice(0, 3),
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent || b.mappedTraits - a.mappedTraits)
    .slice(0, Math.max(1, Math.min(limit, 10)));
}
