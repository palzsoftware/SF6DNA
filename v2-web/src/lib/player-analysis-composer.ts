import { DEFAULT_COACH_PERSONA_ID, getCoachPersona, type CoachEvidenceItem, type CoachPersona, type CoachPersonaId } from "@/lib/coach-foundation";
import { coachSourceReferenceLabel, coachVerificationLabel, type CoachEvidenceSummary } from "@/lib/coach-answer-composer";
import { playerAnalysisCategoryLabel, validatePlayerAnalysis, type PlayerAnalysisCategory, type PlayerAnalysisItem } from "@/lib/player-analysis";

export type PlayerAnalysisContext = { playerId: string; displayName: string };
export type PlayerAnalysisSection = { category: PlayerAnalysisCategory; title: string; items: Array<{ id: string; title: string; detail: string; evidenceIds: string[] }> };
export type PlayerAnalysisAnswer = { player: PlayerAnalysisContext; persona: CoachPersona; summary: string; sections: PlayerAnalysisSection[]; uncertainties: string[]; evidence: CoachEvidenceSummary[] };

const CATEGORY_ORDER: readonly PlayerAnalysisCategory[] = ["strength", "playstyle", "decision_tendency", "what_to_learn", "similar_player", "complementary_player"];

function summarizeEvidence(item: CoachEvidenceItem): CoachEvidenceSummary {
  return { evidenceId: item.id, kind: item.kind, kindLabel: item.kind === "PLAYER_STATEMENT" ? "本人の発言" : item.kind === "OBSERVED_BEHAVIOR" ? "試合で確認できる行動" : item.kind === "OBSERVED_PATTERN" ? "複数試合で見られる傾向" : item.kind === "AI_INFERENCE" ? "AIによる分析" : "出典確認済み情報", verificationLabel: coachVerificationLabel(item), statement: item.statement, patch: item.patch, patchStatus: item.patchStatus, sourceReference: item.sourceUrl ? { evidenceId: item.id, label: coachSourceReferenceLabel(item), url: item.sourceUrl, patch: item.patch, sourceType: item.sourceType ?? null, sourceReliability: item.sourceReliability ?? null } : null };
}

export function composePlayerAnalysis({ playerContext, items, personaId = DEFAULT_COACH_PERSONA_ID }: { playerContext: PlayerAnalysisContext; items: PlayerAnalysisItem[]; personaId?: CoachPersonaId | string }): PlayerAnalysisAnswer {
  const errors = validatePlayerAnalysis(items);
  if (!playerContext.playerId.trim() || !playerContext.displayName.trim()) errors.push("player identity is required");
  if (errors.length) throw new Error(`Invalid PlayerAnalysis: ${errors.join("; ")}`);
  const persona = getCoachPersona(personaId);
  const categories = persona.id === "research" ? [...CATEGORY_ORDER].sort((a, b) => (a === "what_to_learn" ? 1 : b === "what_to_learn" ? -1 : 0)) : persona.id === "competitive" ? ["decision_tendency", "strength", "playstyle", "what_to_learn", "similar_player", "complementary_player"] as PlayerAnalysisCategory[] : CATEGORY_ORDER;
  const sections = categories.map((category) => ({ category, title: playerAnalysisCategoryLabel(category), items: items.filter((item) => item.category === category).map((item) => ({ id: item.id, title: item.title, detail: item.detail, evidenceIds: item.evidence.map((entry) => entry.id) })) })).filter((section) => section.items.length);
  const evidence = [...new Map(items.flatMap((item) => item.evidence).map((item) => [item.id, item])).values()];
  const uncertainties = evidence.filter((item) => item.kind === "AI_INFERENCE" || item.patchStatus === "PATCH_STALE" || item.patchStatus === "PATCH_UNKNOWN").map((item) => item.kind === "AI_INFERENCE" ? `「${item.statement}」はAIによる分析であり、本人の発言ではありません。` : `「${item.statement}」は対応Patchの追加確認が必要です。`);
  return { player: { ...playerContext }, persona, summary: items.length ? `${playerContext.displayName}選手について、確認できる根拠の範囲で整理します。` : "表示できる根拠付き分析はまだありません。", sections, uncertainties, evidence: evidence.map(summarizeEvidence) };
}
