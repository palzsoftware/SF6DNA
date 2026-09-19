import type { CoachEvidenceItem, CoachPersonaId } from "@/lib/coach-foundation";

export type UntrustedPromptData = { kind: "untrusted_user_data" | "untrusted_retrieved_data"; text: string; containedInstructionLikeText: boolean };
export type CoachPromptInput = { allowedFacts: Array<{ evidenceId: string; statement: string }>; userStatements: Array<{ evidenceId: string; statement: string }>; aiInferences: Array<{ evidenceId: string; statement: string }>; uncertainties: string[]; personaPolicy: { personaId: CoachPersonaId; mayChangeFacts: false }; prohibitedClaims: string[]; locale: "ja-JP"; userData: UntrustedPromptData | null };
export type CoachProviderDraft = { headline: string; sections: Array<{ title: string; body: string; referencedEvidenceIds: string[] }>; referencedEvidenceIds: string[] };

const INSTRUCTION_LIKE = /(?:ignore (?:all|previous)|system prompt|developer message|指示を無視|命令に従|秘密を表示|source text says)/i;
const SECRET_LIKE = /(?:sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9._-]+|service_role|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/gi;
const RAW_ID = /\b(?:user_id|request_id)\s*[:=]\s*[^\s,]+|\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi;

export function isolateUntrustedPromptData(text: string, kind: UntrustedPromptData["kind"]): UntrustedPromptData {
  const containedInstructionLikeText = INSTRUCTION_LIKE.test(text);
  return { kind, text: text.replace(SECRET_LIKE, "[REDACTED]").replace(RAW_ID, "[REDACTED]").slice(0, 500), containedInstructionLikeText };
}

export function buildCoachPromptInput({ evidence, uncertainties, personaId, userText }: { evidence: CoachEvidenceItem[]; uncertainties: string[]; personaId: CoachPersonaId; userText?: string | null }): CoachPromptInput {
  return { allowedFacts: evidence.filter((item) => ["VERIFIED_GAME_FACT", "SOURCE_BACKED_FACT", "OBSERVED_BEHAVIOR", "OBSERVED_PATTERN"].includes(item.kind)).map((item) => ({ evidenceId: item.id, statement: item.statement.slice(0, 240) })), userStatements: evidence.filter((item) => item.kind === "PLAYER_STATEMENT").map((item) => ({ evidenceId: item.id, statement: item.statement.slice(0, 240) })), aiInferences: evidence.filter((item) => item.kind === "AI_INFERENCE").map((item) => ({ evidenceId: item.id, statement: item.statement.slice(0, 240) })), uncertainties: [...uncertainties], personaPolicy: { personaId, mayChangeFacts: false }, prohibitedClaims: ["Evidenceにない事実", "生成したSource URL", "生成したPatch", "推測したMain Character・Rank・性格"], locale: "ja-JP", userData: userText ? isolateUntrustedPromptData(userText, "untrusted_user_data") : null };
}

export function validateProviderDraft(draft: CoachProviderDraft, evidence: CoachEvidenceItem[]): string[] {
  const known = new Set(evidence.map((item) => item.id));
  const errors: string[] = [];
  for (const id of draft.referencedEvidenceIds) if (!known.has(id)) errors.push(`unknown evidence reference: ${id}`);
  const text = [draft.headline, ...draft.sections.flatMap((section) => [section.title, section.body])].join(" ");
  if (/https?:\/\//.test(text)) errors.push("provider draft must not generate source URLs");
  if (/PATCH_(?:MATCH|UNKNOWN|STALE)|PLAYER_STATEMENT|AI_INFERENCE/.test(text)) errors.push("provider draft exposes internal enum");
  return errors;
}
