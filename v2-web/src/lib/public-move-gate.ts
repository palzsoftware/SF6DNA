import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

async function hasOfficialEvidence(
  entityTypes: string[],
  entityIds: string[],
) {
  if (!entityIds.length) return false;

  const sources = await getPublicEntitySources(
    entityTypes,
    entityIds,
  );

  return sources.some(
    (source) =>
      source.reliabilityLevel === "official",
  );
}

/**
 * Public Move Gate.
 *
 * moves has no verification_status of its own, so
 * status=published is not enough.
 *
 * A public move must have:
 * - a Classic command with official evidence
 * - a verified current frame with official evidence
 * - official evidence for the Move itself
 *
 * Modern Command is optional.
 */
export async function isMovePublicReady(
  slug: string,
): Promise<boolean> {
  if (!configured()) return false;

  const supabase = getSupabaseServerClient();

  const [
    { data: move },
    { data: currentPatch },
  ] = await Promise.all([
    supabase
      .from("moves")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle(),

    supabase
      .from("patches")
      .select("id")
      .eq("is_current", true)
      .maybeSingle(),
  ]);

  if (!move?.id || !currentPatch?.id) {
    return false;
  }

  const [
    {
      data: classicCommands,
      error: commandError,
    },
    {
      data: frames,
      error: frameError,
    },
  ] = await Promise.all([
    supabase
      .from("move_commands")
      .select("id")
      .eq("move_id", move.id)
      .eq("control_scheme", "classic"),

    supabase
      .from("move_frame_data")
      .select("id")
      .eq("move_id", move.id)
      .eq(
        "valid_from_patch_id",
        currentPatch.id,
      )
      .is("valid_to_patch_id", null)
      .eq(
        "verification_status",
        "verified",
      ),
  ]);

  if (
    commandError ||
    frameError ||
    !classicCommands?.length ||
    !frames?.length
  ) {
    return false;
  }

  const [
    moveEvidence,
    commandEvidence,
    frameEvidence,
  ] = await Promise.all([
    hasOfficialEvidence(
      ["move"],
      [String(move.id)],
    ),

    hasOfficialEvidence(
      ["move_command"],
      classicCommands.map((command) =>
        String(command.id),
      ),
    ),

    hasOfficialEvidence(
      ["frame", "move_frame_data"],
      frames.map((frame) =>
        String(frame.id),
      ),
    ),
  ]);

  return (
    moveEvidence &&
    commandEvidence &&
    frameEvidence
  );
}