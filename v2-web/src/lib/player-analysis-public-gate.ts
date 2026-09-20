import type { PlayerAnalysisItem } from "@/lib/player-analysis";

export type PlayerAnalysisPublicGateInput = {
  playerId: string;
  playerPublished: boolean;
  identityConflict: boolean;
  items: PlayerAnalysisItem[];
};

export type PlayerAnalysisPublicGateResult = { publishable: boolean; reasons: string[] };

export function canPublishPlayerAnalysis(input: PlayerAnalysisPublicGateInput): PlayerAnalysisPublicGateResult {
  const reasons: string[] = [];
  if (!input.playerPublished) reasons.push("player_not_published");
  if (input.identityConflict) reasons.push("identity_conflict");
  if (!input.items.length) reasons.push("analysis_missing");

  const evidence = input.items.flatMap((item) => item.evidence);
  if (evidence.some((item) => item.playerId !== input.playerId)) reasons.push("non_exact_player_evidence");
  if (evidence.some((item) => item.sourceType === "internal" || item.sourceReliability === "internal_candidate")) reasons.push("non_public_source");
  const publicSources = new Set(evidence.flatMap((item) => item.sourceUrl && /^https:\/\//i.test(item.sourceUrl) ? [item.sourceUrl] : []));
  if (publicSources.size < 2) reasons.push("insufficient_public_sources");
  if (evidence.length && evidence.every((item) => item.kind === "AI_INFERENCE")) reasons.push("inference_only");
  return { publishable: reasons.length === 0, reasons };
}
