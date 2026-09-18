import { getCharacterBySlug } from "@/lib/characters";
import {
  buildDailyTrainingPlan,
  getJstDateKey,
  isImprovementFocus,
  normalizePrimaryIssue,
  type DailyTrainingSelection,
} from "@/lib/daily-training";
import { getPlayerBySlug } from "@/lib/players";
import {
  adaptCharacterContext,
  adaptDailyTrainingPlan,
  adaptDiagnosisResult,
  adaptPlayerContext,
  adaptUserText,
  emptyCoachInputContext,
  type CoachInputContext,
} from "@/lib/coach-shared-analysis";
import { COACH_PERSONA_IDS, type CoachPersonaId } from "@/lib/coach-foundation";

export type CoachSearchParams = {
  q?: string | string[];
  diagnosis?: string | string[];
  issues?: string | string[];
  daily?: string | string[];
  focus?: string | string[];
  character?: string | string[];
  player?: string | string[];
  persona?: string | string[];
};

function scalar(value: string | string[] | undefined, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function safeSlug(value: string | null): string | null {
  return value && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value) ? value : null;
}

function persona(value: string | null): CoachPersonaId {
  return value && (COACH_PERSONA_IDS as readonly string[]).includes(value)
    ? value as CoachPersonaId
    : "balanced";
}

function issueKeys(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter((key, index, all) => isImprovementFocus(key) && all.indexOf(key) === index)
    .slice(0, 3);
}

function dailySelection(focus: string | null): DailyTrainingSelection {
  if (isImprovementFocus(focus)) return { source: "diagnosis_link", focus };
  const issue = normalizePrimaryIssue(focus);
  if (issue) return { source: "match_issue", focus: issue };
  return { source: "default", focus: null };
}

export async function loadCoachInputFromSearchParams(params: CoachSearchParams): Promise<CoachInputContext> {
  const requestedPersona = persona(scalar(params.persona, 30));
  const context = emptyCoachInputContext(requestedPersona);
  const question = scalar(params.q, 500);
  const diagnosisType = scalar(params.diagnosis, 100);
  const issues = issueKeys(scalar(params.issues, 500));
  const focus = scalar(params.focus, 100);
  const characterSlug = safeSlug(scalar(params.character, 80));
  const playerSlug = safeSlug(scalar(params.player, 80));
  const wantsDaily = scalar(params.daily, 10) === "1";

  const [character, player] = await Promise.all([
    characterSlug ? getCharacterBySlug(characterSlug) : Promise.resolve(null),
    playerSlug ? getPlayerBySlug(playerSlug) : Promise.resolve(null),
  ]);

  if (question) {
    const userMessage = adaptUserText(question);
    if (userMessage) context.userMessage = userMessage;
  }
  if (diagnosisType && issues.length) {
    context.diagnosisResult = adaptDiagnosisResult({
      diagnosisType,
      resultKey: issues.join(","),
      results: issues.map((key) => ({ key, label: key, score: null })),
      resultText: null,
    });
  }
  if (wantsDaily) {
    const selection = dailySelection(focus ?? issues[0] ?? null);
    context.dailyTraining = adaptDailyTrainingPlan(buildDailyTrainingPlan({
      dateKey: getJstDateKey(new Date()),
      selection,
    }));
  }
  if (character) context.characterContext = adaptCharacterContext(character);
  if (player) context.playerContext = adaptPlayerContext(player);

  return context;
}
