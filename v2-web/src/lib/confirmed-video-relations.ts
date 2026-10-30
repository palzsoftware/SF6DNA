import type { VideoSummary } from "@/lib/event-media";
import { safeExternalUrl } from "@/lib/safe-external-url";

export type ConfirmedVideoRelation = {
  videoId: string;
  entityType: "player" | "tournament";
  entityId: string;
  matchId?: string;
  characterId?: string;
  evidenceId: string;
  sourceUrl: string;
  status: "CONFIRMED";
  publishApproved: true;
};

// No Player/Tournament relation has been admitted for public use yet.
// Research archives and roster identities do not establish appearances.
export const PUBLIC_CONFIRMED_VIDEO_RELATIONS: readonly ConfirmedVideoRelation[] = [];

// Use the same evidence gate for projection, candidate IDs and unresolved state.
export function isEligibleConfirmedVideoRelation(proof: ConfirmedVideoRelation): boolean {
  return Boolean(proof && typeof proof.videoId === "string" && proof.videoId.trim()
    && (proof.entityType === "player" || proof.entityType === "tournament")
    && typeof proof.entityId === "string" && proof.entityId.trim()
    && proof.status === "CONFIRMED" && proof.publishApproved === true
    && typeof proof.evidenceId === "string" && proof.evidenceId.trim()
    && typeof proof.sourceUrl === "string" && safeExternalUrl(proof.sourceUrl));
}

export function confirmedVideoIdsForQuery(
  proofs: readonly ConfirmedVideoRelation[],
  query: { playerId?: string; characterId?: string; tournamentId?: string },
): string[] {
  const accepted = proofs.filter(isEligibleConfirmedVideoRelation);
  const ids = Array.from(new Set(accepted.map(proof => proof.videoId)));
  return ids.filter(videoId => {
    const players = accepted.filter(proof => proof.videoId === videoId && proof.entityType === "player"
      && (!query.playerId || proof.entityId === query.playerId));
    const tournaments = accepted.filter(proof => proof.videoId === videoId && proof.entityType === "tournament"
      && (!query.tournamentId || proof.entityId === query.tournamentId));
    if (query.playerId && !players.length) return false;
    if (query.tournamentId && !tournaments.length) return false;
    const needsBinding = (query.playerId && query.characterId)
      || (query.tournamentId && (query.playerId || query.characterId));
    if (!needsBinding) return true;
    // These IDs are candidates only. Published DB bindings and final projection
    // must still validate the same participant/match after retrieval.
    return players.some(player => typeof player.matchId === "string" && player.matchId.trim()
      && typeof player.characterId === "string" && player.characterId.trim()
      && (!query.characterId || player.characterId === query.characterId)
      && (!query.tournamentId || tournaments.some(tournament =>
        (!tournament.matchId || tournament.matchId === player.matchId)
        && (!tournament.characterId || tournament.characterId === player.characterId))));
  });
}

export function applyConfirmedVideoRelations(video: VideoSummary, proofs: readonly ConfirmedVideoRelation[]): VideoSummary {
  const accepted = proofs.filter(p => isEligibleConfirmedVideoRelation(p) && p.videoId === video.id);
  const refs = video.entityRefs;
  if (!refs) return { ...video, players: [], events: [], entityRefs: { characters: [], players: [], tournaments: [] }, matchBindings: [] };
  const players = refs.players.filter(ref => accepted.some(p => p.entityType === "player" && p.entityId === ref.id));
  const tournaments = refs.tournaments.filter(ref => accepted.some(p => p.entityType === "tournament" && p.entityId === ref.id));
  const matchBindings = (video.matchBindings ?? []).filter(binding => accepted.some(p => p.entityType === "player"
    && p.entityId === binding.playerId && p.matchId === binding.matchId && p.characterId === binding.characterId));
  return { ...video, players: players.map(r => r.label), events: tournaments.map(r => r.label),
    entityRefs: { characters: refs.characters, players, tournaments }, matchBindings };
}
