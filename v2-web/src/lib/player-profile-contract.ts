import { safeExternalUrl } from "@/lib/safe-external-url";

// App-layer intake only. These fields are not populated from legacy team/main columns.
export type PlayerEvidenceState = "CURRENT" | "HISTORICAL" | "PENDING" | "UNVERIFIED";
export type PlayerProfileFact = {
  label: string;
  state: PlayerEvidenceState;
  sourceUrl: string;
  sourceDate: string;
  verified: boolean;
};
export type PlayerDevice = PlayerProfileFact & {
  category: "Arcade Stick" | "Leverless" | "Pad" | "Keyboard" | "Other" | "Unknown";
  manufacturer?: string;
  productUrl?: string;
};
export type PlayerRecommendedVideo = PlayerProfileFact & {
  title: string;
  recommendationReason: string;
  published: boolean;
};
export type PlayerProfileIntake = {
  teams?: PlayerProfileFact[];
  characters?: PlayerProfileFact[];
  devices?: PlayerDevice[];
  recommendedVideos?: PlayerRecommendedVideo[];
};
export function publicPlayerFacts<T extends PlayerProfileFact>(rows: T[] = [], now = Date.now()): T[] {
  return rows.filter(row => {
    const date = Date.parse(row.sourceDate);
    return row.verified && row.label.trim() && safeExternalUrl(row.sourceUrl) &&
      Number.isFinite(date) && date <= now &&
      (row.state === "HISTORICAL" || (row.state === "CURRENT" && now - date <= 365 * 86400000));
  });
}
export function publicRecommendedVideos(rows: PlayerRecommendedVideo[] = []) {
  return publicPlayerFacts(rows).filter(row => row.published && row.title.trim() && row.recommendationReason.trim());
}
