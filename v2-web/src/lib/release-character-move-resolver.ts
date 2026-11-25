import type { DevicePreviewBundle, DevicePreviewMoveCommand } from "@/lib/device-preview";

export type ReleaseMoveRow = {
  id: string; character_id: string; slug: string; name_ja: string;
  move_type: string | null; status: string;
};
export type ReleaseCommandRow = {
  id: string; move_id: string; control_scheme: string;
  command_text: string | null; numeric_notation: string | null;
  button_notation: string | null; condition_text: string | null; sort_order: number | null;
};
export type ReleaseFrameRow = {
  id: string; move_id: string; valid_from_patch_id: string;
  valid_to_patch_id: string | null; verification_status: string;
  startup: string | null; active: string | null; recovery: string | null;
  on_hit: string | null; on_block: string | null; damage: number | null;
  /** Optional (candidate columns): the official damage notation kept as written, e.g. "※1100", and its official condition. */
  damage_official_text?: string | null; damage_official_condition?: string | null;
};

/** Whitelist projection after the existing public gate. No draft export,
 * DB access, fixture approval or new publication grant occurs here.
 * Media absence never removes an eligible card. Ambiguous frame rows fail closed.
 */
export function resolveReleaseCharacterMoves({ characterId, currentPatchId, moves, commands, frames,
  gateReadyIds, officialCommandIds, officialFrameIds, includeModern = false, modernOnlyIds = new Set<string>(),
}: {
  characterId: string; currentPatchId: string; includeModern?: boolean;
  moves: ReleaseMoveRow[]; commands: ReleaseCommandRow[]; frames: ReleaseFrameRow[];
  gateReadyIds: Set<string>; officialCommandIds: Set<string>; officialFrameIds: Set<string>;
  /** Moves whose production grant is modern_only (the official Classic table has no row): their Modern input is the required one. */
  modernOnlyIds?: Set<string>;
}): DevicePreviewBundle["moves"] {
  if (!characterId || !currentPatchId) return [];
  const moveCounts = new Map<string, number>();
  for (const move of moves) moveCounts.set(move.id, (moveCounts.get(move.id) ?? 0) + 1);
  return moves.flatMap(move => {
    if (move.character_id !== characterId || move.status !== "published" || !gateReadyIds.has(move.id)
      || moveCounts.get(move.id) !== 1 || !move.slug || !move.name_ja.trim()) return [];
    const required = modernOnlyIds.has(move.id) ? "modern" : "classic";
    const moveCommands: DevicePreviewMoveCommand[] = commands.filter(command => command.move_id === move.id
      && (command.control_scheme === required || (includeModern && command.control_scheme === "modern")) && officialCommandIds.has(command.id)
      && Boolean(command.command_text?.trim() || command.numeric_notation?.trim() || command.button_notation?.trim()))
      .map(command => ({ moveId: move.id, scheme: command.control_scheme as "classic" | "modern", commandText: command.command_text,
        numericNotation: command.numeric_notation, buttonNotation: command.button_notation,
        conditionText: command.condition_text, sortOrder: command.sort_order }));
    const currentFrames = frames.filter(frame => frame.move_id === move.id
      && frame.valid_from_patch_id === currentPatchId && frame.valid_to_patch_id === null);
    if (!moveCommands.some(command => command.scheme === required) || currentFrames.length !== 1) return [];
    const frame = currentFrames[0];
    if (frame.verification_status !== "verified" || !officialFrameIds.has(frame.id)) return [];
    const damageText = frame.damage === null && typeof frame.damage_official_text === "string" && frame.damage_official_text.trim()
      ? frame.damage_official_text.trim() : null;
    return [{ id: move.id, slug: move.slug, name: move.name_ja, moveType: move.move_type,
      status: "published", usageSummary: null, commands: moveCommands, media: null,
      ...(required === "modern" ? { officialControl: "modern_only" as const } : {}),
      ...(damageText && frame.damage_official_condition?.trim() ? { damageCondition: frame.damage_official_condition.trim() } : {}),
      frame: { startup: frame.startup, active: frame.active, recovery: frame.recovery,
        onHit: frame.on_hit, onBlock: frame.on_block, damage: frame.damage ?? damageText, verificationStatus: "verified" } }];
  });
}
