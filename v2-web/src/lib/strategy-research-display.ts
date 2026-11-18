import lukeDisplay from "./luke-strategy-display-20261118.json";
import type { StrategyResearchCard } from "./strategy-research-contract";
export type StrategyMetric = { label: string; value: string };
export type StrategyDisplay = { title: string; iconInput: string; description: string; condition: string; commandRole: string; metrics: StrategyMetric[]; controlLabel: string; commandJapanese: string; referenceNotice: string };
const overlays: Record<string, StrategyDisplay> = lukeDisplay;
const reference = (value: number | null) => value === null ? "未確認" : `${value}（参考）`;
const unknown = (label: string) => ({ label, value: "未確認" });
export function strategyResearchDisplay(card: StrategyResearchCard): StrategyDisplay {
  const known = overlays[card.id];
  if (known && card.characterSlug === "luke") return known;
  const s = card.reportedStats;
  const metrics = card.category === "combo" ? [{label:"ダメージ",value:reference(s.damage)},{label:"D消費",value:reference(s.drive)},{label:"SA消費",value:reference(s.sa)}] : card.category === "setplay" ? [unknown("ダウン有利"),unknown("ガード有利"),unknown("D消費")] : card.category === "pressure" ? [unknown("始動技ガード時"),unknown("割り込み猶予"),unknown("連続ガード")] : [unknown("相手ガード時"),unknown("反撃猶予"),unknown("距離条件")];
  return {title:card.title,iconInput:card.commandRaw,description:card.description,condition:card.condition,commandRole:card.category === "counter" ? "参考手順（主体要確認）" : "参考入力手順",metrics,controlLabel:card.controlLabel,commandJapanese:card.commandJapanese,referenceNotice:card.referenceNotice};
}
