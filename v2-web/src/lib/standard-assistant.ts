import { getJstDateKey, getLatestLocalDiagnosisFocus, type DailyTrainingPlan, type ImprovementFocus } from "@/lib/daily-training";

// Preparation only: no page imports this engine. The UI, consent/ON-OFF control,
// persistence and mobile/accessibility verification are a separate release decision.
export type StandardAssistantEvent = "first_visit" | "return_visit" | "character_viewed" | "diagnosis_completed" | "daily15_completed";
export type StandardAssistantContext = {
  diagnosisFocus: ImprovementFocus | null;
  characterSlug: string | null;
  hasFavoriteCharacters: boolean;
  daily15Complete: boolean;
};
export type StandardAssistantMessage = {
  id: StandardAssistantEvent;
  persona: "standard";
  priority: number;
  text: string;
  cta: { label: string; href: string };
};

const FOCUS_LABELS: Record<ImprovementFocus, string> = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュへの対応", impact_response: "インパクト返し",
  punish: "確定反撃", defense: "守り", offense: "攻めの選択肢", meter: "ゲージ管理",
  matchup: "キャラ対策", execution: "操作の安定", neutral: "中距離の立ち回り",
  corner_defense: "画面端の守り", decision: "観察と判断",
};

export function buildStandardAssistantContext(input: {
  diagnosisHistory: unknown;
  now: Date;
  // Known slugs must come from the character catalogue, not storage alone.
  knownCharacterSlugs: readonly string[];
  lastCharacterSlug?: unknown;
  favoriteCharacterSlugs?: unknown;
  dailyPlan?: DailyTrainingPlan;
  completedDailyItemIds?: readonly string[];
}): StandardAssistantContext {
  const known = new Set(input.knownCharacterSlugs.filter((slug) => /^[a-z0-9][a-z0-9-]{0,63}$/.test(slug)));
  const characterSlug = typeof input.lastCharacterSlug === "string" && known.has(input.lastCharacterSlug) ? input.lastCharacterSlug : null;
  const favorites = Array.isArray(input.favoriteCharacterSlugs) ? input.favoriteCharacterSlugs.slice(0, 64) : [];
  const items = input.dailyPlan?.items ?? [];
  const completed = new Set(input.completedDailyItemIds ?? []);
  // The existing Daily15 component keeps completion in memory. Never infer a
  // persisted training streak or yesterday's completion from diagnosis history.
  const daily15Complete = Number.isFinite(input.now.getTime()) && input.dailyPlan?.dateKey === getJstDateKey(input.now)
    && input.dailyPlan.totalMinutes === 15 && items.length === 3
    && new Set(items.map((item) => item.id)).size === 3
    && items.every((item) => item.minutes === 5 && completed.has(item.id));
  return {
    diagnosisFocus: getLatestLocalDiagnosisFocus(input.diagnosisHistory, input.now),
    characterSlug,
    hasFavoriteCharacters: favorites.some((slug) => typeof slug === "string" && known.has(slug)),
    daily15Complete,
  };
}

export function selectStandardAssistantMessage(input: {
  enabled: boolean;
  events: readonly StandardAssistantEvent[];
  context: StandardAssistantContext;
}): StandardAssistantMessage | null {
  if (!input.enabled) return null;
  const { context } = input;
  const candidates: StandardAssistantMessage[] = [];
  const add = (id: StandardAssistantEvent, priority: number, text: string, label: string, href: string) => {
    candidates.push({ id, persona: "standard", priority, text, cta: { label, href } });
  };
  for (const event of new Set(input.events)) {
    if (event === "daily15_completed" && context.daily15Complete) {
      add(event, 100, "今日の15分、おつかれさまでした。次の対戦では、練習したことを1つ試してみましょう。", "キャラクターを見る", "/characters");
    } else if (event === "diagnosis_completed") {
      const focus = context.diagnosisFocus;
      add(event, 80, focus ? `今日は${FOCUS_LABELS[focus]}を優先して練習してみましょう。` : "診断を参考に、今日の練習を1つ決めてみましょう。", "今日の15分練習へ", "/me/training");
    } else if (event === "character_viewed" && context.characterSlug) {
      add(event, 60, "特徴を確認したら、まず使う技を1つ選んでみましょう。", "キャラクター詳細を見る", `/characters/${context.characterSlug}`);
    } else if (event === "first_visit") {
      add(event, 20, "キャラクター情報や診断から、気になることを探してみましょう。", "診断を選ぶ", "/diagnosis");
    } else if (event === "return_visit") {
      add(event, 10, "今日は何を練習しますか？", context.hasFavoriteCharacters ? "お気に入りを見る" : "今日の15分練習へ", context.hasFavoriteCharacters ? "/favorites" : "/me/training");
    }
  }
  return candidates.sort((left, right) => right.priority - left.priority)[0] ?? null;
}
