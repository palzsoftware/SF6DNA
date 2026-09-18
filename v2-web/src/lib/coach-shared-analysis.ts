import {
  DEFAULT_COACH_PERSONA_ID,
  validateCoachAnalysisResult,
  type CoachAnalysisResult,
  type CoachEvidenceItem,
  type CoachPersonaId,
} from "@/lib/coach-foundation";
import type { DailyTrainingPlan } from "@/lib/daily-training";
import type { CharacterDetail, SourceReference } from "@/types/character";
import type { PlayerDetail, PlayerSource } from "@/types/player";

export type DiagnosisCoachMetric = {
  key: string;
  label: string;
  score: number | null;
};

export type DiagnosisCoachContext = {
  diagnosisType: string;
  resultKey: string | null;
  primaryIssues: DiagnosisCoachMetric[];
  secondaryIssues: DiagnosisCoachMetric[];
  strengths: DiagnosisCoachMetric[];
  resultText: string | null;
  source: "diagnosis";
};

export type DailyCoachItem = {
  id: string;
  issue: string;
  objective: string;
  durationMinutes: number;
  setup: string[];
  successCondition: string[];
  failureAdjustment: string[];
  matchFocus: string[];
};

export type DailyCoachContext = {
  trainingDate: string;
  theme: string;
  reason: string;
  source: "daily_training";
  items: DailyCoachItem[];
};

export type UserMessageCoachContext = {
  rawText: string;
  extractedClaims: string[];
  evidenceKind: "PLAYER_STATEMENT";
  requiresVerification: true;
  source: "user_message";
};

export type ContextFact = {
  id: string;
  statement: string;
  sourceId: string;
  sourceUrl: string;
  patch: string | null;
};

export type CharacterCoachContext = {
  id: string;
  slug: string;
  name: string;
  sourceBackedFacts: ContextFact[];
  source: "character";
};

export type PlayerCoachContext = {
  id: string;
  slug: string;
  displayName: string;
  sourceBackedFacts: ContextFact[];
  source: "player";
};

export type CoachAccountContext = {
  authenticated: boolean;
};

export type CoachInputContext = {
  diagnosisResult?: DiagnosisCoachContext;
  dailyTraining?: DailyCoachContext;
  userMessage?: UserMessageCoachContext;
  characterContext?: CharacterCoachContext;
  playerContext?: PlayerCoachContext;
  accountContext?: CoachAccountContext;
  locale: string;
  requestedPersona: CoachPersonaId;
};

export type DiagnosisAdapterInput = {
  diagnosisType: string;
  resultKey?: string | null;
  results: Array<{ key: string; label?: string | null; score?: number | null }>;
  resultText?: string | null;
};

function cleanText(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function cleanMetric(input: { key: string; label?: string | null; score?: number | null }): DiagnosisCoachMetric | null {
  const key = cleanText(input.key, 100);
  if (!key) return null;
  const score = typeof input.score === "number" && Number.isFinite(input.score) ? input.score : null;
  return {
    key,
    label: cleanText(input.label, 200) ?? key,
    score,
  };
}

export function adaptDiagnosisResult(input: DiagnosisAdapterInput): DiagnosisCoachContext {
  const metrics = input.results.map(cleanMetric).filter((item): item is DiagnosisCoachMetric => Boolean(item));
  const positive = metrics.filter((item) => item.score === null || item.score > 0);
  const isIssueDiagnosis = input.diagnosisType === "improvement" || input.diagnosisType === "comprehensive";

  return {
    diagnosisType: cleanText(input.diagnosisType, 100) ?? "unknown",
    resultKey: cleanText(input.resultKey, 200),
    primaryIssues: isIssueDiagnosis ? positive.slice(0, 3) : [],
    secondaryIssues: isIssueDiagnosis ? positive.slice(3, 6) : [],
    strengths: [],
    resultText: cleanText(input.resultText),
    source: "diagnosis",
  };
}

export function adaptDailyTrainingPlan(plan: DailyTrainingPlan): DailyCoachContext {
  return {
    trainingDate: plan.dateKey,
    theme: plan.theme,
    reason: plan.reason,
    source: "daily_training",
    items: plan.items.map((item) => ({
      id: item.id,
      issue: item.title,
      objective: item.goal,
      durationMinutes: item.minutes,
      setup: [...item.detail.setup],
      successCondition: [...item.detail.successCondition],
      failureAdjustment: [...item.detail.adjustment],
      matchFocus: [...item.detail.matchFocus],
    })),
  };
}

export function adaptUserText(rawText: string): UserMessageCoachContext | undefined {
  const text = cleanText(rawText, 500);
  if (!text) return undefined;
  return {
    rawText: text,
    extractedClaims: [text],
    evidenceKind: "PLAYER_STATEMENT",
    requiresVerification: true,
    source: "user_message",
  };
}

function sourceForFact(sources: Array<SourceReference | PlayerSource>): SourceReference | PlayerSource | null {
  return sources.find((source) => /^https?:\/\//i.test(source.url)) ?? null;
}

function contextFact(id: string, statement: string | null | undefined, source: SourceReference | PlayerSource | null): ContextFact | null {
  const text = cleanText(statement);
  if (!text || !source) return null;
  return {
    id,
    statement: text,
    sourceId: source.id,
    sourceUrl: source.url,
    patch: null,
  };
}

export function adaptCharacterContext(character: CharacterDetail): CharacterCoachContext {
  const source = sourceForFact(character.sources);
  const facts = [
    contextFact("summary", character.shortDescription, source),
    contextFact("strengths", character.strengthsSummary, source),
    contextFact("weaknesses", character.weaknessesSummary, source),
  ].filter((item): item is ContextFact => Boolean(item));

  return {
    id: character.id,
    slug: character.slug,
    name: character.name,
    sourceBackedFacts: facts,
    source: "character",
  };
}

export function adaptPlayerContext(player: PlayerDetail): PlayerCoachContext {
  const source = sourceForFact(player.sources);
  const mainCharacter = player.characters.find((item) => item.role === "main") ?? player.characters[0] ?? null;
  const facts = [
    contextFact("bio", player.bio, source),
    contextFact("team", player.teamName ? `${player.displayName}の所属チーム: ${player.teamName}` : null, source),
    contextFact("region", player.region ? `${player.displayName}の地域: ${player.region}` : null, source),
    contextFact("main_character", mainCharacter ? `${player.displayName}の公開済み使用キャラクター: ${mainCharacter.characterName}` : null, source),
  ].filter((item): item is ContextFact => Boolean(item));

  return {
    id: player.id,
    slug: player.slug,
    displayName: player.displayName,
    sourceBackedFacts: facts,
    source: "player",
  };
}

function evidenceBase(id: string): Pick<CoachEvidenceItem, "id" | "patch" | "confidence" | "createdAt"> {
  return { id, patch: null, confidence: null, createdAt: null };
}

export function buildDiagnosisEvidence(context: DiagnosisCoachContext): CoachEvidenceItem[] {
  return [...context.primaryIssues, ...context.secondaryIssues].map((item, index) => ({
    ...evidenceBase(`diagnosis:${context.resultKey ?? context.diagnosisType}:${index}`),
    kind: "PLAYER_STATEMENT",
    statement: item.score === null
      ? `診断結果で「${item.label}」が改善候補として選ばれています。`
      : `診断結果で「${item.label}」が改善候補として選ばれています（診断スコア ${item.score}）。`,
    sourceId: `diagnosis:${context.resultKey ?? context.diagnosisType}`,
    sourceUrl: null,
    verificationStatus: "unverified",
    characterSlug: null,
    playerId: null,
  }));
}

export function buildDailyEvidence(context: DailyCoachContext): CoachEvidenceItem[] {
  return context.items.map((item) => ({
    ...evidenceBase(`daily:${context.trainingDate}:${item.id}`),
    kind: "UNVERIFIED_CANDIDATE",
    statement: `今日の練習提案「${item.issue}」: ${item.objective}`,
    sourceId: `daily:${context.trainingDate}:${item.id}`,
    sourceUrl: null,
    verificationStatus: "unverified",
    characterSlug: null,
    playerId: null,
  }));
}

export function buildUserStatementEvidence(context: UserMessageCoachContext): CoachEvidenceItem[] {
  return [{
    ...evidenceBase("user-message:0"),
    kind: "PLAYER_STATEMENT",
    statement: context.rawText,
    sourceId: "user_message",
    sourceUrl: null,
    verificationStatus: "unverified",
    characterSlug: null,
    playerId: null,
  }];
}

export function buildCharacterEvidence(context: CharacterCoachContext): CoachEvidenceItem[] {
  return context.sourceBackedFacts.map((fact) => ({
    ...evidenceBase(`character:${context.id}:${fact.id}`),
    kind: "SOURCE_BACKED_FACT",
    statement: fact.statement,
    sourceId: fact.sourceId,
    sourceUrl: fact.sourceUrl,
    patch: fact.patch,
    verificationStatus: "reviewed",
    characterSlug: context.slug,
    playerId: null,
  }));
}

export function buildPlayerEvidence(context: PlayerCoachContext): CoachEvidenceItem[] {
  return context.sourceBackedFacts.map((fact) => ({
    ...evidenceBase(`player:${context.id}:${fact.id}`),
    kind: "SOURCE_BACKED_FACT",
    statement: fact.statement,
    sourceId: fact.sourceId,
    sourceUrl: fact.sourceUrl,
    patch: fact.patch,
    verificationStatus: "reviewed",
    characterSlug: null,
    playerId: context.id,
  }));
}

export function buildCoachEvidence(context: CoachInputContext): CoachEvidenceItem[] {
  return [
    ...(context.diagnosisResult ? buildDiagnosisEvidence(context.diagnosisResult) : []),
    ...(context.dailyTraining ? buildDailyEvidence(context.dailyTraining) : []),
    ...(context.userMessage ? buildUserStatementEvidence(context.userMessage) : []),
    ...(context.characterContext ? buildCharacterEvidence(context.characterContext) : []),
    ...(context.playerContext ? buildPlayerEvidence(context.playerContext) : []),
  ];
}

function evidenceIdForDiagnosis(context: DiagnosisCoachContext, index: number): string {
  return `diagnosis:${context.resultKey ?? context.diagnosisType}:${index}`;
}

function analysisSummary(context: CoachInputContext): string {
  const parts: string[] = [];
  if (context.diagnosisResult?.primaryIssues.length) parts.push("診断の改善候補");
  if (context.dailyTraining?.items.length) parts.push("今日の練習");
  if (context.userMessage) parts.push("あなたの入力");
  if (context.characterContext) parts.push("キャラクター情報");
  if (context.playerContext) parts.push("プレイヤー情報");
  if (!parts.length) return "分析に使える文脈がまだありません。";
  return `${parts.join("・")}を、確認できる範囲のEvidenceだけで整理しました。`;
}

export function analyzeCoachContext(context: CoachInputContext): CoachAnalysisResult {
  const evidence = buildCoachEvidence(context);
  const primaryIssues = (context.diagnosisResult?.primaryIssues ?? []).map((item, index) => ({
    id: `priority:${item.key}:${index}`,
    title: item.label,
    detail: "診断結果で改善候補として上位に出た項目です。ゲーム内での発生頻度や原因は、リプレイ等で別途確認が必要です。",
    evidenceIds: [evidenceIdForDiagnosis(context.diagnosisResult as DiagnosisCoachContext, index)],
  }));

  const drills = (context.dailyTraining?.items ?? []).map((item) => ({
    id: `drill:${item.id}`,
    title: item.issue,
    purpose: item.objective,
    steps: item.setup.length ? [...item.setup] : ["既存のDaily Training画面で手順を確認します。"],
    successCondition: item.successCondition.join(" / ") || "既存のDaily Training画面で成功条件を確認します。",
    evidenceIds: [`daily:${context.dailyTraining?.trainingDate}:${item.id}`],
  }));

  const uncertainty: string[] = [];
  if (!evidence.length) uncertainty.push("分析に使えるEvidenceがまだありません。入力・診断・Daily・公開Sourceのいずれかが必要です。");
  if (context.userMessage?.requiresVerification) uncertainty.push("ユーザー入力に含まれるゲーム事実は未検証です。PLAYER_STATEMENTのまま保持し、別Sourceなしでゲーム事実へ昇格しません。");
  if (context.diagnosisResult && !context.diagnosisResult.primaryIssues.length && !context.diagnosisResult.secondaryIssues.length) {
    uncertainty.push("この診断Contextは改善課題として解釈していません。診断種別の意味を変えずに保持しています。");
  }
  if (context.characterContext && !context.characterContext.sourceBackedFacts.length) uncertainty.push("キャラクターContextには今回利用できるSource-backed factがありません。");
  if (context.playerContext && !context.playerContext.sourceBackedFacts.length) uncertainty.push("プレイヤーContextには今回利用できるSource-backed factがありません。プレイスタイルを推測で補いません。");

  const nextActions: string[] = [];
  if (drills.length) nextActions.push("Daily Trainingの手順を実施し、成功条件と失敗した場面を記録する。");
  if (primaryIssues.length) nextActions.push("上位課題が実戦でも起きているか、リプレイで1場面ずつ確認する。");
  if (context.userMessage) nextActions.push("入力内のゲーム事実を使う場合は、PatchとSourceを確認する。");
  if (!nextActions.length) nextActions.push("診断結果、Daily Training、または確認したい内容を追加する。");

  const result: CoachAnalysisResult = {
    summary: analysisSummary(context),
    strengths: [],
    priorityIssues: primaryIssues,
    drills,
    evidence,
    uncertainty,
    nextActions,
  };

  const errors = validateCoachAnalysisResult(result);
  if (errors.length) throw new Error(`Invalid shared analysis result: ${errors.join("; ")}`);
  return result;
}

export function emptyCoachInputContext(persona: CoachPersonaId = DEFAULT_COACH_PERSONA_ID): CoachInputContext {
  return {
    locale: "ja-JP",
    requestedPersona: persona,
  };
}
