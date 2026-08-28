export const STRATEGY_KINDS = ["combos", "setups", "sequences", "counters", "trainings"] as const;
export type StrategyKind = (typeof STRATEGY_KINDS)[number];

export const STRATEGY_META: Record<StrategyKind, { label: string; table: string; titleColumn: string; publicPath: string }> = {
  combos: { label: "コンボ", table: "combos", titleColumn: "name", publicPath: "/combos" },
  setups: { label: "セットプレイ", table: "setups", titleColumn: "name", publicPath: "/setups" },
  sequences: { label: "連携", table: "sequences", titleColumn: "name", publicPath: "/sequences" },
  counters: { label: "対策", table: "counters", titleColumn: "title", publicPath: "/counters" },
  trainings: { label: "トレーニング", table: "trainings", titleColumn: "name", publicPath: "/training" },
};

export function isStrategyKind(value: string): value is StrategyKind {
  return STRATEGY_KINDS.includes(value as StrategyKind);
}
