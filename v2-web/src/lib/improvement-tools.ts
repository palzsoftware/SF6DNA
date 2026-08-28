export const IMPROVEMENT_STORAGE_KEY = "sf6dna:v2:improvement-loop";

export type ResultValue = "win" | "loss";
export type CheckValue = "good" | "miss" | "unknown";
export type CauseCategory = "knowledge" | "execution" | "judgment" | "habit" | "matchup";

export type BattleLog = {
  id: string;
  createdAt: string;
  opponentCharacterId: string;
  opponentName: string;
  result: ResultValue;
  rating: string;
  damageCause: string;
  antiAir: CheckValue;
  driveImpact: CheckValue;
  punish: CheckValue;
  cornerEscape: CheckValue;
  driveManagement: CheckValue;
  difficultAction: string;
  causeCategory: CauseCategory;
};

export type ReplayReview = {
  id: string;
  createdAt: string;
  problemScene: string;
  cause: string;
  attemptedAnswer: string;
  adoptedAnswer: string;
  retrainingTarget: string;
};

export type ImprovementState = {
  battleLogs: BattleLog[];
  replayReviews: ReplayReview[];
};

export type WeaknessMetric = {
  key: string;
  label: string;
  misses: number;
  opportunities: number;
  rate: number;
};

export const EMPTY_IMPROVEMENT_STATE: ImprovementState = {
  battleLogs: [],
  replayReviews: [],
};

const metricDefinitions = [
  ["antiAir", "対空"],
  ["driveImpact", "DI返し"],
  ["punish", "確反"],
  ["cornerEscape", "端脱出"],
  ["driveManagement", "Drive管理"],
] as const;

export function analyzeLastTen(logs: BattleLog[]) {
  const recent = logs.slice(0, 10);
  const weaknessMetrics: WeaknessMetric[] = metricDefinitions.map(([key, label]) => {
    const values = recent.map((log) => log[key]).filter((value) => value !== "unknown");
    const misses = values.filter((value) => value === "miss").length;
    return {
      key,
      label,
      misses,
      opportunities: values.length,
      rate: values.length ? Math.round((misses / values.length) * 100) : 0,
    };
  });

  const categoryCounts = recent.reduce<Record<CauseCategory, number>>(
    (acc, log) => {
      if (log.result === "loss") acc[log.causeCategory] += 1;
      return acc;
    },
    { knowledge: 0, execution: 0, judgment: 0, habit: 0, matchup: 0 }
  );

  const matchupCounts = recent.reduce<Record<string, { games: number; losses: number }>>((acc, log) => {
    const key = log.opponentName || "不明";
    acc[key] ??= { games: 0, losses: 0 };
    acc[key].games += 1;
    if (log.result === "loss") acc[key].losses += 1;
    return acc;
  }, {});

  const metricPriority = weaknessMetrics
    .filter((metric) => metric.opportunities > 0)
    .sort((a, b) => b.rate - a.rate || b.misses - a.misses)[0] ?? null;

  const categoryPriority = (Object.entries(categoryCounts) as [CauseCategory, number][])
    .sort((a, b) => b[1] - a[1])[0] ?? null;

  const priority = metricPriority && metricPriority.rate > 0
    ? `${metricPriority.label}（ミス率 ${metricPriority.rate}%）`
    : categoryPriority && categoryPriority[1] > 0
      ? `${causeCategoryLabel(categoryPriority[0])}の見直し`
      : "10戦分の記録を増やす";

  return {
    recent,
    wins: recent.filter((log) => log.result === "win").length,
    losses: recent.filter((log) => log.result === "loss").length,
    weaknessMetrics,
    categoryCounts,
    matchupCounts,
    priority,
  };
}

export function causeCategoryLabel(value: CauseCategory) {
  return {
    knowledge: "知識",
    execution: "操作",
    judgment: "判断",
    habit: "癖",
    matchup: "対策不足",
  }[value];
}

export function trainingSuggestion(metricKey: string) {
  return {
    antiAir: "対空：相手のジャンプ行動をレコードし、通常対空・空対空の成功率を確認する",
    driveImpact: "DI返し：複数行動へDIを混ぜたランダム再生で反応確認する",
    punish: "確反：苦手技をガード後に最短の安定反撃から確認する",
    cornerEscape: "端防御：投げ・打撃・DIを混ぜ、脱出手段を1つずつ確認する",
    driveManagement: "Drive管理：1ラウンド想定で使用先を記録し、バーンアウト原因を確認する",
  }[metricKey] ?? "対戦ログを追加し、再現できる課題から練習する";
}
