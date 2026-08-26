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
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function attachSourcesToEvidence(items: SearchResultItem[]): Promise<CoachEvidence[]> {
  if (!items.length || !isConfigured()) return items.map((item) => ({ ...item, sources: [] }));

  const supabase = getSupabaseServerClient();
  const ids = Array.from(new Set(items.map((item) => item.id)));

  const { data, error } = await supabase
    .from("entity_sources")
    .select("entity_type, entity_id, relationship, sources(title, url, source_type, publisher, reliability_level)")
    .in("entity_id", ids);

  if (error) {
    console.error("[coach] source lookup failed", error.message);
    return items.map((item) => ({ ...item, sources: [] }));
  }

  const sourceMap = new Map<string, CoachSource[]>();

  for (const row of data ?? []) {
    const entityType = String(row.entity_type ?? "");
    const entityId = String(row.entity_id ?? "");
    const rawSource = row.sources as unknown as {
      title?: string;
      url?: string;
      source_type?: string;
      publisher?: string | null;
      reliability_level?: string | null;
    } | null;

    if (!rawSource?.title || !rawSource.url) continue;

    const key = `${entityType}:${entityId}`;
    const list = sourceMap.get(key) ?? [];
    if (!list.some((source) => source.url === rawSource.url)) {
      list.push({
        title: rawSource.title,
        url: rawSource.url,
        sourceType: rawSource.source_type ?? "unknown",
        publisher: rawSource.publisher ?? null,
        reliabilityLevel: rawSource.reliability_level ?? null,
      });
      sourceMap.set(key, list);
    }
  }

  return items.map((item) => ({
    ...item,
    sources: sourceMap.get(`${item.type}:${item.id}`) ?? [],
  }));
}

export async function getCurrentPatch() {
  if (!isConfigured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("patches")
    .select("version_label, name, released_at, official_url")
    .eq("is_current", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[coach] current patch lookup failed", error.message);
    return null;
  }

  return {
    versionLabel: String(data.version_label),
    name: typeof data.name === "string" ? data.name : null,
    releasedAt: typeof data.released_at === "string" ? data.released_at : null,
    officialUrl: typeof data.official_url === "string" ? data.official_url : null,
  };
}
