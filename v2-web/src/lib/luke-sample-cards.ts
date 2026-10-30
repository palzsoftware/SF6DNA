import { lukeCanonicalCombo as combo } from "@/lib/luke-canonical-combo";

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

/** QA presentation of the existing reference; facts have one source of truth. */
export const lukeComboSample = {
  id: combo.combo_id,
  href: "/characters/luke?sample=luke#luke-sample-cards",
  name: combo.formal_card_name,
  starter: combo.starter,
  purpose: combo.purpose,
  category: "drive_rush",
  command: combo.raw_recipe,
  startCondition: combo.condition,
  endCondition: combo.end_state,
  damage: combo.damage,
  drive: combo.drive_cost,
  sa: combo.sa_cost,
  difficulty: combo.difficulty,
  patch: combo.patch,
  verificationStatus: "review_required",
  preview: true,
  media: {
    type: "video" as const,
    url: combo.media.clean.path,
    posterUrl: "/media/qa/luke/combo-clean-20261011-poster.jpg",
    loop: true,
    caption: "参考映像は同じ入力順の別録画です。数値・終了状態はEvidence映像の記録で、この参考映像へは転用していません。ジャスト成功の客観検証・現行バージョンでの成立は確認中です。",
  },
};
