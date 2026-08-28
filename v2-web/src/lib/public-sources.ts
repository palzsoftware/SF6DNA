import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PublicSource = {
  id: string;
  title: string;
  url: string;
  publisher: string | null;
  sourceType: string;
  reliabilityLevel: string;
  publishedAt: string | null;
  accessedAt: string | null;
};

export async function listPublicSources(): Promise<PublicSource[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sources")
    .select("id, title, url, publisher, source_type, reliability_level, published_at, accessed_at")
    .in("reliability_level", ["official", "primary"])
    .order("reliability_level", { ascending: true })
    .order("publisher", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error) {
    console.error("[sources] public list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    url: String(row.url),
    publisher: typeof row.publisher === "string" ? row.publisher : null,
    sourceType: String(row.source_type),
    reliabilityLevel: String(row.reliability_level),
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    accessedAt: typeof row.accessed_at === "string" ? row.accessed_at : null,
  }));
}
