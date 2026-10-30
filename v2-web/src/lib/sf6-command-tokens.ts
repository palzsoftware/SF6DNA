export type Sf6CommandTokenKind = "direction" | "motion" | "button" | "system" | "super" | "separator" | "text" | "pending";
export type Sf6CommandToken = { kind: Sf6CommandTokenKind; raw: string; display: string; label: string };

type Def = { kind: Exclude<Sf6CommandTokenKind, "separator" | "text" | "pending">; display: string; label: string };

const defs: Record<string, Def> = {
  "1": { kind: "direction", display: "↙", label: "左下" },
  "2": { kind: "direction", display: "↓", label: "下" },
  "3": { kind: "direction", display: "↘", label: "右下" },
  "4": { kind: "direction", display: "←", label: "左" },
  "5": { kind: "direction", display: "N", label: "ニュートラル" },
  "6": { kind: "direction", display: "→", label: "右" },
  "7": { kind: "direction", display: "↖", label: "左上" },
  "8": { kind: "direction", display: "↑", label: "上" },
  "9": { kind: "direction", display: "↗", label: "右上" },
  N: { kind: "direction", display: "N", label: "ニュートラル" },
  "↑": { kind: "direction", display: "↑", label: "上" },
  "↗": { kind: "direction", display: "↗", label: "右上" },
  "→": { kind: "direction", display: "→", label: "右" },
  "↘": { kind: "direction", display: "↘", label: "右下" },
  "↓": { kind: "direction", display: "↓", label: "下" },
  "↙": { kind: "direction", display: "↙", label: "左下" },
  "←": { kind: "direction", display: "←", label: "左" },
  "↖": { kind: "direction", display: "↖", label: "左上" },
  "236": { kind: "motion", display: "↓↘→", label: "波動拳入力" },
  "214": { kind: "motion", display: "↓↙←", label: "逆波動拳入力" },
  "623": { kind: "motion", display: "→↓↘", label: "昇龍拳入力" },
  "421": { kind: "motion", display: "←↓↙", label: "逆昇龍拳入力" },
  "22": { kind: "motion", display: "↓↓", label: "下を2回" },
  "41236": { kind: "motion", display: "←↙↓↘→", label: "前半回転入力" },
  "63214": { kind: "motion", display: "→↘↓↙←", label: "後ろ半回転入力" },
  "632146": { kind: "motion", display: "→↘↓↙←→", label: "一周入力" },
  "236236": { kind: "motion", display: "↓↘→↓↘→", label: "波動拳入力を2回" },
  "214214": { kind: "motion", display: "↓↙←↓↙←", label: "逆波動拳入力を2回" },
  "66": { kind: "motion", display: "→→", label: "前を2回" },
  "44": { kind: "motion", display: "←←", label: "後ろを2回" },
  "28": { kind: "motion", display: "↓↑", label: "下から上" },
  "360": { kind: "motion", display: "1回転", label: "1回転入力" },
  "720": { kind: "motion", display: "2回転", label: "2回転入力" },
  "[4]": { kind: "motion", display: "←溜め", label: "後ろ方向を溜める" },
  "[4]6": { kind: "motion", display: "←溜め→", label: "後ろ溜めから前" },
  "[4]646": { kind: "motion", display: "←溜め→←→", label: "後ろ溜め、右、左、右" },
  "[2]8": { kind: "motion", display: "↓溜め↑", label: "下溜めから上" },
  "4236236": { kind: "motion", display: "←↓↘→↓↘→", label: "左、下、右下、右、下、右下、右" },
  LP: { kind: "button", display: "弱P", label: "弱パンチ" },
  MP: { kind: "button", display: "中P", label: "中パンチ" },
  HP: { kind: "button", display: "強P", label: "強パンチ" },
  LK: { kind: "button", display: "弱K", label: "弱キック" },
  MK: { kind: "button", display: "中K", label: "中キック" },
  HK: { kind: "button", display: "強K", label: "強キック" },
  "弱P": { kind: "button", display: "弱P", label: "弱パンチ" },
  "中P": { kind: "button", display: "中P", label: "中パンチ" },
  "強P": { kind: "button", display: "強P", label: "強パンチ" },
  "弱K": { kind: "button", display: "弱K", label: "弱キック" },
  "中K": { kind: "button", display: "中K", label: "中キック" },
  "強K": { kind: "button", display: "強K", label: "強キック" },
  P: { kind: "button", display: "P", label: "パンチ（強度未特定）" },
  K: { kind: "button", display: "K", label: "キック（強度未特定）" },
  PP: { kind: "button", display: "P×2", label: "パンチ2ボタン（強度未特定）" },
  KK: { kind: "button", display: "K×2", label: "キック2ボタン（強度未特定）" },
  LPLK: { kind: "system", display: "Throw", label: "投げ" },
  LM: { kind: "system", display: "Throw", label: "投げ" },
  "投げ": { kind: "system", display: "Throw", label: "投げ" },
  AL: { kind: "button", display: "Assist+弱", label: "アシストと弱攻撃" },
  AM: { kind: "button", display: "Assist+中", label: "アシストと中攻撃" },
  AH: { kind: "button", display: "Assist+強", label: "アシストと強攻撃" },
  SPH: { kind: "button", display: "SP+強", label: "必殺技ボタンと強攻撃" },
  L: { kind: "button", display: "弱", label: "弱攻撃" },
  M: { kind: "button", display: "中", label: "中攻撃" },
  H: { kind: "button", display: "強", label: "強攻撃" },
  "弱": { kind: "button", display: "弱", label: "弱攻撃" },
  "中": { kind: "button", display: "中", label: "中攻撃" },
  "強": { kind: "button", display: "強", label: "強攻撃" },
  "弱攻撃": { kind: "button", display: "弱", label: "弱攻撃" },
  "中攻撃": { kind: "button", display: "中", label: "中攻撃" },
  "強攻撃": { kind: "button", display: "強", label: "強攻撃" },
  A: { kind: "system", display: "Assist", label: "アシストボタン" },
  "アシスト": { kind: "system", display: "Assist", label: "アシストボタン" },
  SP: { kind: "system", display: "SP", label: "必殺技ボタン" },
  "必殺技": { kind: "system", display: "SP", label: "必殺技ボタン" },
  ASSIST: { kind: "system", display: "Assist", label: "アシストボタン" },
  DI: { kind: "system", display: "DI", label: "ドライブインパクト" },
  DR: { kind: "system", display: "DR", label: "ドライブラッシュ" },
  CDR: { kind: "system", display: "CDR", label: "キャンセルドライブラッシュ" },
  PARRY: { kind: "system", display: "Parry", label: "ドライブパリィ" },
  DRIVE_PARRY: { kind: "system", display: "Parry", label: "ドライブパリィ" },
  THROW: { kind: "system", display: "Throw", label: "投げ" },
  DRIVE_REVERSAL: { kind: "system", display: "Dリバーサル", label: "ドライブリバーサル" },
  SA: { kind: "super", display: "SA", label: "スーパーアーツ（レベル未特定）" },
  SA1: { kind: "super", display: "SA1", label: "スーパーアーツ1" },
  SA2: { kind: "super", display: "SA2", label: "スーパーアーツ2" },
  SA3: { kind: "super", display: "SA3", label: "スーパーアーツ3" },
  CA: { kind: "super", display: "CA", label: "クリティカルアーツ" },
  OD: { kind: "super", display: "OD", label: "オーバードライブ" },
};

const specialKeys = Object.keys(defs)
  .filter(key => !/^[1-9]$/.test(key) && !/^[↑↗→↘↓↙←↖]$/.test(key))
  .sort((a, b) => b.length - a.length);
const escaped = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const specialPattern = specialKeys.map(key => /^[A-Za-z_]+$/.test(key) ? escaped(key) + "(?![A-Za-z_])" : escaped(key)).join("|");
const scanner = new RegExp(`(?:${specialPattern})|[↑↗→↘↓↙←↖]|\\d+|[+＋＞>~]|\\s+|[^\\s+＋＞>~↑↗→↘↓↙←↖0-9A-Za-z_]+|[A-Za-z_]+`, "giu");
const latinWord = /[A-Za-z_]/;
const compactButton = /^(?:LP|MP|HP|LK|MK|HK|PP|KK|P|K|L|M|H|A|AL|AM|AH|SP|SPH)(?![A-Za-z0-9_])/i;

function isEmbeddedLatin(raw: string, index: number, part: string) {
  const before = raw[index - 1] ?? "";
  const after = raw[index + part.length] ?? "";
  return /[A-Za-z_]/.test(part) && (latinWord.test(before) || latinWord.test(after));
}

function shouldTreatSingleDirectionAsInput(raw: string, index: number, part: string) {
  const before = raw[index - 1] ?? "";
  const after = raw.slice(index + part.length).trimStart();
  if (/\d/.test(before)) return false;
  if (compactButton.test(after)) return true;
  if (!after) return true;
  return /^[+＋＞>~↑↗→↘↓↙←↖]/.test(after);
}

const compactButtonKeys = ["DRIVE_PARRY", "ASSIST", "SPH", "LPLK", "LP", "MP", "HP", "LK", "MK", "HK", "PP", "KK", "AL", "AM", "AH", "DI", "DR", "OD", "P", "K", "L", "M", "H", "A", "SP"];
function splitCompactCommand(raw: string): string[] | null {
  const upper = raw.toUpperCase();
  const memo = new Map<number, string[] | null>();
  const visit = (index: number): string[] | null => {
    if (index === upper.length) return [];
    if (memo.has(index)) return memo.get(index)!;
    for (const key of compactButtonKeys) {
      if (!upper.startsWith(key, index)) continue;
      const tail = visit(index + key.length);
      if (tail) { const result = [key, ...tail]; memo.set(index, result); return result; }
    }
    memo.set(index, null);
    return null;
  };
  return visit(0);
}

function shouldTreatUnknownNumberAsPending(value: string, index: number, part: string) {
  if (value.trim() === part) return true;
  const after = value.slice(index + part.length);
  if (part.includes("0") || after.startsWith("%") || /^\s+[A-Za-z]/.test(after)) return false;
  return true;
}

export function tokenizeSf6Command(value: string): Sf6CommandToken[] {
  if (!value) return [];
  const tokens: Sf6CommandToken[] = [];
  for (const match of value.matchAll(scanner)) {
    const raw = match[0];
    const index = match.index ?? 0;
    // Split compact official inputs only when the entire Latin run is recognized.
    // This handles ODLPMPHPLKMKHK without turning ordinary text into buttons.
    const compact = /^[A-Za-z_]+$/.test(raw) ? splitCompactCommand(raw) : null;
    if (compact && compact.length > 1) {
      for (const part of compact) {
        const definition = defs[part];
        if (definition) tokens.push({ ...definition, raw: part });
      }
      continue;
    }
    const key = raw.toUpperCase();
    const definition = defs[key] ?? defs[raw];
    if (definition && !isEmbeddedLatin(value, index, raw)) {
      if (/^[1-9]$/.test(raw) && !shouldTreatSingleDirectionAsInput(value, index, raw)) {
        tokens.push({ kind: "text", raw, display: raw, label: raw });
      } else {
        tokens.push({ ...definition, raw });
      }
      continue;
    }
    if (/^\d+$/.test(raw)) {
      tokens.push(shouldTreatUnknownNumberAsPending(value, index, raw)
        ? { kind: "pending", raw, display: "入力確認中", label: "未対応の数値入力表記" }
        : { kind: "text", raw, display: raw, label: raw });
      continue;
    }
    if (/^[+＋＞>~]$/.test(raw)) {
      tokens.push({ kind: "separator", raw, display: raw === ">" ? "＞" : raw === "＋" ? "+" : raw, label: "入力の区切り" });
      continue;
    }
    tokens.push({ kind: "text", raw, display: raw, label: raw });
  }
  return tokens.reduce<Sf6CommandToken[]>((merged, token) => {
    const previous = merged.at(-1);
    if (previous?.kind === "text" && token.kind === "text") {
      previous.raw += token.raw;
      previous.display += token.display;
      previous.label += token.label;
    } else {
      merged.push({ ...token });
    }
    return merged;
  }, []);
}

export function sf6CommandSearchTerms(value: string): string[] {
  const readable = tokenizeSf6Command(value).map(token => token.display).join("").replace(/\s+/g, " ").trim();
  return [...new Set([value, readable].filter(Boolean))];
}
