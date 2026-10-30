import type { DevicePreviewBundle, DevicePreviewMoveCommand } from "./device-preview";
import type { CharacterDetail, SourceReference } from "../types/character";
import type { PlayerDetail } from "../types/player";
import { selectMoveMotionMedia } from "./move-media-presentation";
import { safeExternalUrl } from "./safe-external-url";

export type UnifiedMove = DevicePreviewBundle["moves"][number];
export type UnifiedMoveEvidence = {
  patch: string | null;
  verification: string;
  sources: SourceReference[];
};
export const UNIFIED_STRATEGY_PUBLICATION = "CLOSED_UNTIL_OWNER_APPROVAL" as const;
export const UNIFIED_MEDIA_PLACEHOLDER = "動作映像は準備中";

/** Display only. Missing input does not mean the move is unavailable. */
export function unifiedCommandRows(move: UnifiedMove, scheme: "classic" | "modern") {
  return (move.commands ?? []).filter(command => {
    const actual = command.scheme.trim().toLowerCase().replaceAll("-", "_");
    return command.moveId === move.id && (actual === scheme || actual.startsWith(`${scheme}_`));
  });
}
export function unifiedCommandText(command: DevicePreviewMoveCommand) {
  return [command.commandText, command.numericNotation, command.buttonNotation]
    .find(value => typeof value === "string" && value.trim()) ?? "";
}
/** Absence of a DB command is UNKNOWN, never proof a move is unavailable. */
export function unifiedControlInputFallback(scheme: "classic" | "modern", move?: UnifiedMove) {
  if (scheme === "modern" && move && (move as UnifiedMove & { ws5ModernInputState?: string }).ws5ModernInputState === "OFFICIAL_NOT_LISTED") return "技入力なし（公式原文にModern入力記載なし）";
  return scheme === "modern" ? "データ確認中" : "入力確認中";
}

/** Keep a Move Card visible under both control filters when one input is unrecorded.
 *  The `unknown` tag means coverage is incomplete, NOT Modern availability.
 *  Matches the existing CharacterMoveExplorer unknown/shared visibility rule.
 */
export function unifiedMoveFilterSchemes(move: UnifiedMove): string[] {
  const commands = (move.commands ?? []).filter(row =>
    row.moveId === move.id && Boolean(unifiedCommandText(row).trim()));
  const schemes = commands.map(row => row.scheme);
  const normalized = schemes.map(value => value.trim().toLowerCase().replaceAll("-", "_"));
  const hasClassic = normalized.some(value => value === "classic" || value.startsWith("classic_"));
  const hasModern = normalized.some(value => value === "modern" || value.startsWith("modern_"));
  const modernKnownNotListed = (move as UnifiedMove & { ws5ModernInputState?: string }).ws5ModernInputState === "OFFICIAL_NOT_LISTED";
  return [...new Set([...schemes, ...(!hasClassic || (!hasModern && !modernKnownNotListed) ? ["unknown"] : [])])];
}

export function unifiedOtherCommandRows(move: UnifiedMove) {
  const classified = new Set([...unifiedCommandRows(move, "classic"), ...unifiedCommandRows(move, "modern")]);
  return (move.commands ?? []).filter(row => row.moveId === move.id && !classified.has(row));
}
/** A condition from one control never becomes a shared condition for both. */
export function unifiedConditionRows(move: UnifiedMove) {
  return (["classic", "modern"] as const).map(scheme => ({
    scheme,
    values: [...new Set(unifiedCommandRows(move, scheme).flatMap(row =>
      row.conditionText?.trim() ? [row.conditionText] : []))],
  }));
}
export function unifiedInputPathLabel(scheme: string) {
  const normalized = scheme.toLowerCase().replaceAll("-", "_");
  if (normalized.endsWith("_manual")) return "マニュアル";
  if (normalized.endsWith("_simple")) return "シンプル";
  if (normalized.endsWith("_assist")) return "アシスト";
  return null;
}
export function unifiedFrameValue(move: UnifiedMove, field: "startup" | "active" | "recovery" | "onHit" | "onBlock" | "damage", showLocalTxtCandidate = false) {
  const state = move.frameFieldStatus?.[field];
  if (state === "OFFICIAL_NA") return "—";
  if (state === "OFFICIAL_NOT_LISTED") return "公式資料に記載なし";
  if ((state === "LOCAL_OFFICIAL_TXT_MATCHED" || state === "LOCAL_OFFICIAL_TXT_CANONICAL") && showLocalTxtCandidate) {
    const candidate = move.frame?.[field];
    return typeof candidate === "number" ? String(candidate) : typeof candidate === "string" && candidate.trim() ? (field === "onHit" && candidate.trim() === "D" ? "ダウン" : candidate) : "確認中";
  }
  if (state && state !== "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED") return "確認中";
  const value = move.frame?.[field];
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "確認中";
  return typeof value === "string" && value.trim() ? (field === "onHit" && value.trim() === "D" ? "ダウン" : value) : "確認中";
}
export function unifiedMoveMedia(move: UnifiedMove) {
  const selected = selectMoveMotionMedia(move);
  const media = selected.media;
  // A relation/slot without a source URL is not presentable Media.
  // Keep the selected record and URL unchanged; this does not verify remote availability.
  return media?.moveId === move.id && typeof media.mediaUrl === "string" && media.mediaUrl.trim()
    ? media : null;
}
export function unifiedPlayers(character: Pick<CharacterDetail, "id" | "slug">, players: PlayerDetail[]) {
  if (character.slug === "ingrid") return [];
  const seen = new Set<string>();
  return players.filter(player =>
    !(character.slug === "jp" && player.slug === "ryusei") &&
    player.characters.some(relation =>
      relation.characterId === character.id && relation.characterSlug === character.slug) &&
    !seen.has(player.id) && Boolean(seen.add(player.id)));
}
export function unifiedSources(sources: SourceReference[]) {
  const seen = new Set<string>();
  return sources.filter(source => source.relationship !== "candidate" && safeExternalUrl(source.url) &&
    !seen.has(source.id) && Boolean(seen.add(source.id)));
}
export function unifiedPageCounts(character: CharacterDetail, bundle: DevicePreviewBundle | null, players: PlayerDetail[], videoIds: string[]) {
  const moves = bundle?.moves ?? [];
  return {
    moves: moves.length,
    classic: moves.filter(move => unifiedCommandRows(move, "classic").some(row => unifiedCommandText(row))).length,
    modern: moves.filter(move => unifiedCommandRows(move, "modern").some(row => unifiedCommandText(row))).length,
    media: moves.filter(move => unifiedMoveMedia(move)).length,
    mediaPending: moves.filter(move => !unifiedMoveMedia(move)).length,
    players: unifiedPlayers(character, players).length,
    videos: new Set(videoIds).size,
  };
}

/** Display guidance only: raw command data, identities and explicit OD exceptions are untouched. */
export function unifiedCommandDisplay(move: UnifiedMove, command: DevicePreviewMoveCommand): { value: string; hint: string | null } {
  const raw = unifiedCommandText(command).replace(/^（[^）]*）\s*/, "");
  const classic = /^classic(?:_|$)/i.test(command.scheme.replaceAll("-", "_"));
  const modern = /^modern(?:_|$)/i.test(command.scheme.replaceAll("-", "_"));
  if (modern && raw.trim() === "DI") return { value: raw, hint: "ドライブインパクトボタン" };
  if (!classic || !/^(?:\[[^\]]*\])?\s*OD/.test(move.name)) return { value: raw, hint: null };
  const source = (move as UnifiedMove & { ws5DisplayCategorySource?: string }).ws5DisplayCategorySource;
  // Terry's specified punch pairs must never become an arbitrary two-button choice.
  if (source === "terry:web:308" || /バーンナックル/.test(move.name)) return { value: raw, hint: "指定されたパンチ2ボタンの組み合わせ" };
  if (/PPP\s*$/.test(raw)) return { value: raw.replace(/PPP\s*$/, "LP + MP + HP"), hint: "パンチ3ボタン同時押し" };
  if (/LPMPHP\s*$/.test(raw)) return { value: raw.replace(/LPMPHP\s*$/, "LP | MP | HP"), hint: "弱P・中P・強Pのいずれか2つ同時押し" };
  if (/LKMKHK\s*$/.test(raw)) return { value: raw.replace(/LKMKHK\s*$/, "LK | MK | HK"), hint: "弱K・中K・強Kのいずれか2つ同時押し" };
  if (/LPMP\s*$/.test(raw)) return { value: raw.replace(/LPMP\s*$/, "LP + MP"), hint: "弱P＋中Pを同時押し" };
  return { value: raw, hint: null };
}
