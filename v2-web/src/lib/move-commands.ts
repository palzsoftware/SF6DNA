import {
  getDevicePreviewMoveCommands,
  isDevicePreviewRequest,
  type DevicePreviewMoveCommand,
} from "@/lib/device-preview";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MoveCommandDisplay = DevicePreviewMoveCommand;

export async function listMoveCommandsForCharacter(
  characterId: string,
  previewToken?: string | null
): Promise<MoveCommandDisplay[]> {
  if (isDevicePreviewRequest(previewToken)) {
    return getDevicePreviewMoveCommands(characterId, previewToken);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("move_commands")
    .select("move_id, control_scheme, command_text, numeric_notation, button_notation, condition_text, sort_order, moves!inner(character_id, status)")
    .eq("moves.character_id", characterId)
    .eq("moves.status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[move-commands] public command lookup failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    moveId: String(row.move_id),
    scheme: String(row.control_scheme),
    commandText: typeof row.command_text === "string" ? row.command_text : null,
    numericNotation: typeof row.numeric_notation === "string" ? row.numeric_notation : null,
    buttonNotation: typeof row.button_notation === "string" ? row.button_notation : null,
    conditionText: typeof row.condition_text === "string" ? row.condition_text : null,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
  }));
}
