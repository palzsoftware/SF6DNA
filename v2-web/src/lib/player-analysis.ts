import type { CoachEvidenceItem, CoachEvidenceKind } from "@/lib/coach-foundation";

export const PLAYER_ANALYSIS_CATEGORIES = [
  "strength",
  "playstyle",
  "what_to_learn",
  "decision_tendency",
  "similar_player",
  "complementary_player",
] as const;

export type PlayerAnalysisCategory = (typeof PLAYER_ANALYSIS_CATEGORIES)[number];

export const PLAYER_ANALYSIS_EVIDENCE_KINDS = [
  "PLAYER_STATEMENT",
  "OBSERVED_BEHAVIOR",
  "OBSERVED_PATTERN",
  "AI_INFERENCE",
  "SOURCE_BACKED_FACT",
] as const satisfies readonly CoachEvidenceKind[];

export type PlayerAnalysisItem = {
  id: string;
  category: PlayerAnalysisCategory;
  title: string;
  detail: string;
  evidence: CoachEvidenceItem[];
};

export function playerAnalysisCategoryLabel(category: PlayerAnalysisCategory): string {
  const labels: Record<PlayerAnalysisCategory, string> = {
    strength: "強み",
    playstyle: "プレイスタイルの特徴",
    what_to_learn: "参考にしたいポイント",
    decision_tendency: "判断の傾向",
    similar_player: "比較して学べるプレイヤー",
    complementary_player: "補完して学べるプレイヤー",
  };
  return labels[category];
}

export function playerAnalysisEvidenceLabel(kind: CoachEvidenceKind): string {
  const labels: Partial<Record<CoachEvidenceKind, string>> = {
    PLAYER_STATEMENT: "本人発言",
    OBSERVED_BEHAVIOR: "試合から確認できる行動",
    OBSERVED_PATTERN: "複数試合で見られる傾向",
    AI_INFERENCE: "AIによる分析",
    SOURCE_BACKED_FACT: "出典確認済み情報",
  };
  return labels[kind] ?? "Player分析には使用しないEvidence";
}

function playerAnalysisHasSource(evidence: CoachEvidenceItem): boolean {
  return Boolean(evidence.sourceId?.trim() || evidence.sourceUrl?.trim());
}

export function validatePlayerAnalysisItem(item: PlayerAnalysisItem): string[] {
  const errors: string[] = [];
  if (!item.id.trim()) errors.push("player analysis id is required");
  if (!item.title.trim()) errors.push(`${item.id || "player analysis"}: title is required`);
  if (!item.detail.trim()) errors.push(`${item.id || "player analysis"}: detail is required`);
  if (!item.evidence.length) errors.push(`${item.id || "player analysis"}: evidence is required`);

  for (const evidence of item.evidence) {
    if (!(PLAYER_ANALYSIS_EVIDENCE_KINDS as readonly string[]).includes(evidence.kind)) {
      errors.push(`${item.id || "player analysis"}: unsupported player-analysis evidence kind ${evidence.kind}`);
      continue;
    }

    if (evidence.kind === "AI_INFERENCE") {
      if (evidence.verificationStatus === "verified") {
        errors.push(`${item.id || "player analysis"}: AI_INFERENCE cannot be presented as verified`);
      }
      continue;
    }

    if (evidence.kind === "SOURCE_BACKED_FACT" && evidence.verificationStatus === "verified") {
      errors.push(`${item.id || "player analysis"}: SOURCE_BACKED_FACT cannot be presented as verified`);
    }

    if (!playerAnalysisHasSource(evidence)) {
      errors.push(`${item.id || "player analysis"}: ${evidence.kind} requires a source reference`);
    }
  }

  return errors;
}

export function validatePlayerAnalysis(items: PlayerAnalysisItem[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) errors.push(`duplicate player analysis id: ${item.id}`);
    ids.add(item.id);
    errors.push(...validatePlayerAnalysisItem(item));
  }

  return errors;
}
