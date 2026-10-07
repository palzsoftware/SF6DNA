import { safeExternalUrl } from "@/lib/safe-external-url";
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

  let result;
  try {
    result = await supabase.rpc(
      "get_public_entity_sources",
      {
        target_entity_types: entityTypes,
        target_entity_ids: entityIds,
      },
    );
  } catch {
    // Source availability must not prevent the parent content from rendering.
    console.error("[public-source-links] lookup unavailable");
    return [];
  }
  const { data, error } = result;

  if (error) {
    console.error(
      "[public-source-links] lookup failed",
    );
    return [];
  }

  if (!Array.isArray(data)) return [];
  const rows = data as Array<PublicEntitySourceRpcRow | null>;

  return rows.flatMap((row) => {
    if (
      !row ||
      typeof row.entity_type !== "string" || !row.entity_type ||
      typeof row.entity_id !== "string" || !row.entity_id ||
      typeof row.source_id !== "string" || !row.source_id ||
      typeof row.title !== "string" || !row.title ||
      typeof row.url !== "string" || !row.url ||
      typeof row.source_type !== "string" || !row.source_type
    ) {
      return [];
    }

    const url = safeExternalUrl(row.url);
    if (!url) return [];
    return [{
      entityType: row.entity_type,
      entityId: row.entity_id,
      sourceId: row.source_id,
      relationship: typeof row.relationship === "string" ? row.relationship : "supporting",
      title: row.title,
      url,
      sourceType: row.source_type,
      publisher: typeof row.publisher === "string" ? row.publisher : null,
      publishedAt: typeof row.published_at === "string" ? row.published_at : null,
      accessedAt: typeof row.accessed_at === "string" ? row.accessed_at : null,
      reliabilityLevel: typeof row.reliability_level === "string" ? row.reliability_level : null,
    }];
  });
}
