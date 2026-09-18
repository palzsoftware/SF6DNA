import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isMovePublicReady } from "@/lib/public-move-gate";
import { releaseFeatures } from "@/lib/release-features";
import type { SearchEntityType, SearchResultItem } from "@/types/search";
import type { SearchSuggestionCandidate } from "@/lib/search-suggestions";

const CHARACTER_SUGGESTION_ALIASES: Record<string, string[]> = {
  jp: ["じぇいぴー"],
  ryu: ["りゅう"],
};

const PLAYER_SUGGESTION_ALIASES: Record<string, string[]> = {
  dogura: ["どぐら"],
  higuchi: ["ひぐち"],
  ryusei: ["Ryusei"],
  tokido: ["Tokido"],
};

const VIDEO_CATEGORY_SUGGESTIONS: Record<string, { label: string; aliases: string[] }> = {
  combo: { label: "コンボ", aliases: ["combo"] },
  counter: { label: "対策", aliases: ["counter"] },
  guide: { label: "ガイド", aliases: ["guide", "攻略"] },
  match: { label: "対戦", aliases: ["match"] },
  neutral: { label: "立ち回り", aliases: ["neutral"] },
  official_guide: { label: "公式ガイド", aliases: ["official guide"] },
  setplay: { label: "セットプレイ", aliases: ["setplay", "起き攻め"] },
  setup: { label: "セットプレイ", aliases: ["setup", "起き攻め"] },
  tournament: { label: "大会", aliases: ["tournament"] },
  torikore: { label: "トリコレ", aliases: ["とりこれ"] },
};

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
      relevanceScore: typeof row.score === "number" && Number.isFinite(row.score) ? row.score : null,
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
  const [charactersResult, characterAliasesResult, playersResult, playerAliasesResult, playerCharactersResult, tournamentsResult, videosResult] = await Promise.all([
    supabase.from("characters").select("id, slug, name_ja, name_en, short_name").eq("status", "published"),
    supabase.from("character_aliases").select("character_id, alias"),
    supabase.from("players").select("id, slug, display_name, real_name, team_name").eq("status", "published"),
    supabase.from("player_aliases").select("player_id, alias"),
    supabase.from("player_characters").select("player_id, characters!inner(name_ja, name_en, status)"),
    supabase.from("tournaments").select("name, series_name").eq("status", "published"),
    supabase.from("videos").select("title, video_type").eq("status", "published"),
  ]);
  for (const result of [charactersResult, characterAliasesResult, playersResult, playerAliasesResult, playerCharactersResult, tournamentsResult, videosResult]) {
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
  const playerCharacters = new Map<string, string[]>();
  for (const row of playerCharactersResult.data ?? []) {
    const character = row.characters as unknown as { name_ja: string; name_en: string | null; status: string } | null;
    if (!character || character.status !== "published") continue;
    const values = playerCharacters.get(String(row.player_id)) ?? [];
    values.push(character.name_ja);
    if (character.name_en) values.push(character.name_en);
    playerCharacters.set(String(row.player_id), values);
  }

  return [
    ...(charactersResult.data ?? []).map((row) => ({
      label: String(row.name_ja), value: String(row.name_ja), type: "キャラクター",
      aliases: [row.name_en, row.short_name, ...(typeof row.slug === "string" ? CHARACTER_SUGGESTION_ALIASES[row.slug] ?? [] : []), ...(characterAliases.get(String(row.id)) ?? [])].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(playersResult.data ?? []).map((row) => ({
      label: String(row.display_name), value: String(row.display_name), type: "プレイヤー",
      aliases: [row.real_name, row.team_name, ...(typeof row.slug === "string" ? PLAYER_SUGGESTION_ALIASES[row.slug] ?? [] : []), ...(playerAliases.get(String(row.id)) ?? []), ...(playerCharacters.get(String(row.id)) ?? [])].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(tournamentsResult.data ?? []).map((row) => ({
      label: String(row.name), value: String(row.name), type: "大会",
      aliases: [row.series_name].filter((value): value is string => typeof value === "string" && Boolean(value.trim())),
    })),
    ...(videosResult.data ?? []).flatMap((row) => {
      if (typeof row.video_type !== "string" || !row.video_type.trim()) return [];
      const category = VIDEO_CATEGORY_SUGGESTIONS[row.video_type];
      return [{
        label: category?.label ?? row.video_type,
        value: row.video_type,
        type: "カテゴリ",
        aliases: category?.aliases ?? [],
      }];
    }),
  ];
}
