import type { DevicePreviewBundle } from "./device-preview";

type RawTxtRow = Record<string, unknown>;
type TxtRecord = { characterSlug?: string; raw?: RawTxtRow };

const SAME_MOVE_FIELDS = ["name", "startup_frame", "active_frame", "recovery_frame", "frame", "hit_frame", "block_frame", "damage"] as const;
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/**
 * Official TXT sometimes lists one move twice: a Classic-only row (e.g. "2 + HK") and a Modern-only row
 * (e.g. "3 + 強") — ① Round16 confirmed this for arjun:web:111/201. Pairs are accepted only when, within one
 * character, exactly two rows share the internal name, every frame field and the note, and one row has only a
 * Classic input while the other has only a Modern input. No name similarity is used.
 * Returns modernOnlyKey -> classicOnlyKey.
 */
export function officialTxtControlSchemePairs(records: Record<string, TxtRecord>): Map<string, string> {
  const groups = new Map<string, string[]>();
  for (const [key, record] of Object.entries(records)) {
    const raw = record.raw;
    if (!raw || !record.characterSlug) continue;
    const signature = JSON.stringify([record.characterSlug, ...SAME_MOVE_FIELDS.map(field => raw[field] ?? null), raw.note ?? null]);
    groups.set(signature, [...(groups.get(signature) ?? []), key]);
  }
  const pairs = new Map<string, string>();
  for (const keys of groups.values()) {
    if (keys.length !== 2) continue;
    const rows = keys.map(key => ({ key, classic: text(records[key].raw?.command), modern: text(records[key].raw?.command_modern) }));
    const classicOnly = rows.filter(row => row.classic && !row.modern);
    const modernOnly = rows.filter(row => row.modern && !row.classic);
    if (classicOnly.length === 1 && modernOnly.length === 1) pairs.set(modernOnly[0].key, classicOnly[0].key);
  }
  return pairs;
}

/**
 * Shows such a pair as one card: the Modern input is added to the Classic card (only when that card has no
 * Modern input text) and the Modern-only card is hidden. If either card is missing, nothing changes.
 * Move IDs, data and the underlying rows are not modified.
 */
export function mergeOfficialTxtControlSchemeListings(bundle: DevicePreviewBundle, records: Record<string, TxtRecord>): DevicePreviewBundle {
  const pairs = officialTxtControlSchemePairs(records);
  const sourceOf = (move: DevicePreviewBundle["moves"][number]) => (move as { ws5CanonicalSource?: string }).ws5CanonicalSource;
  const byKey = new Map(bundle.moves.flatMap(move => (sourceOf(move) ? [[sourceOf(move)!, move] as const] : [])));
  const hidden = new Set<string>();
  const modernFor = new Map<string, string>();
  for (const [modernKey, classicKey] of pairs) {
    const modernCard = byKey.get(modernKey);
    const classicCard = byKey.get(classicKey);
    if (!modernCard || !classicCard || modernCard.id === classicCard.id) continue;
    const modernText = text(records[modernKey]?.raw?.command_modern);
    if (!modernText) continue;
    hidden.add(modernCard.id);
    modernFor.set(classicCard.id, modernText);
  }
  if (!hidden.size) return bundle;
  return { ...bundle, moves: bundle.moves.filter(move => !hidden.has(move.id)).map(move => {
    const modernText = modernFor.get(move.id);
    if (!modernText) return move;
    const commands = move.commands ?? [];
    const hasModern = commands.some(row => row.moveId === move.id && row.scheme.toLowerCase().startsWith("modern") &&
      [row.commandText, row.numericNotation, row.buttonNotation].some(value => typeof value === "string" && value.trim()));
    if (hasModern) return move;
    return { ...move, commands: [...commands, { moveId: move.id, scheme: "modern", commandText: modernText,
      numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 1 }] };
  }) };
}
