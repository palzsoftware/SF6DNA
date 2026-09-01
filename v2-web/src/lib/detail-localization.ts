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
  "year3。": "Year 3資料。",
  "legacy candidate": "旧バージョン候補",
  "modern only": "モダン専用",
  "modern only.": "モダン専用。",
  "current written": "現行版の文章資料",
  "punish counter required.": "パニッシュカウンター必須。",
  "legacy route": "旧バージョンルート",
  "year4 current": "Year 4現行版",
  "drive rush, perfect knuckle execution": "ドライブラッシュとジャストナックルの入力精度が必要",
  "legacy candidate; drive6 + sa3.": "旧バージョン候補。Dゲージ6本＋SA3。",
  "spacing dependent.": "距離依存。",
  "2026 post-patch claim": "2026年の調整後資料に記載",
  "2026.08.03 current guide recipe": "2026.08.03現行攻略記事のレシピ",
  "classic only": "クラシック専用",
  "consumes wind + sa1.": "風ストック＋SA1を消費。",
  "corner only.": "画面端限定。",
  "corner wall splat": "画面端の壁やられ",
  "written/image-confirmed route; no video playback. current-device capture required.": "文章・画像で確認したルートです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed claim; no video playback. current capture required.": "文章・画像で確認した情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-only collection. no video playback; capture required for current-device confirmation.": "文章・画像から収集しました。動画再生は未実施で、現行版の実機確認用撮影が必要です。",
  "written/image-only collection. no video playback; current-device capture required.": "文章・画像から収集しました。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed; no video playback. current-device capture required.": "文章・画像で確認済みです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed; no video playback. current capture required.": "文章・画像で確認済みです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-only collection; current-device capture required.": "文章・画像から収集しました。現行版の実機撮影が必要です。",
  "written/image source only; no video playback. current-device capture required.": "文章・画像の情報源のみで確認しました。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written route collected without video playback; verify on 2026.08.03 build.": "動画を再生せず文章から収集したルートです。2026.08.03版で確認してください。",
  "written/image claim from before 2026-08-03; no video playback. current-device capture required.": "2026.08.03より前の文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "modern written/image-only claim. no video playback; current-device capture required.": "モダン操作の文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written recipe; no video inference. current-patch capture required.": "文章に記載されたレシピです。動画からの推測は行っておらず、現行版の実機撮影が必要です。",
  "written route; no video inference. device capture required.": "文章に記載されたルートです。動画からの推測は行っておらず、実機撮影が必要です。",
  "year4 modern written route; current device capture required.": "Year 4のモダン操作向け文章資料に記載されたルートです。現行版の実機撮影が必要です。",
  "older written route; year4 device verification pending.": "旧資料に記載されたルートです。Year 4での実機確認待ちです。",
  "2026-08-03 year4 ken guide value; reviewed, not in-game verified in this environment.": "2026.08.03のYear 4ケン攻略記事記載値です。内容確認済みですが、この環境では実機未検証です。",
  "current 2026-08-05 guide candidate; exact damage remains null unless reproduced.": "2026.08.05の現行攻略記事候補です。再現確認が取れるまで正確なダメージは未入力とします。",
  "damage and notation are explicitly paired in the linked combo guide. compatibility reviewed against 2026.08.03 jp change context; in-game reproduction still pending.": "リンク先のコンボ攻略記事でダメージと入力が明確に対応しています。2026.08.03のJP変更内容とは照合済みですが、実機での再現確認待ちです。",
  "text/image-only claim. no video playback. record medal level and do not store a fixed damage value until reproduction.": "文章・画像資料に基づく情報です。動画再生は未実施です。メダルレベルを記録し、再現確認までは固定ダメージを入力しません。",
  "2026-08 current guide candidate": "2026年8月の現行攻略記事候補です。",
  "written route only; no video playback. verify on 2026.08.03 build.": "文章に記載されたルートのみです。動画再生は未実施で、2026.08.03版で確認してください。",
  "written/image-only claim. no video playback; current-device capture required.": "文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
};

const phraseLabels: Array<[string, string]> = [
  ["Written/image-only collection; current capture required.", "文章・画像から収集。現行版での撮影確認が必要です。"],
  ["PCラッシュ", "パニッシュカウンター・ラッシュ"],
  ["M DI", "モダン ドライブインパクト"],
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
  ["exact timing/notation requires training verification", "正確なタイミング／入力はトレーニングモードでの確認が必要"],
  ["current-patch in-game verification pending", "現行版での実機確認待ち"],
  ["not in-game verified in this environment", "この環境では実機未検証"],
  ["do not infer from similar routes", "類似ルートから推測しないでください"],
  ["do not infer", "推測しないでください"],
  ["Guide recipe candidate", "攻略記事のレシピ候補"],
  ["Article candidate", "攻略記事候補"],
  ["current guide candidate", "現行攻略記事候補"],
  ["Drive Rush", "ドライブラッシュ"],
  ["current-patch damage", "現行版のダメージ"],
  ["exact damage", "正確なダメージ"],
  ["Damage", "ダメージ"],
  ["Drive", "Dゲージ"],
  ["Source", "出典"],
  ["NULL", "未入力"],
  ["air-to-air", "空対空"],
  ["counter hit", "カウンターヒット"],
  ["counter", "カウンターヒット"],
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
  ["light", "弱攻撃"],
  ["stun", "スタン"],
  ["burst", "破裂"],
  ["poison", "毒"],
  ["dash", "前ステップ"],
  ["walk", "歩き"],
  ["route", "ルート"],
  ["option", "選択肢"],
  ["corner", "画面端"],
  ["current", "現行版"],
  ["only", "専用"],
  ["required", "必須"],
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
    .replace(/^M(?=[^\sA-Za-z])/, "モダン")
    .replace(/\b([LMH])\b/g, (_, strength: string) => strengthLabels[strength])
    .replace(/\b([LMH]) (?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, (_, strength: string) => `${strengthLabels[strength]} `)
    .replace(/\s*>\s*/g, " → ")
    .replace(/\s*\/\s*/g, "／")
    .replace(/\s*x(\d+)-(\d+)/gi, "×$1～$2")
    .replace(/\s*x(\d+)/gi, "×$1")
    .replace(/\(/g, "（")
    .replace(/\)/g, "）")
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
