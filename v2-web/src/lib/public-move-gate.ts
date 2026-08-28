import { getSupabaseServerClient } from "@/lib/supabase/server";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Public Move Gate.
 *
 * moves has no verification_status of its own, so status=published is not enough.
 * A public move must have a Classic command with official evidence, a verified frame
 * for the current patch with official evidence, and an official Source relation for
 * the move itself. Modern Command is optional and must never be inferred when absent.
 */
export async function isMovePublicReady(slug: string): Promise<boolean> {
  if (!configured()) return false;

  const supabase = getSupabaseServerClient();
  const [{ data: move }, { data: currentPatch }] = await Promise.all([
    supabase.from("moves").select("id").eq("slug", slug).eq("status", "published").maybeSingle(),
    supabase.from("patches").select("id").eq("is_current", true).maybeSingle(),
  ]);

  if (!move?.id || !currentPatch?.id) return false;

  const [{ data: classic }, { data: frame }, { data: moveSources }] = await Promise.all([
    supabase
      .from("move_commands")
      .select("id, entity_sources!inner(sources!inner(reliability_level))")
      .eq("move_id", move.id)
      .eq("control_scheme", "classic")
      .eq("entity_sources.sources.reliability_level", "official")
      .limit(1),
    supabase
      .from("move_frame_data")
      .select("id")
      .eq("move_id", move.id)
      .eq("valid_from_patch_id", currentPatch.id)
      .is("valid_to_patch_id", null)
      .eq("verification_status", "verified")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("entity_sources")
      .select("id, sources!inner(reliability_level)")
      .eq("entity_type", "move")
      .eq("entity_id", move.id)
      .eq("sources.reliability_level", "official")
      .limit(1),
  ]);

  if (!classic?.length || !frame?.id || !moveSources?.length) return false;

  const { data: frameSources } = await supabase
    .from("entity_sources")
    .select("id, sources!inner(reliability_level)")
    .in("entity_type", ["frame", "move_frame_data"])
    .eq("entity_id", frame.id)
    .eq("sources.reliability_level", "official")
    .limit(1);

  return Boolean(frameSources?.length);
}
