import type { CoachEvidenceItem, CoachPersonaId } from "@/lib/coach-foundation";

export type UntrustedPromptData = { kind: "untrusted_user_data" | "untrusted_retrieved_data"; text: string; containedInstructionLikeText: boolean };
export type CoachPromptInput = { allowedFacts: Array<{ evidenceId: string; statement: string }>; userStatements: Array<{ evidenceId: string; statement: string }>; aiInferences: Array<{ evidenceId: string; statement: string }>; uncertainties: string[]; personaPolicy: { personaId: CoachPersonaId; mayChangeFacts: false }; prohibitedClaims: string[]; locale: "ja-JP"; userData: UntrustedPromptData | null };
export type CoachProviderDraft = { headline: string; sections: Array<{ title: string; body: string; referencedEvidenceIds: string[] }>; referencedEvidenceIds: string[] };

export const COACH_PROVIDER_LIMITS = { maxEvidence: 12, maxStatementLength: 240, maxUncertainties: 8, maxUserTextLength: 500, maxOutputCharacters: 4_000 } as const;

const INSTRUCTION_LIKE = /(?:ignore (?:all|previous)|system prompt|developer message|指示を無視|命令に従|秘密を表示|source text says)/i;
const SECRET_LIKE = /(?:sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9._-]+|service_role|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/gi;
const RAW_ID = /\b(?:user_id|request_id)\s*[:=]\s*[^\s,]+|\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi;

function numericGameFacts(text: string): string[] {
  return [...text.matchAll(/([+-]?\d+(?:\.\d+)?)\s*(F|ダメージ|damage)/gi)].map((match) => `${match[1]}${match[2].toLowerCase()}`);
}

export function isolateUntrustedPromptData(text: string, kind: UntrustedPromptData["kind"]): UntrustedPromptData {
  const containedInstructionLikeText = INSTRUCTION_LIKE.test(text);
  return { kind, text: text.replace(SECRET_LIKE, "[REDACTED]").replace(RAW_ID, "[REDACTED]").slice(0, 500), containedInstructionLikeText };
}

export function buildCoachPromptInput({ evidence, uncertainties, personaId, userText }: { evidence: CoachEvidenceItem[]; uncertainties: string[]; personaId: CoachPersonaId; userText?: string | null }): CoachPromptInput {
  const selected = [...new Map(evidence.map((item) => [item.id, item])).values()].slice(0, COACH_PROVIDER_LIMITS.maxEvidence);
  const project = (kinds: string[]) => selected.filter((item) => kinds.includes(item.kind)).map((item) => ({ evidenceId: item.id, statement: item.statement.replace(SECRET_LIKE, "[REDACTED]").replace(RAW_ID, "[REDACTED]").slice(0, COACH_PROVIDER_LIMITS.maxStatementLength) }));
  return { allowedFacts: project(["VERIFIED_GAME_FACT", "SOURCE_BACKED_FACT", "OBSERVED_BEHAVIOR", "OBSERVED_PATTERN"]), userStatements: project(["PLAYER_STATEMENT"]), aiInferences: project(["AI_INFERENCE"]), uncertainties: [...new Set(uncertainties)].slice(0, COACH_PROVIDER_LIMITS.maxUncertainties).map((item) => item.slice(0, COACH_PROVIDER_LIMITS.maxStatementLength)), personaPolicy: { personaId, mayChangeFacts: false }, prohibitedClaims: ["Evidenceにない事実", "生成したSource URL", "生成したPatch", "推測したMain Character・Rank・性格"], locale: "ja-JP", userData: userText ? isolateUntrustedPromptData(userText.slice(0, COACH_PROVIDER_LIMITS.maxUserTextLength), "untrusted_user_data") : null };
}

export function validateProviderDraft(draft: CoachProviderDraft, evidence: CoachEvidenceItem[], uncertainties: string[] = []): string[] {
  const known = new Set(evidence.map((item) => item.id));
  const errors: string[] = [];
  for (const id of draft.referencedEvidenceIds) if (!known.has(id)) errors.push(`unknown evidence reference: ${id}`);
  for (const section of draft.sections) for (const id of section.referencedEvidenceIds) if (!known.has(id)) errors.push(`unknown section evidence reference: ${id}`);
  const text = [draft.headline, ...draft.sections.flatMap((section) => [section.title, section.body])].join(" ");
  if (/https?:\/\//.test(text)) errors.push("provider draft must not generate source URLs");
  if (/PATCH_(?:MATCH|UNKNOWN|STALE)|PLAYER_STATEMENT|AI_INFERENCE|SOURCE_BACKED_FACT/.test(text)) errors.push("provider draft exposes internal enum");
  if (/\bPatch\s*[:：]?\s*[\w.-]+/i.test(text)) errors.push("provider draft must not generate Patch values");
  if (text.length > COACH_PROVIDER_LIMITS.maxOutputCharacters) errors.push("provider draft exceeds output limit");
  if (/(?:sk_live_|Bearer\s+|service_role|user_id|request_id|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/i.test(text)) errors.push("provider draft contains secret-like or private identifiers");
  const byId = new Map(evidence.map((item) => [item.id, item]));
  for (const section of draft.sections) {
    const sources = section.referencedEvidenceIds.map((id) => byId.get(id)).filter((item): item is CoachEvidenceItem => Boolean(item));
    if (/検証済み|確認済みの事実|確定/.test(section.body) && !sources.some((item) => item.kind === "VERIFIED_GAME_FACT" && item.verificationStatus === "verified")) errors.push("unsupported verified wording in provider draft");
    if (/本人の発言|本人は/.test(section.body) && sources.some((item) => item.kind === "AI_INFERENCE")) errors.push("AI inference presented as player statement");
    const supportedNumericFacts = new Set(sources.flatMap((item) => numericGameFacts(item.statement)));
    if (numericGameFacts(section.body).some((fact) => !supportedNumericFacts.has(fact))) errors.push("unsupported numeric game fact");
    if (sources.some((item) => item.patchStatus === "PATCH_STALE") && /確定|現行|現在/.test(section.body)) errors.push("stale Patch received a current hard claim");
  }
  if (evidence.some((item) => item.patchStatus === "PATCH_STALE") && /確定|現行の事実/.test(text)) errors.push("stale Patch hard conclusion");
  if (uncertainties.some((item) => /競合|一致していない|結論は保留/.test(item)) && /確定|断定|間違いなく/.test(text)) errors.push("conflicting evidence received a hard conclusion");
  return errors;
}
