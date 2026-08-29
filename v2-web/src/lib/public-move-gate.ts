import { getSupabaseServerClient } from "@/lib/supabase/server";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type PublicSupabase = ReturnType<typeof getSupabaseServerClient>;

async function hasOfficialEvidence(
  supabase: PublicSupabase,
  entityTypes: string[],
  entityIds: string[],
) {
  if (!entityIds.length) return false;

  const { data: links, error: linkError } = await supabase
    .from("entity_sources")
    .select("source_id")
    .in("entity_type", entityTypes)
    .in("entity_id", entityIds);

  if (linkError || !links?.length) return false;

  const sourceIds = [...new Set(links.map((link) => link.source_id))];
  const { count, error: sourceError } = await supabase
    .from("sources")
    .select("id", { count: "exact", head: true })
    .in("id", sourceIds)
    .eq("reliability_level", "official");

  return !sourceError && Boolean(count);
}

/**
 * Public Move Gate.
 *
 * moves has no verification_status of its own, so status=published is not enough.
 * A public move must have a Classic command with official evidence, a verified frame
 * for the current patch with official evidence, and an official Source relation for
 * the move itself. Modern Command is optional and must never be inferred when absent.
 *
 * entity_sources.entity_id is polymorphic and intentionally has no FK to Move/Command/
 * Frame tables, so evidence checks must not rely on PostgREST inferred joins.
 */
export async function isMovePublicReady(slug: string): Promise<boolean> {
  if (!configured()) return false;

  const supabase = getSupabaseServerClient();
  const [{ data: move }, { data: currentPatch }] = await Promise.all([
    supabase.from("moves").select("id").eq("slug", slug).eq("status", "published").maybeSingle(),
    supabase.from("patches").select("id").eq("is_current", true).maybeSingle(),
  ]);

  if (!move?.id || !currentPatch?.id) return false;

  const [{ data: classicCommands, error: commandError }, { data: frames, error: frameError }] = await Promise.all([
    supabase
      .from("move_commands")
      .select("id")
      .eq("move_id", move.id)
      .eq("control_scheme", "classic"),
    supabase
      .from("move_frame_data")
      .select("id")
      .eq("move_id", move.id)
      .eq("valid_from_patch_id", currentPatch.id)
      .is("valid_to_patch_id", null)
      .eq("verification_status", "verified"),
  ]);

  if (commandError || frameError || !classicCommands?.length || !frames?.length) return false;

  const [moveEvidence, commandEvidence, frameEvidence] = await Promise.all([
    hasOfficialEvidence(supabase, ["move"], [move.id]),
    hasOfficialEvidence(supabase, ["move_command"], classicCommands.map((command) => command.id)),
    hasOfficialEvidence(supabase, ["frame", "move_frame_data"], frames.map((frame) => frame.id)),
  ]);

  return moveEvidence && commandEvidence && frameEvidence;
}
