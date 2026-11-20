import type { DevicePreviewBundle, DevicePreviewMoveCommand } from "./device-preview";

type RawTxtRow = Record<string, unknown>;
type TxtRecord = { characterSlug?: string; raw?: RawTxtRow };
export type OfficialTxtMoveLinkData = {
  links: Record<string, string>;
  variantLabels?: Record<string, { label: string; evidence: string }>;
};

const FRAME_KEYS = { startup: "startup_frame", active: "active_frame", recovery: "recovery_frame",
  onHit: "hit_frame", onBlock: "block_frame", damage: "damage" } as const;
const text = (value: unknown) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");
const own = <T,>(record: Record<string, T> | undefined, key: string) =>
  record && Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined;

/**
 * ① Round17: connects displayed cards to the official TXT row confirmed by an exact Classic command match.
 * Preview/local display only (the caller gates it). For a linked card:
 * - official non-blank frame values are shown (official data is the primary source); blank official fields keep
 *   the card value here and are classified later by withOfficialTotalFrames.
 * - the official Classic/Modern command text replaces the card's text for that control scheme.
 * - a card already connected to a different official row is left unchanged (never re-pointed).
 * Move IDs, DB rows and the canonical TXT are not modified. Links to single-hit rows are excluded in the data.
 */
export function withOfficialTxtMoveLinks(bundle: DevicePreviewBundle, data: OfficialTxtMoveLinkData, records: Record<string, TxtRecord>): DevicePreviewBundle {
  return { ...bundle, moves: bundle.moves.map(original => {
    const label = own(data.variantLabels, original.id)?.label;
    const move = label ? { ...original, ws5VariantLabel: label } : original;
    const key = own(data.links, move.id);
    const raw = key ? own(records, key)?.raw : undefined;
    const current = (move as { ws5CanonicalSource?: string }).ws5CanonicalSource;
    if (!key || !raw || (current && current !== key)) return move;
    const frame = { ...(move.frame ?? {}) } as NonNullable<typeof move.frame>;
    const frameFieldStatus = { ...move.frameFieldStatus };
    for (const [field, rawKey] of Object.entries(FRAME_KEYS) as [keyof typeof FRAME_KEYS, string][]) {
      const value = text(raw[rawKey]);
      if (!value) continue;
      (frame as Record<string, unknown>)[field] = value;
      frameFieldStatus[field] = "LOCAL_OFFICIAL_TXT_CANONICAL";
    }
    let commands: DevicePreviewMoveCommand[] = [...(move.commands ?? [])];
    for (const [scheme, rawKey, sortOrder] of [["classic", "command", 0], ["modern", "command_modern", 1]] as const) {
      const official = text(raw[rawKey]);
      if (!official) continue;
      // Only the plain scheme row is replaced; sub-variants (e.g. modern_assist) stay as they are.
      const isScheme = (row: DevicePreviewMoveCommand) => row.moveId === move.id && row.scheme.trim().toLowerCase().replaceAll("-", "_") === scheme;
      const kept = commands.filter(row => !isScheme(row));
      // A leading official condition such as "（近距離で）" is kept as the row's condition, not dropped.
      const condition = official.match(/^（([^）]+)）\s*/);
      commands = [...kept, { moveId: move.id, scheme, commandText: condition ? official.slice(condition[0].length) : official,
        numericNotation: null, buttonNotation: null, conditionText: condition ? condition[1] : null, sortOrder }];
    }
    return { ...move, ws5CanonicalSource: key, frame, frameFieldStatus, commands };
  }) };
}
