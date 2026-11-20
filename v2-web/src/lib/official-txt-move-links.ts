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

export type OfficialTxtMultiHitData = {
  firstStageLinks: Record<string, string>;
  wholeMoveStages: Record<string, { stageKeys: string[]; damageSum: number; stageNames?: string[] }>;
  variantLabels?: Record<string, { label: string; evidence: string }>;
  classicSupplements?: Record<string, { classicFromKey: string; officialName: string }>;
};
export type OfficialStageRow = { key: string; label: string; startup: string; active: string; recovery: string;
  total: string; onHit: string; onBlock: string; damage: string };

/**
 * ① Round18 (Preview/local only):
 * - whole-move cards stay one card with their whole-move values. If an earlier connection renamed such a card
 *   to a single hit (e.g. Ryu 3605c1b6 → 不破三連撃（2段目）), the pre-connection card is restored.
 *   Each official hit is attached as detail rows only; values are never replaced by a single hit.
 *   damageSum is the simple sum of official per-hit damage (scaling is not in the official data).
 * - Modern-only official listings with no Classic card get the official Classic command and name from the
 *   paired Classic row (ID unchanged; e.g. Juri [チェーンコンボ]刈脚).
 */
export function withOfficialTxtMultiHit(bundle: DevicePreviewBundle, original: DevicePreviewBundle | null,
  data: OfficialTxtMultiHitData, records: Record<string, TxtRecord>): DevicePreviewBundle {
  const before = new Map((original?.moves ?? []).map(move => [move.id, move]));
  return { ...bundle, moves: bundle.moves.map(current => {
    let move = current;
    const whole = own(data.wholeMoveStages, move.id);
    if (whole) {
      const prior = before.get(move.id);
      if (prior && prior.name !== move.name) move = prior;
      const stages: OfficialStageRow[] = whole.stageKeys.flatMap((key, index) => {
        const raw = own(records, key)?.raw;
        if (!raw) return [];
        return [{ key, label: whole.stageNames?.[index] ?? text(raw.skill),
          startup: text(raw.startup_frame), active: text(raw.active_frame), recovery: text(raw.recovery_frame),
          total: text(raw.frame), onHit: text(raw.hit_frame), onBlock: text(raw.block_frame), damage: text(raw.damage) }];
      });
      if (stages.length === whole.stageKeys.length) move = { ...move, ws5OfficialStages: stages, ws5StageDamageSum: whole.damageSum } as typeof move;
    }
    const supplement = own(data.classicSupplements, move.id);
    const raw = supplement ? own(records, supplement.classicFromKey)?.raw : undefined;
    const classic = raw ? text(raw.command) : "";
    if (supplement && classic) {
      const commands = move.commands ?? [];
      const hasClassic = commands.some(row => row.moveId === move.id && row.scheme.trim().toLowerCase() === "classic" && text(row.commandText));
      move = { ...move, name: supplement.officialName, commands: hasClassic ? commands : [...commands,
        { moveId: move.id, scheme: "classic", commandText: classic, numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 0 }] };
    }
    return move;
  }) };
}
