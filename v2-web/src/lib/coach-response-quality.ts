import type { CoachComposedAnswer } from "@/lib/coach-answer-composer";
import type { CoachEvidenceItem } from "@/lib/coach-foundation";

const INTERNAL_ENUM = /\b(?:PLAYER_STATEMENT|OBSERVED_BEHAVIOR|OBSERVED_PATTERN|AI_INFERENCE|SOURCE_BACKED_FACT|VERIFIED_GAME_FACT|UNVERIFIED_CANDIDATE|PATCH_(?:MATCH|COMPATIBLE|UNKNOWN|STALE|NOT_APPLICABLE))\b/;
const RAW_IDENTIFIER = /\b(?:user_id|request_id|service_role|[0-9a-f]{8}-[0-9a-f-]{27,})\b/i;
const HARD_CONCLUSION = /(?:確定|断定|間違いなく|必ず正しい)/;

export function validateNaturalJapaneseText(text: string): string[] {
  const errors: string[] = [];
  if (INTERNAL_ENUM.test(text)) errors.push("internal enum is exposed");
  if (RAW_IDENTIFIER.test(text)) errors.push("forbidden raw identifier is exposed");
  if (/こちらを使用して|〜|利用可能となります/.test(text)) errors.push("translation-like or developer-facing copy");
  if (/情報源を開く|リンクを開く/.test(text)) errors.push("ambiguous source CTA");
  if ((text.match(/使用/g) ?? []).length >= 3) errors.push("使用 is repeated excessively");
  if (text.length > 180) errors.push("sentence is too long");
  return errors;
}

export function validateCoachResponseQuality(answer: CoachComposedAnswer, evidence: CoachEvidenceItem[]): string[] {
  const errors: string[] = [];
  const byId = new Map(evidence.map((item) => [item.id, item]));
  const visible = [answer.lead, answer.summary, ...answer.sections.flatMap((section) => [section.title, ...section.items.flatMap((item) => [item.title ?? "", item.text, ...item.details])])];
  for (const text of visible) errors.push(...validateNaturalJapaneseText(text).map((error) => `${error}: ${text.slice(0, 40)}`));
  for (const section of answer.sections) for (const item of section.items) {
    const sources = item.evidenceIds.map((id) => byId.get(id)).filter((value): value is CoachEvidenceItem => Boolean(value));
    if (/検証済み|確認済みの事実/.test(`${item.title ?? ""} ${item.text}`) && !sources.some((source) => source.kind === "VERIFIED_GAME_FACT" && source.verificationStatus === "verified")) errors.push(`${item.id}: unsupported verified wording`);
    if (/本人の発言|本人は/.test(`${item.title ?? ""} ${item.text}`) && sources.some((source) => source.kind === "AI_INFERENCE")) errors.push(`${item.id}: AI inference presented as player statement`);
  }
  for (const item of evidence) {
    if (item.patchStatus === "PATCH_STALE" && !answer.uncertainties.some((text) => text.includes(item.statement) && text.includes("古いPatch"))) errors.push(`${item.id}: missing stale Patch uncertainty`);
  }
  if (answer.uncertainties.some((text) => /競合|一致していない|結論は保留/.test(text)) && visible.some((text) => HARD_CONCLUSION.test(text))) errors.push("conflicting sources received a hard conclusion");
  return [...new Set(errors)];
}
