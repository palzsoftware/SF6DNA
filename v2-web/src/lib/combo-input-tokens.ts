/** Lossless notation parsing. Tokens describe explicit input only, never convert control schemes. */
export type ComboTokenType = "DIRECTION" | "BUTTON" | "SYSTEM_ACTION" | "SUPER" | "SPECIAL_COMMAND" | "CONDITION" | "TEXT" | "AMBIGUOUS";
export type ComboInputToken = { type: ComboTokenType; raw: string; value: string; label: string; display: string };
type Definition = { type: ComboTokenType; label: string; display: string };

const directions = {
  "1": ["左下", "↙"], "2": ["下", "↓"], "3": ["右下", "↘"], "4": ["左", "←"],
  "5": ["ニュートラル", "N"], "6": ["右", "→"], "7": ["左上", "↖"], "8": ["上", "↑"], "9": ["右上", "↗"],
  "↑": ["上", "↑"], "↗": ["右上", "↗"], "→": ["右", "→"], "↘": ["右下", "↘"],
  "↓": ["下", "↓"], "↙": ["左下", "↙"], "←": ["左", "←"], "↖": ["左上", "↖"], "N": ["ニュートラル", "N"],
  UP: ["上", "↑"], UP_FORWARD: ["前上", "↗"], FORWARD: ["前", "→"], DOWN_FORWARD: ["前下", "↘"],
  DOWN: ["下", "↓"], DOWN_BACK: ["後ろ下", "↙"], BACK: ["後ろ", "←"], UP_BACK: ["後ろ上", "↖"],
} as const;
const buttons = {
  LP: "弱パンチ", MP: "中パンチ", HP: "強パンチ", LK: "弱キック", MK: "中キック", HK: "強キック",
  L: "弱攻撃", M: "中攻撃", H: "強攻撃", SP: "必殺技ボタン", ASSIST: "アシストボタン",
} as const;
const systems = {
  DI_HIT: ["ドライブインパクト・ヒット", "DI ヒット"], DI_GUARD: ["ドライブインパクト・ガード", "DI ガード"],
  DI_WALL_SPLAT: ["ドライブインパクト・壁やられ", "DI 壁"], DI_STUN: ["ドライブインパクト・スタン", "DI スタン"],
  DRIVE_REVERSAL: ["ドライブリバーサル", "Dリバーサル"], DR: ["ドライブラッシュ", "DR"],
  CDR: ["キャンセルドライブラッシュ", "CDR"], THROW: ["投げ", "投げ"],
} as const;
const supers = { SA1: "スーパーアーツ1", SA2: "スーパーアーツ2", SA3: "スーパーアーツ3", CA: "クリティカルアーツ", OD: "オーバードライブ" } as const;
const commands = {
  "236": ["下・右下・右", "↓↘→"], "214": ["下・左下・左", "↓↙←"], "623": ["右・下・右下", "→↓↘"],
  "421": ["左・下・左下", "←↓↙"], "22": ["下・下", "↓↓"], "41236": ["左・左下・下・右下・右", "←↙↓↘→"],
  "63214": ["右・右下・下・左下・左", "→↘↓↙←"], "632146": ["右・右下・下・左下・左・右", "→↘↓↙←→"],
  "236236": ["下・右下・右を2回", "↓↘→ ×2"], "214214": ["下・左下・左を2回", "↓↙← ×2"],
  HALF_CIRCLE: ["半回転入力（方向は原文参照）", "半回転"], FULL_CIRCLE: ["1回転入力", "1回転"],
  DOUBLE_CIRCLE: ["2回転入力", "2回転"], CHARGE_BACK: ["後ろ溜め入力（時間は原文参照）", "後ろ溜め"],
  CHARGE_DOWN: ["下溜め入力（時間は原文参照）", "下溜め"], HIGH_JUMP: ["ハイジャンプ入力", "ハイジャンプ"],
  COMMAND_THROW: ["コマンド投げ（入力は原文参照）", "コマンド投げ"],
} as const;
const definitions: Record<string, Definition> = {};
for (const [value, [label, display]] of Object.entries(directions)) definitions[value] = { type: "DIRECTION", label, display };
for (const [value, label] of Object.entries(buttons)) definitions[value] = { type: "BUTTON", label, display: value };
for (const [value, [label, display]] of Object.entries(systems)) definitions[value] = { type: "SYSTEM_ACTION", label, display };
for (const [value, label] of Object.entries(supers)) definitions[value] = { type: "SUPER", label, display: value };
for (const [value, [label, display]] of Object.entries(commands)) definitions[value] = { type: "SPECIAL_COMMAND", label, display };

// Aliases are explicit state descriptions. A bare DI, DI(PC), DI(clean), or DI(wall) stays ambiguous.
const aliases: Record<string, string> = {
  "DI clean hit": "DI_HIT", "DI wall splat": "DI_WALL_SPLAT", "DI stun": "DI_STUN", "DI guard": "DI_GUARD",
};
const conditions: Record<string, string> = { "(PC)": "パニッシュカウンター", "(CH)": "カウンターヒット", "(Perfect)": "ジャスト入力" };
const wordKeys = Object.keys(definitions).filter(key => !/^[\d↑↗→↘↓↙←↖]+$/.test(key));
const escaped = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const words = [...Object.keys(aliases), ...wordKeys].sort((a, b) => b.length - a.length).map(escaped).join("|");
const scanner = new RegExp(`DI\\([^)]*\\)|\\([^)]*\\)|${words}|[0-9]+|[↑↗→↘↓↙←↖]|[A-Za-z_]+|[^A-Za-z_0-9↑↗→↘↓↙←↖(]+|.`, "gi");

export function tokenizeComboRecipe(raw: string): ComboInputToken[] {
  const tokens: ComboInputToken[] = [];
  for (const match of raw.matchAll(scanner)) {
    const part = match[0];
    const index = match.index ?? 0;
    const key = aliases[part.toLowerCase().replace(/^di/, "DI")] ?? part.toUpperCase();
    const definition = definitions[key];
    // Latin tokens embedded in prose are text, e.g. SP in "Spin". Compact 236LP is permitted.
    const numeric = /^\d+$/.test(part);
    const next = raw.slice(index + part.length);
    const compactButton = /^(?:LP|MP|HP|LK|MK|HK|L|M|H|SP)(?![A-Za-z_])/i.test(next);
    const embedded = /[A-Za-z_]/.test(raw[index - 1] ?? "") || (/[A-Za-z_]/.test(next[0] ?? "") && !(numeric && compactButton));
    const numericEmbedded = numeric && /\d/.test(raw[index - 1] ?? "");
    const currentStep = raw.slice(0, index).split(/[>→]/).at(-1)?.trim() ?? "";
    // A digit in a count or gauge sentence is not an input. Compact 5LP is explicit.
    const numericContext = !numeric || compactButton || (part.length > 1 && currentStep === "" && /^(?:\s*(?:>|$))/.test(next));
    // → is also a recipe separator. A bare direction or arrow-only sequence is unambiguous.
    const rightArrowContext = part !== "→" || /^[\s↑↗→↘↓↙←↖N]+$/.test(raw) || /[↑↗↘↓↙←↖]/.test(raw[index - 1] ?? "");
    if (definition && !embedded && !numericEmbedded && numericContext && rightArrowContext) {
      tokens.push({ ...definition, raw: part, value: key });
    } else if (conditions[part]) {
      tokens.push({ type: "CONDITION", raw: part, value: part, label: conditions[part], display: part });
    } else {
      const ambiguous = /^DI(?:\(|$)/i.test(part) || /^(P|K|PP|KK|or)$/i.test(part) || numeric;
      tokens.push({ type: ambiguous ? "AMBIGUOUS" : "TEXT", raw: part, value: part, label: part, display: part });
    }
  }
  return tokens;
}

/** Prior pilot IDs are retained as evidence fixtures only. All eligible cards share the renderer. */
export const comboIconPilotIds = {
  luke: ["da8dac9f-e65e-4c16-a8f4-637318d73a66", "54185bc2-8bde-4c82-be10-601f69454434", "11337af8-4a19-4688-ac22-826f05ebd11e", "f321891f-45e0-4e35-8e4c-388818b80675", "537e6839-69fd-443d-a87e-be12601311e6"],
  jp: ["f4b028b9-3137-459a-9339-003bde34c9ed", "ad31eb7f-5dc3-4a8a-a02c-887ae2cb869d", "d1126690-13fd-4c6f-a811-540e2acfb188", "797eda8e-1075-4547-830e-11d4037e1d8c", "31a791ff-97a2-4160-89b2-3dd78fcb9d68"],
  ken: ["07ae236f-0095-40df-9a59-c03f87c8c5a6", "be1f206d-1858-4bca-8223-2ff670f77bab", "7b0095e2-9e0e-467c-8f7a-5dca178d8568", "616fbae7-be2c-4d1d-a909-c4035cc9dd26", "adc25a73-7ed7-40e8-98f0-26f4b1492cd2"],
} as const;
const pilotIds = new Set<string>(Object.values(comboIconPilotIds).flat());
export function isComboIconPilot(id: string): boolean { return pilotIds.has(id); }
