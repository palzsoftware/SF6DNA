import { getSupabaseServerClient } from "@/lib/supabase/server";

type PublicSourceRpcRow = {
  id: string | null;
  title: string | null;
  url: string | null;
  publisher: string | null;
  source_type: string | null;
  reliability_level: string | null;
  published_at: string | null;
  accessed_at: string | null;
};

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
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "list_public_sources",
  );

  if (error) {
    console.error(
      "[sources] public list failed",
      error.message,
    );
    return [];
  }

  const rows = (data ?? []) as PublicSourceRpcRow[];

  return rows
    .flatMap((row) => {
      if (
        !row.id ||
        !row.title ||
        !row.url ||
        !row.source_type ||
        !row.reliability_level
      ) {
        return [];
      }

      return [{
        id: row.id,
        title: row.title,
        url: row.url,
        publisher: row.publisher,
        sourceType: row.source_type,
        reliabilityLevel: row.reliability_level,
        publishedAt: row.published_at,
        accessedAt: row.accessed_at,
      }];
    })
    .sort((a: PublicSource, b: PublicSource) => {
      const reliabilityCompare =
        a.reliabilityLevel.localeCompare(
          b.reliabilityLevel,
        );

      if (reliabilityCompare !== 0) {
        return reliabilityCompare;
      }

      const publisherCompare =
        (a.publisher ?? "").localeCompare(
          b.publisher ?? "",
        );

      if (publisherCompare !== 0) {
        return publisherCompare;
      }

      return a.title.localeCompare(b.title);
    });
}