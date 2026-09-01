export type MoveGlossaryEntry = {
  english: string;
  japanese: string;
};

const exactLabels: Record<string, string> = {
  draft: "下書き",
  reviewed: "内容確認済み",
  unverified: "未検証",
  verified: "検証済み",
  published: "公開済み",
  archived: "アーカイブ済み",
  any: "中央・画面端共通",
  midscreen: "画面中央",
  corner: "画面端",
  "near corner": "画面端付近",
};

const phraseLabels: Array<[string, string]> = [
  ["Written/image-only collection; current capture required.", "文章・画像から収集。現行版での撮影確認が必要です。"],
  ["blocked Drive Reversal", "ドライブリバーサルをガード"],
  ["Drive Reversal punish", "ドライブリバーサルへの確定反撃"],
  ["diagonal jump/air special", "斜めジャンプ／空中必殺技"],
  ["punish counter", "パニッシュカウンター"],
  ["poisoned opponent", "毒状態の相手"],
  ["opponent jump", "相手のジャンプ"],
  ["opponent stun", "相手がスタン"],
  ["wall splat", "壁やられ"],
  ["close hit", "近距離ヒット"],
  ["hard knockdown", "強制ダウン"],
  ["ground hit", "地上ヒット"],
  ["normal projectile branch", "通常弾ルート"],
  ["automatic route", "オートコンボルート"],
  ["poison burst", "毒破裂"],
  ["anti-air", "対空"],
  ["follow-up", "追撃"],
  ["side switch", "位置入れ替え"],
  ["knockdown", "ダウン"],
  ["burnout", "バーンアウト"],
  ["no poison", "毒なし"],
  ["projectile", "飛び道具"],
  ["launcher", "浮かせ"],
  ["delayed", "遅らせ"],
  ["lights", "小技"],
  ["light attacks", "小技"],
  ["stun", "スタン"],
  ["burst", "破裂"],
  ["poison", "毒"],
  ["dash", "前ステップ"],
  ["walk", "歩き"],
  ["route", "ルート"],
  ["option", "選択肢"],
];

const directionLabels: Record<string, string> = {
  "1": "後ろ斜め下",
  "2": "しゃがみ",
  "3": "前斜め下",
  "4": "後ろ",
  "5": "立ち",
  "6": "前",
  "7": "後ろジャンプ",
  "8": "垂直ジャンプ",
  "9": "前ジャンプ",
};

const strengthLabels: Record<string, string> = { L: "弱", M: "中", H: "強" };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function derivedGlossary(glossary: MoveGlossaryEntry[]) {
  const entries = new Map<string, string>();
  const suffixCandidates = new Map<string, Set<string>>();

  const add = (english: string | null | undefined, japanese: string | null | undefined) => {
    const from = english?.replace(/<br\s*\/?>(.*)$/i, "").trim();
    const to = japanese?.trim();
    if (!from || !to || from === to) return;
    entries.set(from, to);

    const strength = from.match(/^(.*) \((Light|Medium|Heavy|OD)\)$/i);
    if (strength) {
      const prefix = strength[2].toLowerCase() === "light" ? "L" : strength[2].toLowerCase() === "medium" ? "M" : strength[2].toLowerCase() === "heavy" ? "H" : "OD";
      const base = strength[1].trim();
      entries.set(`${prefix} ${base}`, to);
      const suffix = base.split(/\s+/).at(-1);
      if (suffix) {
        const key = `${prefix} ${suffix}`;
        const values = suffixCandidates.get(key) ?? new Set<string>();
        values.add(to);
        suffixCandidates.set(key, values);
      }
    } else {
      const suffix = from.split(/\s+/).at(-1);
      if (suffix && suffix.length >= 4) {
        const values = suffixCandidates.get(suffix) ?? new Set<string>();
        values.add(to);
        suffixCandidates.set(suffix, values);
      }
    }
  };

  for (const entry of glossary) add(entry.english, entry.japanese);
  for (const [key, values] of suffixCandidates) {
    if (values.size === 1) entries.set(key, [...values][0]);
  }

  return [...entries.entries()].sort((a, b) => b[0].length - a[0].length);
}

export function localizeComboText(value: string | number | null, glossary: MoveGlossaryEntry[] = []) {
  if (value === null) return null;
  if (typeof value === "number") return value;

  const exact = exactLabels[value.trim().toLowerCase()];
  if (exact) return exact;

  let result = value;
  for (const [english, japanese] of derivedGlossary(glossary)) {
    result = result.replace(new RegExp(escapeRegExp(english), "gi"), japanese);
  }
  for (const [english, japanese] of phraseLabels) {
    result = result.replace(new RegExp(escapeRegExp(english), "gi"), japanese);
  }

  result = result
    .replace(/\bj\.([LMH])([PK])\b/gi, (_, strength: string, button: string) => `ジャンプ${strengthLabels[strength.toUpperCase()]}${button.toUpperCase()}`)
    .replace(/\b([1-9])([LMH])([PK])\b/g, (_, direction: string, strength: string, button: string) => `${directionLabels[direction]}${strengthLabels[strength]}${button}`)
    .replace(/\b([1-9])([LMH])\b/g, (_, direction: string, strength: string) => `${directionLabels[direction]}${strengthLabels[strength]}攻撃`)
    .replace(/\bAssist ([LMH])\b/gi, (_, strength: string) => `アシスト${strengthLabels[strength.toUpperCase()]}`)
    .replace(/\bCDR\b/g, "キャンセルドライブラッシュ")
    .replace(/\bDR\b/g, "ドライブラッシュ")
    .replace(/\bDI\b/g, "ドライブインパクト")
    .replace(/\bPC\b/g, "パニッシュカウンター")
    .replace(/\bCH\b/g, "カウンターヒット")
    .replace(/\bModern\b/gi, "モダン")
    .replace(/\b([LMH]) (?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, (_, strength: string) => `${strengthLabels[strength]} `)
    .replace(/\s*>\s*/g, " → ")
    .replace(/\s*\/\s*/g, "／")
    .replace(/\s*x(\d+)-(\d+)/gi, "×$1～$2")
    .replace(/\s*x(\d+)/gi, "×$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  return result;
}

export function localizeDifficulty(value: string | number | null) {
  if (value === null || value === "") return null;
  return `レベル${value}`;
}

export function localizeSourceType(value: string) {
  return ({
    official_patch: "公式パッチノート",
    official_movelist: "公式技表",
    official_guide: "公式ガイド",
    community_guide: "攻略記事",
    note: "攻略記事",
    video: "動画",
    social_post: "SNS投稿",
  } as Record<string, string>)[value] ?? value;
}

export function localizeSourceRelationship(value: string) {
  return ({
    primary: "主要根拠",
    supporting: "補足根拠",
    verification: "検証根拠",
    patch_context: "パッチ情報",
  } as Record<string, string>)[value] ?? value;
}
