import {
  DEFAULT_COACH_PERSONA_ID,
  coachEvidenceKindLabel,
  getCoachPersona,
  validateCoachAnalysisResult,
  type CoachAnalysisResult,
  type CoachEvidenceItem,
  type CoachEvidenceKind,
  type CoachPersona,
  type CoachPersonaId,
  type CoachResponseSection,
} from "@/lib/coach-foundation";
import { validateCoachResponseQuality } from "@/lib/coach-response-quality";

export type CoachAnswerItem = {
  id: string;
  title: string | null;
  text: string;
  details: string[];
  evidenceIds: string[];
};

export type CoachAnswerSection = {
  id: CoachResponseSection;
  title: string;
  items: CoachAnswerItem[];
};

export type CoachSourceReference = {
  evidenceId: string;
  label: string;
  url: string;
  patch: string | null;
  sourceType: string | null;
  sourceReliability: string | null;
};

export type CoachEvidenceSummary = {
  evidenceId: string;
  kind: CoachEvidenceKind;
  kindLabel: string;
  verificationLabel: string;
  statement: string;
  patch: string | null;
  patchStatus: CoachEvidenceItem["patchStatus"];
  sourceReference: CoachSourceReference | null;
};

export type CoachComposedAnswer = {
  persona: CoachPersona;
  lead: string;
  summary: string;
  sections: CoachAnswerSection[];
  evidenceSummary: CoachEvidenceSummary[];
  uncertainties: string[];
  recommendedNextActions: string[];
  referencedEvidenceIds: string[];
};

const SECTION_TITLES: Record<CoachResponseSection, string> = {
  summary: "今回の要点",
  strengths: "確認できた強み",
  priorityIssues: "優先して確認する課題",
  drills: "練習候補",
  evidence: "根拠と検証状態",
  uncertainty: "未確認・注意点",
  nextActions: "次に行うこと",
};

function composedPersonaLead(persona: CoachPersona): string {
  if (persona.id === "competitive") return "優先度の高い修正点から確認します。";
  if (persona.id === "supportive") return "次の対戦で試しやすい順に確認します。";
  if (persona.id === "research") return "根拠・Patch・未確認事項を分けて確認します。";
  return "根拠を保ったまま、良かった点と改善点を整理します。";
}

export function coachVerificationLabel(item: CoachEvidenceItem): string {
  if (item.kind === "VERIFIED_GAME_FACT" && item.verificationStatus === "verified") return "検証済み";
  if (item.kind === "SOURCE_BACKED_FACT") return "出典あり・検証状態は別管理";
  if (item.kind === "PLAYER_STATEMENT") return "本人の入力・発言";
  if (item.kind === "AI_INFERENCE") return "AIによる分析（推定）";
  if (item.kind === "UNVERIFIED_CANDIDATE") return "未確認・追加確認が必要";
  return item.verificationStatus === "verified" ? "確認済み観察" : "観察情報";
}

export function coachSourceReferenceLabel(item: CoachEvidenceItem): string {
  const value = `${item.sourceType ?? ""} ${item.sourceReliability ?? ""} ${item.sourceUrl ?? ""}`.toLowerCase();
  if (/capcom|streetfighter\.com|official/.test(value)) return "CAPCOM公式を見る";
  if (/youtube|youtu\.be/.test(value)) return "YouTubeで見る";
  if (/tournament|event|bracket/.test(value)) return "大会結果の出典を見る";
  if (/player|profile/.test(value)) return "プレイヤー公式プロフィールを見る";
  if (/move|frame|game[_ -]?data/.test(value)) return "技データの出典を見る";
  return "情報源を見る";
}

function patchUncertainty(item: CoachEvidenceItem): string | null {
  if (item.patchStatus === "PATCH_STALE") return `${coachEvidenceKindLabel(item.kind)}「${item.statement}」は古いPatchの情報です。現行Patchで再確認してください。`;
  if (item.patchStatus === "PATCH_UNKNOWN") return `${coachEvidenceKindLabel(item.kind)}「${item.statement}」は対応Patchが不明です。適用前に確認してください。`;
  return null;
}

function evidenceSummary(item: CoachEvidenceItem): CoachEvidenceSummary {
  return {
    evidenceId: item.id,
    kind: item.kind,
    kindLabel: coachEvidenceKindLabel(item.kind),
    verificationLabel: coachVerificationLabel(item),
    statement: item.statement,
    patch: item.patch,
    patchStatus: item.patchStatus,
    sourceReference: item.sourceUrl ? {
      evidenceId: item.id,
      label: coachSourceReferenceLabel(item),
      url: item.sourceUrl,
      patch: item.patch,
      sourceType: item.sourceType ?? null,
      sourceReliability: item.sourceReliability ?? null,
    } : null,
  };
}

function buildSections(result: CoachAnalysisResult): Record<CoachResponseSection, CoachAnswerSection> {
  const evidence = result.evidence.map((item) => evidenceSummary(item));
  return {
    summary: { id: "summary", title: SECTION_TITLES.summary, items: [{ id: "summary", title: null, text: result.summary || "分析に使える情報がまだありません。", details: [], evidenceIds: [] }] },
    strengths: { id: "strengths", title: SECTION_TITLES.strengths, items: result.strengths.map((item) => ({ id: item.id, title: item.title, text: item.detail, details: [], evidenceIds: [...item.evidenceIds] })) },
    priorityIssues: { id: "priorityIssues", title: SECTION_TITLES.priorityIssues, items: result.priorityIssues.map((item) => ({ id: item.id, title: item.title, text: item.detail, details: [], evidenceIds: [...item.evidenceIds] })) },
    drills: { id: "drills", title: SECTION_TITLES.drills, items: result.drills.map((item) => ({ id: item.id, title: item.title, text: item.purpose, details: [...item.steps, `成功条件: ${item.successCondition}`], evidenceIds: [...item.evidenceIds] })) },
    evidence: { id: "evidence", title: SECTION_TITLES.evidence, items: evidence.map((item) => ({ id: item.evidenceId, title: `${item.kindLabel} / ${item.verificationLabel}`, text: item.statement, details: item.patch ? [`Patch: ${item.patch}`] : [], evidenceIds: [item.evidenceId] })) },
    uncertainty: { id: "uncertainty", title: SECTION_TITLES.uncertainty, items: result.uncertainty.map((text, index) => ({ id: `uncertainty-${index}`, title: null, text, details: [], evidenceIds: [] })) },
    nextActions: { id: "nextActions", title: SECTION_TITLES.nextActions, items: result.nextActions.map((text, index) => ({ id: `next-${index}`, title: null, text, details: [], evidenceIds: [] })) },
  };
}

export function validateCoachComposedAnswer(answer: CoachComposedAnswer, evidence: CoachEvidenceItem[]): string[] {
  const errors: string[] = [];
  const byId = new Map(evidence.map((item) => [item.id, item]));
  if (!answer.lead.trim()) errors.push("answer.lead is required");
  if (!answer.summary.trim()) errors.push("answer.summary is required");
  for (const id of answer.referencedEvidenceIds) if (!byId.has(id)) errors.push(`unknown evidence reference: ${id}`);
  for (const item of answer.evidenceSummary) {
    const original = byId.get(item.evidenceId);
    if (!original) { errors.push(`unknown evidence summary: ${item.evidenceId}`); continue; }
    if (item.statement !== original.statement) errors.push(`${item.evidenceId}: evidence statement changed`);
    if (item.verificationLabel !== coachVerificationLabel(original)) errors.push(`${item.evidenceId}: verification label mismatch`);
    if (item.verificationLabel === "検証済み" && (original.kind !== "VERIFIED_GAME_FACT" || original.verificationStatus !== "verified")) errors.push(`${item.evidenceId}: verified label is not permitted`);
    if (item.sourceReference && (item.sourceReference.url !== original.sourceUrl || item.sourceReference.patch !== original.patch)) errors.push(`${item.evidenceId}: source provenance changed`);
  }
  return errors;
}

export function composeCoachAnswer({ result, personaId = DEFAULT_COACH_PERSONA_ID }: { result: CoachAnalysisResult; personaId?: CoachPersonaId | string }): CoachComposedAnswer {
  const analysisErrors = validateCoachAnalysisResult(result);
  if (analysisErrors.length) throw new Error(`Invalid CoachAnalysisResult: ${analysisErrors.join("; ")}`);
  const persona = getCoachPersona(personaId);
  const sections = buildSections(result);
  const patchNotes = result.evidence.map(patchUncertainty).filter((item): item is string => Boolean(item));
  const uncertainties = [...new Set([...result.uncertainty, ...patchNotes])];
  sections.uncertainty = { ...sections.uncertainty, items: uncertainties.map((text, index) => ({ id: `uncertainty-${index}`, title: null, text, details: [], evidenceIds: [] })) };
  const answer: CoachComposedAnswer = {
    persona,
    lead: composedPersonaLead(persona),
    summary: result.summary || "分析に使える情報がまだありません。質問や診断結果を追加してください。",
    sections: persona.feedbackOrder.map((id) => sections[id]).filter((section) => section.id === "summary" || section.items.length > 0),
    evidenceSummary: result.evidence.map(evidenceSummary),
    uncertainties,
    recommendedNextActions: [...result.nextActions],
    referencedEvidenceIds: [...new Set([...result.strengths, ...result.priorityIssues, ...result.drills].flatMap((item) => item.evidenceIds).concat(result.evidence.map((item) => item.id)))],
  };
  const errors = validateCoachComposedAnswer(answer, result.evidence);
  errors.push(...validateCoachResponseQuality(answer, result.evidence));
  if (errors.length) throw new Error(`Invalid CoachComposedAnswer: ${errors.join("; ")}`);
  return answer;
}
