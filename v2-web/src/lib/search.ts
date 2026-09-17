import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isMovePublicReady } from "@/lib/public-move-gate";
import { releaseFeatures } from "@/lib/release-features";
import type { SearchEntityType, SearchResultItem } from "@/types/search";
import type { SearchSuggestionCandidate } from "@/lib/search-suggestions";

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
  const mapped = rows.flatMap((row): SearchResultItem[] => {
    const rawType = row.entity_type ?? "";
    if (!SEARCH_ENTITY_TYPES.has(rawType as SearchEntityType)) return [];

    const type = rawType as SearchEntityType;
    if (type === "training" && !releaseFeatures.training) return [];
    if (["move", "combo", "setup", "sequence", "counter"].includes(type) && !releaseFeatures.publicStrategyContent) return [];
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

  // moves has no verification_status column. Do not let status=published alone
  // bypass the stricter Current Patch + verified Frame + Source + Classic gate.
  const readiness = await Promise.all(
    mapped.map((item) => item.type === "move" ? isMovePublicReady(item.href.split("/").pop() ?? "") : true),
  );

  return mapped.filter((_, index) => readiness[index]);
}

export async function getPublicSearchSuggestionCandidates(): Promise<SearchSuggestionCandidate[]> {
  if (!isConfigured()) return [];
  const supabase = getSupabaseServerClient();
  const [charactersResult, characterAliasesResult, playersResult, playerAliasesResult, tournamentsResult, videosResult] = await Promise.all([
    supabase.from("characters").select("id, name_ja, name_en, short_name").eq("status", "published"),
    supabase.from("character_aliases").select("character_id, alias"),
    supabase.from("players").select("id, display_name, real_name").eq("status", "published"),
    supabase.from("player_aliases").select("player_id, alias"),
    supabase.from("tournaments").select("name, series_name").eq("status", "published"),
    supabase.from("videos").select("title, video_type").eq("status", "published"),
  ]);
  for (const result of [charactersResult, characterAliasesResult, playersResult, playerAliasesResult, tournamentsResult, videosResult]) {
    if (result.error) console.error("[search] suggestion corpus failed", result.error.message);
  }

  const characterAliases = new Map<string, string[]>();
  for (const row of characterAliasesResult.data ?? []) {
    const values = characterAliases.get(String(row.character_id)) ?? [];
    if (typeof row.alias === "string") values.push(row.alias);
    characterAliases.set(String(row.character_id), values);
  }
  const playerAliases = new Map<string, string[]>();
  for (const row of playerAliasesResult.data ?? []) {
    const values = playerAliases.get(String(row.player_id)) ?? [];
    if (typeof row.alias === "string") values.push(row.alias);
    playerAliases.set(String(row.player_id), values);
  }

  return [
    ...(charactersResult.data ?? []).map((row) => ({
      label: String(row.name_ja), value: String(row.name_ja), type: "キャラクター",
      aliases: [row.name_en, row.short_name, ...(characterAliases.get(String(row.id)) ?? [])].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(playersResult.data ?? []).map((row) => ({
      label: String(row.display_name), value: String(row.display_name), type: "プレイヤー",
      aliases: [row.real_name, ...(playerAliases.get(String(row.id)) ?? [])].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(tournamentsResult.data ?? []).map((row) => ({
      label: String(row.name), value: String(row.name), type: "大会",
      aliases: [row.series_name].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(videosResult.data ?? []).flatMap((row) => typeof row.video_type === "string" && row.video_type.trim() ? [{
      label: row.video_type, value: row.video_type, type: "カテゴリ", aliases: [] as string[],
    }] : []),
  ];
}
