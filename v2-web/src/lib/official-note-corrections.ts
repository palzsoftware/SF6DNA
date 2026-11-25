/** Official sources disagree for these notes: the frame table (checked 2026-11-25) still says
 * "ヴィーハト・チェーニのみキャンセル可能", while the 2026.08.03 battle change list made the same four JP normals
 * cancelable into ヴィーハト・アクノ too. The newer, move-specific change list is adopted; the table wording is kept
 * visible as the table's (not updated) note. Not verified in-game. Source check: C, 2026-11-25. */
const JP_VIHAT_CANCEL_KEYS = new Set(["jp:web:102", "jp:web:105", "jp:web:107", "jp:web:109"]);
const STALE_NOTE = "ヴィーハト・チェーニのみキャンセル可能";
export const JP_VIHAT_CANCEL_NOTE = "ヴィーハト・チェーニ、ヴィーハト・アクノにキャンセル可能"
  + "（2026.08.03 公式バトル変更リストによる。公式フレーム表の備考「ヴィーハト・チェーニのみキャンセル可能」は未更新）";
export const JP_VIHAT_CANCEL_SOURCES = [
  "https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp",
  "https://www.streetfighter.com/6/ja-jp/character/jp/frame",
] as const;

/** Replace only the stale wording inside a note line; everything else in the line (e.g. 連打キャンセル対応) is kept. */
export function correctedOfficialNote(sourceKey: string | undefined, line: string): string {
  if (!sourceKey || !JP_VIHAT_CANCEL_KEYS.has(sourceKey) || !line.includes(STALE_NOTE)) return line;
  return line.replace(/※?ヴィーハト・チェーニのみキャンセル可能/, JP_VIHAT_CANCEL_NOTE);
}
