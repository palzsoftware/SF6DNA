export type AutoVideoCategory = "all" | "guide" | "match";

// Title hints only: a video can match both categories; unknown titles stay in All.
export function matchesAutoVideoCategory(title: string, category: AutoVideoCategory): boolean {
  if (category === "all") return true;
  const normalized = title.normalize("NFKC");
  if (category === "guide") return /解説|攻略|講座|講解|コンボ|対策|初心者|使い方|練習|立ち回り|起き攻め|指南|\b(?:guide|tutorial|tips|combo|combos|how to)\b/i.test(normalized);
  if (category === "match") return /対戦|ランクマ|大会|決勝|準決勝|リプレイ|試合|\b(?:vs|versus|match|matches|ranked|replay|tournament|finals?|ft\d+)\b/i.test(normalized);
  return false;
}
