import {
  listCharacterSectionItems,
  type CharacterSectionItem,
} from "@/lib/character-sections";
import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MatchupCounterItem = {
  id: string;
  title: string;
  summary: string | null;
  href: string;
  meta: string | null;
};

export type MatchupCardData = {
  opponentMoves: CharacterSectionItem[];
  counters: MatchupCounterItem[];
};

export async function getMatchupCardData(
  ownCharacterId: string,
  opponentCharacterId: string,
): Promise<MatchupCardData> {
  const opponentMoves = (
    await listCharacterSectionItems(
      opponentCharacterId,
      "moves",
    )
  ).slice(0, 12);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      opponentMoves,
      counters: [],
    };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("counters")
    .select(
      "id, slug, title, summary, counter_type, difficulty",
    )
    .eq(
      "defender_character_id",
      ownCharacterId,
    )
    .eq(
      "opponent_character_id",
      opponentCharacterId,
    )
    .eq("status", "published")
    .eq("verification_status", "verified")
    .limit(30);

  if (error) {
    console.error(
      "[matchup-card] counters failed",
      error.message,
    );

    return {
      opponentMoves,
      counters: [],
    };
  }

  const rows = data ?? [];

  if (!rows.length) {
    return {
      opponentMoves,
      counters: [],
    };
  }

  const ids = rows.map((row) => String(row.id));

  const sourceLinks = await getPublicEntitySources(
    ["counter"],
    ids,
  );

  const sourced = new Set(
    sourceLinks.map((row) => row.entityId),
  );

  const counters = rows.flatMap((row) =>
    sourced.has(String(row.id))
      ? [{
          id: String(row.id),
          title: String(row.title),
          summary:
            typeof row.summary === "string"
              ? row.summary
              : null,
          href: `/counters/${row.slug}`,
          meta:
            [
              row.counter_type,
              row.difficulty
                ? `難易度 ${row.difficulty}`
                : null,
            ]
              .filter(Boolean)
              .join(" / ") || null,
        }]
      : [],
  );

  return {
    opponentMoves,
    counters,
  };
}