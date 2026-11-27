import type { DevicePreviewBundle } from "@/lib/device-preview";
import { LOCAL_OFFICIAL_FRAME_STATUS } from "@/lib/character-unified-contract";

type Move = DevicePreviewBundle["moves"][number];
type FillField = "startup" | "active" | "recovery" | "total" | "onHit" | "onBlock" | "damage";
/** One row of the official frame table (checked 2026-11-24), built by scripts/moves/build_all32_official_move_fill.py. */
export type OfficialMoveFillRecord = {
  k: string | null; n: string; t: string; v: Partial<Record<FillField, string>>;
  i: Partial<Record<"classic" | "modern", string>>; u: string; h: string;
};
export type OfficialMoveFillData = { status: string; byCharacter: Readonly<Record<string, readonly OfficialMoveFillRecord[]>> };
export type OfficialMoveFillEvidence = { patch: string | null; verification: string; sources: { id: string; title: string; url: string; publisher: string; sourceType: string; relationship: string }[] };

/** "total" is not filled: in the 2026-11-24 data most total values exist only in the page's embedded data, not on the
 * public frame table (C, 2026-11-25: the table shows a total for 415 rows only), so they are not shown as table values. */
const FILL_FIELDS: readonly FillField[] = ["startup", "active", "recovery", "onHit", "onBlock", "damage"];
const sourceKeyOf = (move: Move): string | null => {
  const key = (move as Move & { ws5CanonicalSource?: string }).ws5CanonicalSource;
  if (key) return key;
  return move.id.startsWith("sf6dna-preview:") ? decodeURIComponent(move.id.split(":").slice(2).join(":")) : null;
};
/** Display name of a new official-row card: drops an empty "（）" left by the official source and collapses repeated spaces.
 * The row key, values and every other field stay as the official data has them. */
export const officialMoveDisplayName = (name: string) => name.replace(/[（(]\s*[）)]/g, "").replace(/\s{2,}/g, " ").trim();
/** Official rows whose input cell only says the move comes out on its own, e.g. "（疾駆けで相手に一定距離まで近付くと自動派生）". */
const AUTO_DERIVED = /^（(.+自動派生)）$/;
export const AUTO_DERIVED_COMMAND_TEXT = "自動派生（個別入力なし）";
type Command = NonNullable<Move["commands"]>[number];
/** No own input exists: the command cell says so and the official wording goes to the existing condition cell. */
function withAutoDerivedCommand(command: Command): Command {
  const match = typeof command.commandText === "string" ? AUTO_DERIVED.exec(command.commandText.trim()) : null;
  return match ? { ...command, commandText: AUTO_DERIVED_COMMAND_TEXT, conditionText: command.conditionText || match[1] } : command;
}
/** Kept out of the normal list (data untouched): an existing card whose official source key has no row in the latest table. */
export type HeldOldOfficialRow = { id: string; name: string; sourceKey: string; reason: string };
const hasText = (value: unknown) => typeof value === "number" || (typeof value === "string" && value.trim() !== "");

/**
 * Local review only. Ties every official row of the character to its card by the official source key:
 * - a card that exists gets only what it lacks (frame/damage values, Classic/Modern input); nothing is replaced
 * - an official row without a card becomes a new local card built from that row alone
 * Values keep candidate_only and grant no publication.
 */
export function withAll32OfficialMoveFill(bundle: DevicePreviewBundle, characterSlug: string, data: OfficialMoveFillData) {
  const records = data.byCharacter[characterSlug] ?? [];
  const byKey = new Map(records.filter(row => row.k).map(row => [row.k as string, row]));
  const present = new Set<string>();
  const officialKeys = new Set(records.flatMap(row => row.k ? [row.k] : []));
  const heldOldRows: HeldOldOfficialRow[] = [];
  const current = bundle.moves.filter(move => {
    const key = sourceKeyOf(move);
    if (!records.length || !key || officialKeys.has(key) || !/:(web|sha):/.test(key)) return true;
    heldOldRows.push({ id: move.id, name: move.name, sourceKey: key, reason: "最新の公式フレーム表（2026-11-24確認）に対応行なし" });
    return false;
  });
  const moves = current.map(move => {
    const added = (move as Move & { officialFrameKey?: string }).officialFrameKey;
    if (added) present.add(added);
    const key = sourceKeyOf(move);
    const row = key ? byKey.get(key) : undefined;
    if (key) present.add(key);
    if (!row) return move;
    const frame = { ...(move.frame ?? {}) } as NonNullable<Move["frame"]>;
    const frameFieldStatus = { ...move.frameFieldStatus };
    for (const field of FILL_FIELDS) {
      const value = row.v[field];
      const state = frameFieldStatus[field];
      if (!value || hasText((frame as Record<string, unknown>)[field]) || (state !== undefined && state !== "PENDING")) continue;
      if (value === "NA") { frameFieldStatus[field] = "OFFICIAL_NA"; continue; }
      (frame as Record<string, unknown>)[field] = value;
      frameFieldStatus[field] = LOCAL_OFFICIAL_FRAME_STATUS;
    }
    const commands = [...(move.commands ?? [])];
    for (const [scheme, sortOrder] of [["classic", 0], ["modern", 1]] as const) {
      const text = row.i[scheme];
      const shown = commands.some(command => command.moveId === move.id && command.scheme.toLowerCase().startsWith(scheme) &&
        [command.commandText, command.numericNotation, command.buttonNotation].some(hasText));
      if (text && !shown) commands.push({ moveId: move.id, scheme, commandText: text, numericNotation: null, buttonNotation: null, conditionText: null, sortOrder });
    }
    return { ...move, frame, frameFieldStatus, commands: commands.map(withAutoDerivedCommand) };
  });
  const appendedIds = new Set(bundle.moves.map(move => move.id));
  const appended = records.filter(row => (!row.k || !present.has(row.k)) && !appendedIds.has(`sf6dna-official-20261124:${characterSlug}:${row.h}`)).map((row, index): Move => {
    const id = `sf6dna-official-20261124:${characterSlug}:${row.h}`;
    const frame = { verificationStatus: "candidate_only" } as Record<string, unknown>;
    const frameFieldStatus: Record<string, string> = {};
    for (const field of FILL_FIELDS) {
      const value = row.v[field];
      if (value === "NA") frameFieldStatus[field] = "OFFICIAL_NA";
      else if (value) { frame[field] = value; frameFieldStatus[field] = LOCAL_OFFICIAL_FRAME_STATUS; }
      else frameFieldStatus[field] = "OFFICIAL_NOT_LISTED";
    }
    return { id, slug: `${characterSlug}-official-20261124-${index + 1}`, name: officialMoveDisplayName(row.n), moveType: row.t, usageSummary: null,
      releaseFixture: false, status: "draft", frame: frame as Move["frame"], frameFieldStatus: frameFieldStatus as Move["frameFieldStatus"],
      commands: (["classic", "modern"] as const).flatMap((scheme, sortOrder) => row.i[scheme]
        ? [withAutoDerivedCommand({ moveId: id, scheme, commandText: row.i[scheme] as string, numericNotation: null, buttonNotation: null, conditionText: null, sortOrder })] : []),
      // The values come from the 2026-11-24 frame table, not the TXT snapshot: the TXT key is kept apart.
      media: null, ...(row.k ? { officialFrameKey: row.k } : {}) } as Move;
  });
  const evidence: Record<string, OfficialMoveFillEvidence> = Object.fromEntries(appended.map(move => {
    const row = records.find(item => `sf6dna-official-20261124:${characterSlug}:${item.h}` === move.id)!;
    return [move.id, { patch: "Patch未確定（公式フレーム表 2026-11-24確認・版の記載なし）", verification: "公式フレーム表（2026-11-24確認）の値のみで作成したローカル候補。Patch未確定・公開承認待ち",
      sources: row.u ? [{ id: `official-frame-${characterSlug}`, title: "CAPCOM: フレームデータ（2026-11-24確認）", url: row.u,
        publisher: "CAPCOM", sourceType: "official", relationship: "reference" }] : [] }];
  }));
  return { bundle: { ...bundle, moves: [...moves, ...appended] }, evidence, appendedIds: appended.map(move => move.id), heldOldRows };
}
