export const VIDEO_PUBLIC_AVAILABILITY = ["PUBLIC_CONFIRMED", "MEMBERS_ONLY", "PRIVATE", "DELETED", "RESTRICTED", "UNKNOWN"] as const;
export type VideoPublicAvailability = (typeof VIDEO_PUBLIC_AVAILABILITY)[number];

export type RelatedVideoPublicCandidate = {
  status: string;
  availability: VideoPublicAvailability;
  availabilityCheckedAt: string | null;
  url: string;
  playerIds: string[];
};

export function isRelatedVideoPublic(candidate: RelatedVideoPublicCandidate, playerId: string): boolean {
  if (candidate.status !== "published" || candidate.availability !== "PUBLIC_CONFIRMED") return false;
  if (!candidate.availabilityCheckedAt || Number.isNaN(Date.parse(candidate.availabilityCheckedAt))) return false;
  if (!/^https:\/\//i.test(candidate.url)) return false;
  return candidate.playerIds.includes(playerId);
}
