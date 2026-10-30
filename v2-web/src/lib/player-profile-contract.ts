import { safeExternalUrl } from "@/lib/safe-external-url";

// App-layer intake only. These fields are not populated from legacy team/main columns.
export type PlayerEvidenceState = "CURRENT" | "HISTORICAL" | "PENDING" | "UNVERIFIED";
export type PlayerProfileFact = {
  label: string;
  state: PlayerEvidenceState;
  sourceUrl: string;
  sourceDate: string | null;
  verified: boolean;
};
export type PlayerDevice = PlayerProfileFact & {
  category: "Arcade Stick" | "Leverless" | "Pad" | "Keyboard" | "Other" | "Unknown";
  manufacturer?: string;
  productUrl?: string;
};
export type PlayerRecommendedVideo = PlayerProfileFact & {
  // WS14-confirmed Player relation. Omitted/pending values stay hidden in PlayerProfile.
  relationConfirmed?: boolean;
  title: string;
  recommendationReason: string;
  published: boolean;
};
export type PlayerProfileIntake = {
  teams?: PlayerProfileFact[];
  characters?: PlayerProfileFact[];
  devices?: PlayerDevice[];
  recommendedVideos?: PlayerRecommendedVideo[];
  strengths?: PlayerLearningInsight[];
  referencePoints?: PlayerLearningInsight[];
};
// A source-backed summary is not a claim about the player's unspoken thoughts.
// Inferences and unapproved drafts are not valid public insight kinds.
export type PlayerLearningInsight = PlayerProfileFact & {
  kind: "SOURCE_SUPPORTED_SUMMARY" | "FIRST_PERSON_STATEMENT";
};
export function publicPlayerFacts<T extends PlayerProfileFact>(rows: T[] = [], now = Date.now()): T[] {
  return rows.filter(row => {
    if (row.verified !== true || typeof row.label !== "string" || typeof row.sourceDate !== "string") return false;
    const date = Date.parse(row.sourceDate);
    return row.label.trim() && safeExternalUrl(row.sourceUrl) &&
      Number.isFinite(date) && date <= now &&
      (row.state === "HISTORICAL" || (row.state === "CURRENT" && now - date <= 365 * 86400000));
  });
}
export function publicRecommendedVideos(rows: PlayerRecommendedVideo[] = [], now = Date.now()) {
  return publicPlayerFacts(rows, now).filter(row => row.relationConfirmed === true && row.published === true && row.title.trim() && row.recommendationReason.trim());
}
export function publicPlayerInsights(rows: PlayerLearningInsight[] = [], now = Date.now()) {
  return publicPlayerFacts(rows, now).filter(row => row.kind === "SOURCE_SUPPORTED_SUMMARY" || row.kind === "FIRST_PERSON_STATEMENT");
}
