import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SearchEntityType, SearchResultItem } from "@/types/search";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function normalizeSearchQuery(input: string) {
  return input.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

type SearchRpcRow = {
  entity_type: string | null;
  entity_id: string | null;
  slug: string | null;
  title: string | null;
  subtitle: string | null;
  matched_by: string | null;
  score: number | null;
};

const SEARCH_ENTITY_TYPES = new Set<SearchEntityType>([
  "character",
  "move",
  "combo",
  "setup",
  "sequence",
  "counter",
  "training",
  "player",
  "tournament",
  "video",
  "glossary",
]);

function hrefFor(type: SearchEntityType, slug: string) {
  const roots: Record<SearchEntityType, string> = {
    character: "/characters",
    move: "/moves",
    combo: "/combos",
    setup: "/setups",
    sequence: "/sequences",
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

  const rows = (data ?? []) as SearchRpcRow[];

  return rows.flatMap((row): SearchResultItem[] => {
    const rawType = row.entity_type ?? "";
    if (!SEARCH_ENTITY_TYPES.has(rawType as SearchEntityType)) return [];

    const type = rawType as SearchEntityType;
    const slug = row.slug ?? "";
    const id = row.entity_id ?? "";
    const title = row.title ?? "";
    if (!slug || !id || !title) return [];

    const matchedBy: SearchResultItem["matchedBy"] =
      row.matched_by === "alias"
        ? "alias"
        : row.matched_by === "content"
          ? "content"
          : "name";

    return [{
      id,
      type,
      title,
      subtitle: row.subtitle,
      href: hrefFor(type, slug),
      matchedBy,
    }];
  });
}
