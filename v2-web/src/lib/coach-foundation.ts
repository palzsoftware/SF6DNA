export const COACH_EVIDENCE_KINDS = [
  "PLAYER_STATEMENT",
  "OBSERVED_BEHAVIOR",
  "OBSERVED_PATTERN",
  "AI_INFERENCE",
  "VERIFIED_GAME_FACT",
  "SOURCE_BACKED_FACT",
  "UNVERIFIED_CANDIDATE",
] as const;

export type CoachEvidenceKind = (typeof COACH_EVIDENCE_KINDS)[number];
export type CoachVerificationStatus = "verified" | "reviewed" | "draft" | "unverified";

export type CoachEvidenceItem = {
  id: string;
  kind: CoachEvidenceKind;
  statement: string;
  sourceId: string | null;
  sourceUrl: string | null;
  patch: string | null;
  confidence: number | null;
  verificationStatus: CoachVerificationStatus;
  characterSlug: string | null;
  playerId: string | null;
  createdAt: string | null;
  sourceType?: string | null;
  sourceReliability?: string | null;
  patchStatus?: "PATCH_MATCH" | "PATCH_COMPATIBLE" | "PATCH_UNKNOWN" | "PATCH_STALE" | "PATCH_NOT_APPLICABLE" | null;
  availabilityStatus?: "public" | "unknown" | "inaccessible" | "restricted" | "private" | "internal" | null;
  sourcePublishedAt?: string | null;
  sourceAccessedAt?: string | null;
  relevanceScore?: number | null;
};

export type CoachFinding = {
  id: string;
  title: string;
  detail: string;
  evidenceIds: string[];
};

export type CoachDrill = {
  id: string;
  title: string;
  purpose: string;
  steps: string[];
  successCondition: string;
  evidenceIds: string[];
};

export type CoachAnalysisResult = {
  summary: string;
  strengths: CoachFinding[];
  priorityIssues: CoachFinding[];
  drills: CoachDrill[];
  evidence: CoachEvidenceItem[];
  uncertainty: string[];
  nextActions: string[];
};

export const COACH_PERSONA_IDS = ["balanced", "competitive", "supportive", "research"] as const;
export type CoachPersonaId = (typeof COACH_PERSONA_IDS)[number];

export type CoachResponseSection =
  | "summary"
  | "strengths"
  | "priorityIssues"
  | "drills"
  | "evidence"
  | "uncertainty"
  | "nextActions";

export type CoachPersona = {
  id: CoachPersonaId;
  displayName: string;
  description: string;
  strictness: 1 | 2 | 3;
  encouragement: 1 | 2 | 3;
  technicalDepth: 1 | 2 | 3;
  detailLevel: "compact" | "standard" | "detailed";
  responseLength: "short" | "standard" | "long";
  feedbackOrder: readonly CoachResponseSection[];
  speechStyle: "neutral" | "direct" | "gentle" | "technical";
  mascotAsset: string | null;
  active: boolean;
};

export const DEFAULT_COACH_PERSONA_ID: CoachPersonaId = "balanced";

export const COACH_PERSONAS: readonly CoachPersona[] = [
  {
    id: "balanced",
    displayName: "標準コーチ",
    description: "根拠を確認しながら、良かった点と改善点をバランス良く整理します。",
    strictness: 2,
    encouragement: 2,
    technicalDepth: 2,
    detailLevel: "standard",
    responseLength: "standard",
    feedbackOrder: ["summary", "strengths", "priorityIssues", "drills", "evidence", "uncertainty", "nextActions"],
    speechStyle: "neutral",
    mascotAsset: null,
    active: true,
  },
  {
    id: "competitive",
    displayName: "競技コーチ",
    description: "優先ミスと実戦再現性を先に確認し、大会・真剣な練習向けに整理します。",
    strictness: 3,
    encouragement: 1,
    technicalDepth: 2,
    detailLevel: "standard",
    responseLength: "standard",
    feedbackOrder: ["priorityIssues", "summary", "drills", "nextActions", "strengths", "evidence", "uncertainty"],
    speechStyle: "direct",
    mascotAsset: null,
    active: true,
  },
  {
    id: "supportive",
    displayName: "サポートコーチ",
    description: "一度に抱える改善点を絞り、次に実行しやすい形で整理します。",
    strictness: 1,
    encouragement: 3,
    technicalDepth: 1,
    detailLevel: "compact",
    responseLength: "short",
    feedbackOrder: ["summary", "strengths", "drills", "priorityIssues", "nextActions", "evidence", "uncertainty"],
    speechStyle: "gentle",
    mascotAsset: null,
    active: true,
  },
  {
    id: "research",
    displayName: "研究コーチ",
    description: "Patch・Source・技術情報を確認し、検証済みと未確認を分けて詳しく整理します。",
    strictness: 2,
    encouragement: 1,
    technicalDepth: 3,
    detailLevel: "detailed",
    responseLength: "long",
    feedbackOrder: ["summary", "evidence", "uncertainty", "priorityIssues", "drills", "strengths", "nextActions"],
    speechStyle: "technical",
    mascotAsset: null,
    active: true,
  },
] as const;

export type CoachFormattedResponse = {
  persona: CoachPersona;
  lead: string;
  sectionOrder: readonly CoachResponseSection[];
  summary: string;
  strengths: CoachFinding[];
  priorityIssues: CoachFinding[];
  drills: CoachDrill[];
  evidence: CoachEvidenceItem[];
  uncertainty: string[];
  nextActions: string[];
};

export function getCoachPersona(id: CoachPersonaId | string): CoachPersona {
  return COACH_PERSONAS.find((persona) => persona.id === id) ?? COACH_PERSONAS[0];
}

export function coachEvidenceKindLabel(kind: CoachEvidenceKind): string {
  const labels: Record<CoachEvidenceKind, string> = {
    PLAYER_STATEMENT: "本人発言",
    OBSERVED_BEHAVIOR: "試合から確認できる行動",
    OBSERVED_PATTERN: "複数試合で見られる傾向",
    AI_INFERENCE: "AIによる分析",
    VERIFIED_GAME_FACT: "検証済みゲーム情報",
    SOURCE_BACKED_FACT: "出典で確認できる情報",
    UNVERIFIED_CANDIDATE: "未確認候補",
  };
  return labels[kind];
}

function hasSource(item: CoachEvidenceItem): boolean {
  return Boolean(item.sourceId?.trim() || item.sourceUrl?.trim());
}

export function validateCoachEvidence(item: CoachEvidenceItem): string[] {
  const errors: string[] = [];
  if (!item.id.trim()) errors.push("evidence.id is required");
  if (!item.statement.trim()) errors.push(`${item.id || "evidence"}: statement is required`);
  if (item.confidence !== null && (!Number.isFinite(item.confidence) || item.confidence < 0 || item.confidence > 1)) {
    errors.push(`${item.id || "evidence"}: confidence must be between 0 and 1`);
  }
  if (item.sourceUrl && !/^https?:\/\//i.test(item.sourceUrl)) {
    errors.push(`${item.id || "evidence"}: sourceUrl must be http(s)`);
  }

  if (["PLAYER_STATEMENT", "OBSERVED_BEHAVIOR", "OBSERVED_PATTERN", "VERIFIED_GAME_FACT", "SOURCE_BACKED_FACT"].includes(item.kind) && !hasSource(item)) {
    errors.push(`${item.id || "evidence"}: ${item.kind} requires a source reference`);
  }
  if (item.kind === "VERIFIED_GAME_FACT" && item.verificationStatus !== "verified") {
    errors.push(`${item.id || "evidence"}: VERIFIED_GAME_FACT must be verified`);
  }
  if (item.kind === "UNVERIFIED_CANDIDATE" && item.verificationStatus === "verified") {
    errors.push(`${item.id || "evidence"}: UNVERIFIED_CANDIDATE cannot be verified`);
  }
  return errors;
}

function validateEvidenceReferences(
  items: Array<CoachFinding | CoachDrill>,
  evidenceIds: Set<string>,
  label: string,
): string[] {
  const errors: string[] = [];
  for (const item of items) {
    for (const evidenceId of item.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) errors.push(`${label}.${item.id}: unknown evidence ${evidenceId}`);
    }
  }
  return errors;
}

export function validateCoachAnalysisResult(result: CoachAnalysisResult): string[] {
  const errors = result.evidence.flatMap(validateCoachEvidence);
  const evidenceIds = new Set<string>();
  for (const item of result.evidence) {
    if (evidenceIds.has(item.id)) errors.push(`duplicate evidence id: ${item.id}`);
    evidenceIds.add(item.id);
  }
  errors.push(...validateEvidenceReferences(result.strengths, evidenceIds, "strengths"));
  errors.push(...validateEvidenceReferences(result.priorityIssues, evidenceIds, "priorityIssues"));
  errors.push(...validateEvidenceReferences(result.drills, evidenceIds, "drills"));
  return errors;
}

function personaLead(persona: CoachPersona): string {
  if (persona.id === "competitive") return "優先度の高い修正点から確認します。";
  if (persona.id === "supportive") return "次の対戦で試しやすいポイントに絞って確認します。";
  if (persona.id === "research") return "根拠・Patch・未確認事項を分けて確認します。";
  return "根拠を保ったまま、良かった点と改善点を整理します。";
}

export function formatCoachAnalysis(
  result: CoachAnalysisResult,
  personaId: CoachPersonaId | string = DEFAULT_COACH_PERSONA_ID,
): CoachFormattedResponse {
  const errors = validateCoachAnalysisResult(result);
  if (errors.length) {
    throw new Error(`Invalid CoachAnalysisResult: ${errors.join("; ")}`);
  }

  const persona = getCoachPersona(personaId);
  return {
    persona,
    lead: personaLead(persona),
    sectionOrder: [...persona.feedbackOrder],
    summary: result.summary,
    strengths: result.strengths.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    priorityIssues: result.priorityIssues.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    drills: result.drills.map((item) => ({ ...item, steps: [...item.steps], evidenceIds: [...item.evidenceIds] })),
    evidence: result.evidence.map((item) => ({ ...item })),
    uncertainty: [...result.uncertainty],
    nextActions: [...result.nextActions],
  };
}
