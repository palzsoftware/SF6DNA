export type VideoIntent = {
  characters: Set<string>;
  players: Set<string>;
  categories: Set<string>;
  events: Set<string>;
  levels: Set<string>;
  modes: Set<string>;
  controls: Set<string>;
  languages: Set<string>;
  remainingTerms: string[];
  suggestions: string[];
};

type AliasKind = Exclude<keyof VideoIntent, "remainingTerms" | "suggestions">;
type Alias = { kind: AliasKind; id: string; aliases: string[] };

export const VIDEO_INTENT_ALIASES: Alias[] = [
  { kind: "characters", id: "jp", aliases: ["jp", "ジェイピー", "じぇいぴー"] },
  { kind: "characters", id: "ryu", aliases: ["ryu", "リュウ", "りゅう"] },
  { kind: "events", id: "capcom_cup", aliases: ["capcom cup", "カプコンカップ", "cc"] },
  { kind: "events", id: "sfl", aliases: ["sfl"] },
  { kind: "events", id: "evo", aliases: ["evo"] },
  { kind: "events", id: "world_warrior", aliases: ["world warrior", "ワールドウォリアー"] },
  { kind: "categories", id: "torikore", aliases: ["とりこれ", "トリコレ"] },
  { kind: "categories", id: "combo", aliases: ["コンボ", "combo"] },
  { kind: "categories", id: "setplay", aliases: ["セットプレイ", "setplay"] },
  { kind: "categories", id: "oki", aliases: ["起き攻め", "oki"] },
  { kind: "categories", id: "pressure", aliases: ["連携", "pressure"] },
  { kind: "categories", id: "neutral", aliases: ["立ち回り", "neutral"] },
  { kind: "categories", id: "counter", aliases: ["対策", "counter"] },
  { kind: "categories", id: "sa2", aliases: ["sa2"] },
  { kind: "categories", id: "lethal", aliases: ["リーサル", "lethal"] },
  { kind: "categories", id: "max_damage_combo", aliases: ["最大コンボ", "max damage"] },
  { kind: "categories", id: "corner", aliases: ["画面端", "corner"] },
  { kind: "categories", id: "defense", aliases: ["防御", "defense"] },
  { kind: "categories", id: "anti_air", aliases: ["対空", "anti air"] },
  { kind: "categories", id: "projectile", aliases: ["弾", "projectile"] },
  { kind: "categories", id: "line_management", aliases: ["ライン管理"] },
  { kind: "categories", id: "hadoken", aliases: ["波動拳", "hadoken"] },
  { kind: "categories", id: "shoryuken", aliases: ["昇龍拳", "shoryuken"] },
  { kind: "categories", id: "crouching_mk", aliases: ["中足"] },
  { kind: "categories", id: "drive_rush", aliases: ["drive rush", "ドライブラッシュ"] },
  { kind: "players", id: "sho", aliases: ["翔", "sho"] },
  { kind: "players", id: "tokido", aliases: ["ときど", "tokido"] },
  { kind: "players", id: "ryusei", aliases: ["りゅうせい", "ryusei"] },
  { kind: "players", id: "kisaragi_ren", aliases: ["如月れん"] },
  { kind: "levels", id: "beginner", aliases: ["初心者", "beginner"] },
  { kind: "levels", id: "intermediate", aliases: ["中級者", "intermediate"] },
  { kind: "levels", id: "advanced", aliases: ["上級者", "advanced"] },
  { kind: "modes", id: "match", aliases: ["試合", "match", "対戦"] },
  { kind: "modes", id: "guide", aliases: ["解説", "guide"] },
  { kind: "controls", id: "classic", aliases: ["classic", "クラシック"] },
  { kind: "controls", id: "modern", aliases: ["modern", "モダン"] },
  { kind: "languages", id: "ja", aliases: ["日本語", "japanese"] },
  { kind: "languages", id: "en", aliases: ["英語", "english"] },
];

export function normalizeIntentText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ja").replace(/[・_]+/g, " ").replace(/\s+/g, " ").trim();
}

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

export function parseVideoIntent(input: string): VideoIntent {
  const result: VideoIntent = {
    characters: new Set(), players: new Set(), categories: new Set(), events: new Set(),
    levels: new Set(), modes: new Set(), controls: new Set(), languages: new Set(),
    remainingTerms: [], suggestions: [],
  };
  let rest = ` ${normalizeIntentText(input)} `;
  const aliases = VIDEO_INTENT_ALIASES.flatMap((entry) => entry.aliases.map((alias) => ({ ...entry, alias: normalizeIntentText(alias) })))
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const entry of aliases) {
    const pattern = new RegExp(`(^|\\s)${entry.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$)`, "gu");
    if (pattern.test(rest.trim())) {
      result[entry.kind].add(entry.id);
      rest = ` ${rest.trim().replace(pattern, " ").replace(/\s+/g, " ").trim()} `;
    }
  }
  result.remainingTerms = rest.trim().split(" ").filter(Boolean);
  for (const term of result.remainingTerms.filter((value) => value.length >= 3)) {
    const suggestion = aliases.find((entry) => entry.alias.length >= 3 && editDistance(term, entry.alias) === 1);
    if (suggestion && !result.suggestions.includes(suggestion.alias)) result.suggestions.push(suggestion.alias);
  }
  return result;
}
