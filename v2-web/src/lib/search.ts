import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SearchEntityType, SearchResultItem } from "@/types/search";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function normalizeSearchQuery(input: string) {
  return input.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

function hrefFor(type: SearchEntityType, slug: string) {
  const roots: Record<SearchEntityType, string> = {
    character: "/characters",
    move: "/moves",
    combo: "/combos",
    counter: "/counters",
    training: "/training",
    player: "/players",
    tournament: "/tournaments",
    video: "/videos",
    glossary: "/glossary",
  };
  return `${roots[type]}/${slug}`;
}

export async function searchAcrossContent(rawQuery: string): Promise<SearchResultItem[]> {
  const query = normalizeSearchQuery(rawQuery);
  if (!query || !isConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_sf6dna", {
    search_query: query,
    result_limit: 40,
  });

  if (error) {
    console.error("[search] RPC failed", error.message);
    return [];
  }

  return (data ?? []).flatMap((row) => {
    const type = String(row.entity_type) as SearchEntityType;
    const slug = String(row.slug ?? "");
    if (!slug || !(type in {
      character: 1, move: 1, combo: 1, counter: 1, training: 1,
      player: 1, tournament: 1, video: 1, glossary: 1,
    })) return [];

    const matchedBy = row.matched_by === "alias" ? "alias" : row.matched_by === "content" ? "content" : "name";
    return [{
      id: String(row.entity_id),
      type,
      title: String(row.title),
      subtitle: typeof row.subtitle === "string" ? row.subtitle : null,
      href: hrefFor(type, slug),
      matchedBy,
    } satisfies SearchResultItem];
  });
}
