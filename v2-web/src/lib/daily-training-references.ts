import type { DailyTrainingDetail } from "./daily-training-details";
import { getQualityGuide, QUALITY_GUIDES } from "./daily-training-quality";

export type PracticeReference = {
  kind: "article" | "video";
  title: string;
  author: string;
  url: string;
  relevance: string;
  reviewedAt: string;
  reviewScope: "article_text" | "article_embedding_and_metadata";
};
const reviewedAt = "2026-10-30";
const antiAir: PracticeReference = {
  kind: "article", title: "ジャンプ攻撃だけで負ける理由と対空攻撃の練習方法",
  author: "あかばね／スト6教習所", url: "https://note.com/st6noob/n/n0af96b881272",
  relevance: "対空の選び方と、相手の動きをレコードして再生する方法を確認できます。",
  reviewedAt, reviewScope: "article_text",
};
const recording: PracticeReference = {
  kind: "video", title: "対空練習用レコード設定例", author: "あかばねスト6教習所",
  url: "https://www.youtube.com/watch?v=XDkNYtSbKLA",
  relevance: "上の記事で紹介されている、相手役の動きを記録する設定例です。",
  reviewedAt, reviewScope: "article_embedding_and_metadata",
};
const guard: PracticeReference = {
  kind: "article", title: "攻撃強度・攻撃属性とガード編", author: "あかばね／スト6教習所",
  url: "https://note.com/st6noob/n/n99dc45986f78",
  relevance: "立ちガードとしゃがみガードを使い分ける基礎を確認できます。",
  reviewedAt, reviewScope: "article_text",
};
const observation: PracticeReference = {
  kind: "article", title: "初心者でもできる「対戦の極意」について", author: "あかばね／スト6教習所",
  url: "https://note.com/st6noob/n/n44f1bfa4fc6d",
  relevance: "相手の動きや癖を観察し、対応を選ぶ考え方を確認できます。",
  reviewedAt, reviewScope: "article_text",
};
const TOPICS = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュ 対策", impact_response: "インパクト返し",
  punish: "確定反撃", defense: "ガード 防御", offense: "起き攻め", meter: "ゲージ管理",
  matchup: "キャラ対策", execution: "基本コンボ", neutral: "立ち回り", corner_defense: "画面端 防御",
  decision: "判断", knowledge: "基礎知識", habit: "対戦 振り返り", review: "対戦 振り返り",
} as const;

/** Uses the existing exact-content guard. Never attach current guidance to a differing saved snapshot. */
export function getPracticeReferences(detail: DailyTrainingDetail) {
  const guide = getQualityGuide(detail);
  if (!guide) return null;
  const key = (Object.keys(QUALITY_GUIDES) as (keyof typeof QUALITY_GUIDES)[]).find(value => QUALITY_GUIDES[value] === guide);
  if (!key) return null;
  const references: readonly PracticeReference[] = key === "anti_air" ? [antiAir, recording]
    : key === "defense" || key === "corner_defense" ? [guard]
    : ["punish", "decision", "habit", "review", "neutral"].includes(key) ? [observation] : [];
  return {
    topic: TOPICS[key],
    reason: `この練習は「${TOPICS[key]}」を扱うため、その考え方や設定を確認する資料を案内しています。`,
    references,
    searchHref: "/videos?" + new URLSearchParams({ q: TOPICS[key] }).toString(),
  };
}
