import { getSupabaseServerClient } from "@/lib/supabase/server";

type PublicEntitySourceRpcRow = {
  entity_type: string | null;
  entity_id: string | null;
  source_id: string | null;
  relationship: string | null;
  title: string | null;
  url: string | null;
  source_type: string | null;
  publisher: string | null;
  published_at: string | null;
  accessed_at: string | null;
  reliability_level: string | null;
};

export type PublicEntitySourceRow = {
  entityType: string;
  entityId: string;
  sourceId: string;
  relationship: string;
  title: string;
  url: string;
  sourceType: string;
  publisher: string | null;
  publishedAt: string | null;
  accessedAt: string | null;
  reliabilityLevel: string | null;
};

export async function getPublicEntitySources(
  entityTypes: string[],
  entityIds: string[],
): Promise<PublicEntitySourceRow[]> {
  if (!entityTypes.length || !entityIds.length) return [];

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "get_public_entity_sources",
    {
      target_entity_types: entityTypes,
      target_entity_ids: entityIds,
    },
  );

  if (error) {
    console.error(
      "[public-source-links] lookup failed",
      error.message,
    );
    return [];
  }

  const rows = (data ?? []) as PublicEntitySourceRpcRow[];

  return rows.flatMap((row) => {
    if (
      !row.entity_type ||
      !row.entity_id ||
      !row.source_id ||
      !row.title ||
      !row.url ||
      !row.source_type
    ) {
      return [];
    }

    return [{
      entityType: row.entity_type,
      entityId: row.entity_id,
      sourceId: row.source_id,
      relationship: row.relationship ?? "supporting",
      title: row.title,
      url: row.url,
      sourceType: row.source_type,
      publisher: row.publisher,
      publishedAt: row.published_at,
      accessedAt: row.accessed_at,
      reliabilityLevel: row.reliability_level,
    }];
  });
}