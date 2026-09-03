import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SearchResultItem } from "@/types/search";

export type CoachSource = {
  title: string;
  url: string;
  sourceType: string;
  publisher: string | null;
  reliabilityLevel: string | null;
};

export type CoachEvidence = SearchResultItem & {
  sources: CoachSource[];
};

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function attachSourcesToEvidence(
  items: SearchResultItem[],
): Promise<CoachEvidence[]> {
  if (!items.length || !isConfigured()) {
    return items.map((item) => ({
      ...item,
      sources: [],
    }));
  }

  const ids = Array.from(
    new Set(items.map((item) => item.id)),
  );

  const entityTypes = Array.from(
    new Set(items.map((item) => item.type)),
  );

  const rows = await getPublicEntitySources(
    entityTypes,
    ids,
  );

  const sourceMap = new Map<string, CoachSource[]>();

  for (const row of rows) {
    const key = `${row.entityType}:${row.entityId}`;
    const list = sourceMap.get(key) ?? [];

    if (!list.some((source) => source.url === row.url)) {
      list.push({
        title: row.title,
        url: row.url,
        sourceType: row.sourceType,
        publisher: row.publisher,
        reliabilityLevel: row.reliabilityLevel,
      });

      sourceMap.set(key, list);
    }
  }

  return items.map((item) => ({
    ...item,
    sources:
      sourceMap.get(`${item.type}:${item.id}`) ?? [],
  }));
}

export async function getCurrentPatch() {
  if (!isConfigured()) return null;

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("patches")
    .select(
      "version_label, name, released_at, official_url",
    )
    .eq("is_current", true)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error(
        "[coach] current patch lookup failed",
        error.message,
      );
    }

    return null;
  }

  return {
    versionLabel: String(data.version_label),
    name:
      typeof data.name === "string"
        ? data.name
        : null,
    releasedAt:
      typeof data.released_at === "string"
        ? data.released_at
        : null,
    officialUrl:
      typeof data.official_url === "string"
        ? data.official_url
        : null,
  };
}