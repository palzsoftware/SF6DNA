/** Explicit QA intake; neither a publication approval nor a DB record. */
export function isLukeSampleRequest(slug: string, requested: string | string[] | undefined, environment: string | undefined) {
  return slug === "luke" && requested === "luke" && (environment === "preview" || environment === "development");
}

export const lukeMoveSample = {
  id: "aab86b9c-f501-4928-8818-114f5fc0574a",
  slug: "luke-nose-breaker",
  name: "ノーズブレイカー",
  category: "特殊技（ターゲットコンボ）",
  classic: "↓ + 中K ＞ ↓ + 強P",
  modern: null,
  frame: null,
  damage: null,
  media: {
    id: "luke-qa-nose-breaker",
    moveId: "aab86b9c-f501-4928-8818-114f5fc0574a",
    mediaType: "video" as const,
    mediaUrl: "/media/moves/luke/luke-nose-breaker.mp4",
    posterUrl: "/media/moves/luke/luke-nose-breaker.webp",
    sourceUrl: null,
    sourceLabel: null,
    status: "approved_for_preview",
    displayOrder: 0,
  },
} as const;

export const lukeComboSample = {
  id: "qa-sample:luke-crmk-rush-20261011",
  href: "/characters/luke?sample=luke#luke-sample-cards",
  name: "しゃがみ中K始動・ラッシュ（サンプル）",
  starter: "しゃがみ中K",
  purpose: "中央の伸ばし候補・実機確認待ち",
  category: "drive_rush",
  command: "しゃがみ中K → キャンセルラッシュ → しゃがみ中P → しゃがみ強P → ジャスト中フラ → ジャスト弱フラ",
  startCondition: "Classic・キャンセルラッシュ使用（成立条件は実機確認待ち）",
  endCondition: "実機確認待ち",
  damage: null,
  drive: null,
  sa: null,
  difficulty: null,
  verificationStatus: "review_required",
  preview: true,
  media: {
    type: "video" as const,
    url: "/media/qa/luke/combo-reference.mp4",
    posterUrl: "/media/qa/luke/combo-reference-poster.png",
    loop: true,
    caption: "UI確認用の参考映像です。レシピとの対応・コンボ成立・数値は実機確認待ちです。",
  },
};
