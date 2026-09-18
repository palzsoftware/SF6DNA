import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TrustedRetrievalItem } from "@/lib/coach-trusted-retrieval";

type PublicMoveMetadata = {
  entityId: string;
  slug: string;
  characterSlug: string | null;
  patchId: string;
  patchName: string | null;
  patchVersion: string;
  verifiedAt: string | null;
  publicSourceIds: Set<string>;
  publicSourceUrls: Set<string>;
};

export type PublicEntityEnrichmentResult = {
  items: TrustedRetrievalItem[];
  uncertainty: string[];
};

function sourceMatches(item: TrustedRetrievalItem, metadata: PublicMoveMetadata) {
  return Boolean(
    (item.sourceId && metadata.publicSourceIds.has(item.sourceId)) ||
      (item.sourceUrl && metadata.publicSourceUrls.has(item.sourceUrl)),
  );
}

export function mergePublicMoveMetadata(
  items: TrustedRetrievalItem[],
  metadataById: ReadonlyMap<string, PublicMoveMetadata>,
): PublicEntityEnrichmentResult {
  const uncertainty: string[] = [];
  const enriched = items.map((item) => {
    if (item.entityType !== "move") return item;

    const metadata = metadataById.get(item.entityId);
    if (!metadata) {
      uncertainty.push(`「${item.title}」は公開Moveの検証メタデータを確認できませんでした。`);
      return item;
    }
    if (!item.slug || item.slug !== metadata.slug) {
      uncertainty.push(`「${item.title}」はMove IDとslugが一致しないため、メタデータを統合しませんでした。`);
      return item;
    }
    if (!sourceMatches(item, metadata)) {
      uncertainty.push(`「${item.title}」は検索SourceとMoveの公開Source関係を厳密に確認できませんでした。`);
      return item;
    }

    return {
      ...item,
      characterSlug: metadata.characterSlug,
      patch: metadata.patchVersion,
      patchId: metadata.patchId,
      patchName: metadata.patchName,
      verificationStatus: "verified" as const,
      verificationSource: "public_move_gate" as const,
      verifiedAt: metadata.verifiedAt,
      availabilityStatus: "public" as const,
    };
  });

  return { items: enriched, uncertainty: [...new Set(uncertainty)] };
}

export async function enrichRetrievalItemsWithPublicEntityMetadata(
  items: TrustedRetrievalItem[],
): Promise<PublicEntityEnrichmentResult> {
  const moveIds = [...new Set(items.filter((item) => item.entityType === "move").map((item) => item.entityId))];
  if (!moveIds.length) return { items, uncertainty: [] };

  const supabase = getSupabaseServerClient();
  const { data: currentPatch, error: patchError } = await supabase
    .from("patches")
    .select("id, version_label, name")
    .eq("is_current", true)
    .maybeSingle();
  if (patchError || !currentPatch?.id || !currentPatch.version_label) {
    return { items, uncertainty: ["Current Patchを確認できないため、Moveメタデータを統合しませんでした。"] };
  }

  const [movesResult, commandsResult, framesResult] = await Promise.all([
    supabase.from("moves").select("id, slug, status, character_id, characters(slug)").in("id", moveIds).eq("status", "published"),
    supabase.from("move_commands").select("id, move_id").in("move_id", moveIds).eq("control_scheme", "classic"),
    supabase.from("move_frame_data").select("id, move_id").in("move_id", moveIds).eq("valid_from_patch_id", currentPatch.id).is("valid_to_patch_id", null).eq("verification_status", "verified"),
  ]);
  if (movesResult.error || commandsResult.error || framesResult.error) {
    return { items, uncertainty: ["公開Moveの検証メタデータ取得に失敗したため、既存の未検証境界を維持しました。"] };
  }

  const commands = commandsResult.data ?? [];
  const frames = framesResult.data ?? [];
  const allEntityIds = [
    ...moveIds,
    ...commands.map((row) => String(row.id)),
    ...frames.map((row) => String(row.id)),
  ];
  const sources = await getPublicEntitySources(
    ["move", "move_command", "frame", "move_frame_data"],
    allEntityIds,
  );
  const official = sources.filter((source) => source.reliabilityLevel === "official");
  const officialKeys = new Set(official.map((source) => `${source.entityType}:${source.entityId}`));
  const publicMoveSources = new Map<string, typeof sources>();
  for (const source of sources) {
    if (source.entityType !== "move") continue;
    const list = publicMoveSources.get(source.entityId) ?? [];
    list.push(source);
    publicMoveSources.set(source.entityId, list);
  }

  const metadata = new Map<string, PublicMoveMetadata>();
  for (const move of movesResult.data ?? []) {
    const id = String(move.id);
    const classic = commands.filter((row) => String(row.move_id) === id);
    const verifiedFrames = frames.filter((row) => String(row.move_id) === id);
    const moveHasOfficial = officialKeys.has(`move:${id}`);
    const commandHasOfficial = classic.some((row) => officialKeys.has(`move_command:${row.id}`));
    const frameHasOfficial = verifiedFrames.some((row) => officialKeys.has(`frame:${row.id}`) || officialKeys.has(`move_frame_data:${row.id}`));
    if (!classic.length || !verifiedFrames.length || !moveHasOfficial || !commandHasOfficial || !frameHasOfficial) continue;

    const directSources = publicMoveSources.get(id) ?? [];
    const characters = move.characters as unknown as { slug?: unknown } | Array<{ slug?: unknown }> | null;
    const character = Array.isArray(characters) ? characters[0] : characters;
    metadata.set(id, {
      entityId: id,
      slug: String(move.slug),
      characterSlug: character && typeof character.slug === "string" ? character.slug : null,
      patchId: String(currentPatch.id),
      patchName: typeof currentPatch.name === "string" ? currentPatch.name : null,
      patchVersion: String(currentPatch.version_label),
      // The current schema has no verified_at column. Do not substitute updated_at.
      verifiedAt: null,
      publicSourceIds: new Set(directSources.map((source) => source.sourceId)),
      publicSourceUrls: new Set(directSources.map((source) => source.url)),
    });
  }

  return mergePublicMoveMetadata(items, metadata);
}
