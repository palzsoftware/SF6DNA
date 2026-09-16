import { getDailyTrainingDetail, type DailyTrainingDetail } from "@/lib/daily-training-details";

export const IMPROVEMENT_FOCUS_KEYS = [
  "anti_air", "drive_rush_defense", "impact_response", "punish", "defense", "offense",
  "meter", "matchup", "execution", "neutral", "corner_defense", "decision",
] as const;

export type ImprovementFocus = (typeof IMPROVEMENT_FOCUS_KEYS)[number];
export type IssueDiagnosisType = "improvement" | "comprehensive";
export type PrimaryIssue = "knowledge" | "execution" | "decision" | "habit" | "matchup";
export type DailyTrainingRequest = { diagnosisType: IssueDiagnosisType; focus: ImprovementFocus | null };
export type DailyTrainingSelection = {
  source: "diagnosis_link" | "local_diagnosis" | "match_issue" | "default";
  focus: ImprovementFocus | PrimaryIssue | null;
};
export type DailyTrainingItem = {
  id: string;
  title: string;
  goal: string;
  minutes: 5;
  detail: DailyTrainingDetail;
};
export type DailyTrainingPlan = {
  dateKey: string;
  theme: string;
  reason: string;
  source: DailyTrainingSelection["source"];
  items: DailyTrainingItem[];
  totalMinutes: 15;
};

const FOCUS_LABELS: Record<ImprovementFocus | PrimaryIssue, string> = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュ対応", impact_response: "インパクト返し",
  punish: "確定反撃", defense: "守り", offense: "攻めの選択肢", meter: "ゲージ管理",
  matchup: "キャラ対策の整理", execution: "操作の安定", neutral: "中距離の立ち回り",
  corner_defense: "画面端の守り", decision: "観察と判断", knowledge: "知識の確認", habit: "癖の見直し",
};

type Template = { title: string; goal: string };
const TEMPLATES = {
  anti_air: { title: "対空を安定させる", goal: "飛びに気づけなかったのか、対空技を出せなかったのかを分けて確認し、普段使う対空を安定させます。" },
  drive_rush_defense: { title: "ドライブラッシュへの対応を決める", goal: "生ラッシュを見たときに慌てて技を振らず、止めるかガードするかを迷わず選べるようにします。" },
  impact_response: { title: "ドライブインパクトを意識する", goal: "立ち回りの中でもインパクトへ意識を残し、見てからインパクト返しができる場面を増やします。" },
  punish: { title: "確定反撃を1つ安定させる", goal: "確定反撃があると確認できた技に対して、実戦でも迷わず反撃を入れられるようにします。" },
  defense: { title: "起き上がりの守りを整理する", goal: "起き上がりに毎回同じ行動を選ぶ癖を減らし、まずガードを軸に守り方を整理します。" },
  offense: { title: "起き攻めの選択肢を2つに絞る", goal: "同じ攻めを繰り返すだけにならないよう、相手の守り方に合わせて打撃と投げを使い分けます。" },
  meter: { title: "ゲージの使いどころを決める", goal: "ドライブゲージかSAゲージのどちらかに絞り、使う場面と残す場面の基準を作ります。" },
  matchup: { title: "苦手な行動への対策を1つ確認する", goal: "対戦で困った行動をリプレイから切り出し、何に負けたのかと次に試す対策を整理します。" },
  execution: { title: "基本コンボを左右で安定させる", goal: "実戦で使う基本コンボを、1P側と2P側のどちらからでも安定して完走できるようにします。" },
  neutral: { title: "けん制技の間合いを確認する", goal: "普段使うけん制技が届く間合いを覚え、近すぎる位置や空振りしやすい位置で振る回数を減らします。" },
  corner_defense: { title: "画面端の守り方を整理する", goal: "画面端からすぐ逃げようとする癖を減らし、まず相手の起き攻めを受け止めてから脱出を考えます。" },
  decision: { title: "見るポイントを1つに絞る", goal: "相手の行動を全部見ようとして迷わないよう、今の対戦で見るポイントと対応を1つ決めます。" },
  knowledge: { title: "分からなかった場面を調べる", goal: "直近の対戦で分からなかった場面を1つ選び、リプレイ・トレモ・攻略情報を使って状況を確認します。" },
  habit: { title: "いつもの癖を1つ見直す", goal: "リプレイから同じ場面で繰り返している行動を1つ探し、次の対戦で試す別の行動を決めます。" },
  review: { title: "今日の練習を仕上げる", goal: "最初の10分で練習した内容をもう一度行い、次の対戦で意識することを1つに絞ります。" },
} satisfies Record<string, Template>;
type TemplateKey = keyof typeof TEMPLATES;

function fallbackDetail(template: Template): DailyTrainingDetail {
  return {
    category: "decision",
    title: template.title,
    why: template.goal,
    setup: ["直近の対戦やリプレイから、練習する場面を1つ選びます。"],
    minute01: ["この5分で確認することを1つ決めます。"],
    minute13: ["同じ場面を繰り返し、成功した回と失敗した回の違いを確認します。"],
    minute35: ["相手の行動や開始位置を少し変え、同じ対応を5回試します。"],
    successCondition: ["できるようになったことと、次に試すことを1つずつ言葉にできる。"],
    commonFailure: ["複数の課題を一度に直そうとして、練習の目的が曖昧になる。"],
    adjustment: ["練習する場面と使う行動を1つずつに戻します。"],
    matchFocus: ["次の1試合では、今回決めたことだけを意識します。"],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isIssueDiagnosisType(value: unknown): value is IssueDiagnosisType {
  return value === "improvement" || value === "comprehensive";
}
export function isImprovementFocus(value: unknown): value is ImprovementFocus {
  return typeof value === "string" && IMPROVEMENT_FOCUS_KEYS.includes(value as ImprovementFocus);
}
export function normalizePrimaryIssue(value: unknown): PrimaryIssue | null {
  return typeof value === "string" && ["knowledge", "execution", "decision", "habit", "matchup"].includes(value)
    ? value as PrimaryIssue : null;
}

// Read existing scores only. Do not rescore answers or interpret preference axes as weaknesses.
export function pickDiagnosisFocus(diagnosisType: unknown, rows: unknown): ImprovementFocus | null {
  if (!isIssueDiagnosisType(diagnosisType) || !Array.isArray(rows)) return null;
  let focus: ImprovementFocus | null = null;
  let bestScore = 0;
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    const [key, score] = row;
    if (isImprovementFocus(key) && typeof score === "number" && Number.isFinite(score) && score > bestScore) {
      focus = key;
      bestScore = score;
    }
  }
  return focus;
}

export function buildDailyTrainingHref(diagnosisType: unknown, rows: unknown): string {
  if (!isIssueDiagnosisType(diagnosisType)) return "/me/training";
  const params = new URLSearchParams({ diagnosis: diagnosisType });
  const focus = pickDiagnosisFocus(diagnosisType, rows);
  if (focus) params.set("focus", focus);
  return `/me/training?${params.toString()}`;
}

// URL values are user-controlled menu hints, never proof of a saved/verified diagnosis.
export function parseDailyTrainingRequest(params: Record<string, unknown>): DailyTrainingRequest | null {
  if (!isIssueDiagnosisType(params.diagnosis)) return null;
  return { diagnosisType: params.diagnosis, focus: isImprovementFocus(params.focus) ? params.focus : null };
}

export function getLatestLocalDiagnosisFocus(history: unknown, now: Date): ImprovementFocus | null {
  if (!Array.isArray(history) || !Number.isFinite(now.getTime())) return null;
  let latest: Record<string, unknown> | null = null;
  let latestTime = -Infinity;
  for (const row of history.slice(0, 50)) {
    if (!isRecord(row) || !isIssueDiagnosisType(row.diagnosisType) || typeof row.id !== "string"
      || typeof row.diagnosisSlug !== "string" || typeof row.completedAt !== "string") continue;
    const timestamp = Date.parse(row.completedAt);
    if (!Number.isFinite(timestamp) || timestamp > now.getTime() || timestamp <= latestTime) continue;
    latest = row;
    latestTime = timestamp;
  }
  if (!latest || !Array.isArray(latest.topResults)) return null;
  const rows = latest.topResults.filter(isRecord).map((row) => [row.key, row.score]);
  // If the latest applicable diagnosis has no usable focus, do not resurrect an older weakness.
  return pickDiagnosisFocus(latest.diagnosisType, rows);
}

export function resolveDailyTrainingSelection({ request, localFocus, primaryIssue }: {
  request: DailyTrainingRequest | null;
  localFocus: unknown;
  primaryIssue: unknown;
}): DailyTrainingSelection {
  if (request && isImprovementFocus(request.focus)) return { source: "diagnosis_link", focus: request.focus };
  if (!request && isImprovementFocus(localFocus)) return { source: "local_diagnosis", focus: localFocus };
  const issue = normalizePrimaryIssue(primaryIssue);
  return issue ? { source: "match_issue", focus: issue } : { source: "default", focus: null };
}

export function getJstDateKey(now: Date): string {
  if (!Number.isFinite(now.getTime())) throw new RangeError("Invalid date");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function dayNumber(dateKey: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw new RangeError("Invalid date key");
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dateKey) throw new RangeError("Invalid date key");
  return Math.floor(date.getTime() / 86_400_000);
}

export function buildDailyTrainingPlan({ dateKey, selection }: {
  dateKey: string;
  selection: DailyTrainingSelection;
}): DailyTrainingPlan {
  const day = dayNumber(dateKey);
  const validFocus = selection.source === "diagnosis_link" || selection.source === "local_diagnosis"
    ? (isImprovementFocus(selection.focus) ? selection.focus : null)
    : selection.source === "match_issue" ? normalizePrimaryIssue(selection.focus) : null;
  const source = validFocus ? selection.source : "default";
  const support: TemplateKey[] = ["anti_air", "execution", "impact_response", "defense", "review"];
  const pool = support.filter((key) => key !== validFocus);
  const start = ((day % pool.length) + pool.length) % pool.length;
  const keys: TemplateKey[] = validFocus ? [validFocus] : [];
  while (keys.length < 3) keys.push(pool[(start + keys.length - (validFocus ? 1 : 0)) % pool.length]);
  const label = validFocus ? FOCUS_LABELS[validFocus] : "基礎練習";
  const reasons: Record<DailyTrainingSelection["source"], string> = {
    diagnosis_link: `診断結果の「${label}」を、最初の5分に設定しています。診断は自己評価をもとにした練習の目安です。`,
    local_diagnosis: `このブラウザに残っている直近の課題診断から「${label}」を選びました。アカウントに保存された診断履歴とは別の情報です。`,
    match_issue: `ログイン中のアカウントにある直近の対戦課題から「${label}」を選びました。`,
    default: "練習課題がまだ選ばれていないため、共通の基礎メニューを表示しています。",
  };
  return {
    dateKey, source, theme: validFocus ? `${label}に取り組む15分` : "基礎を整える15分",
    reason: reasons[source], totalMinutes: 15,
    items: keys.map((key) => {
      const template = TEMPLATES[key];
      const detail = getDailyTrainingDetail(key) ?? fallbackDetail(template);
      return { id: `${dateKey}:${key}`, title: detail.title, goal: detail.why, minutes: 5, detail };
    }),
  };
}
