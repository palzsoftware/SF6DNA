export type StrategySearchRecord = {
  id: string;
  kind: "combo" | "setplay" | "sequence" | "counter";
  title: string;
  category?: string | null;
  categoryLabel?: string | null;
  searchTerms?: string[];
  driveCost?: number | null;
  saCost?: number | null;
};
export function searchStrategyCards<T extends StrategySearchRecord>(items: readonly T[], options?: { query?: string; category?: string }): T[];
export function strategyCategories(items: readonly StrategySearchRecord[]): Array<{ value: string; label: string }>;
export const strategyKinds: readonly string[];
