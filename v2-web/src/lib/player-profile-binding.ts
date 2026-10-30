import {
  publicPlayerFacts,
  publicPlayerInsights,
  publicRecommendedVideos,
  type PlayerProfileIntake,
} from "@/lib/player-profile-contract";
import type { PlayerDetail } from "@/types/player";

/** Display-only payload. No name matching, registration or publication changes. */
export type PlayerProfileBinding = {
  playerId: string;
  playerSlug: string;
  profileIntake: PlayerProfileIntake;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function factRows<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value.filter(row => row !== null && typeof row === "object") : [];
}

function mergeRows<T>(existing: T[] | undefined, additions: T[]): T[] {
  const result = [...factRows(existing)];
  const seen = new Set(result.map(row => JSON.stringify(row)));
  for (const row of additions) {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      result.push({ ...row });
      seen.add(key);
    }
  }
  return result;
}

/**
 * Call only for a player already admitted by the existing public loader.
 * Source presence or a matching UUID does not authorize individual claims.
 * Existing public selectors enforce date, scope, verified and WS14 relation gates.
 */
export function bindPlayerProfileIntake<T extends PlayerDetail>(
  player: T,
  bindings: readonly PlayerProfileBinding[] = [],
  now = Date.now(),
): T {
  if (!uuidPattern.test(player.id) || !player.slug) return player;
  const matches = bindings.filter(binding => binding && binding.playerId === player.id);
  // Conflicting/duplicate identity receipts stay on hold; never pick the first one.
  if (matches.length !== 1 || matches[0].playerSlug !== player.slug) return player;
  const incoming = matches[0].profileIntake;
  if (!incoming || typeof incoming !== "object") return player;
  const additions: Required<PlayerProfileIntake> = {
    teams: publicPlayerFacts(factRows(incoming.teams), now),
    characters: publicPlayerFacts(factRows(incoming.characters), now),
    devices: publicPlayerFacts(factRows(incoming.devices), now),
    strengths: publicPlayerInsights(factRows(incoming.strengths), now),
    referencePoints: publicPlayerInsights(factRows(incoming.referencePoints), now),
    recommendedVideos: publicRecommendedVideos(factRows(incoming.recommendedVideos).filter(
      row => typeof row.title === "string" && typeof row.recommendationReason === "string",
    ), now),
  };
  if (Object.values(additions).every(rows => rows.length === 0)) return player;
  const existing = player.profileIntake;
  return {
    ...player,
    profileIntake: {
      ...existing,
      teams: mergeRows(existing?.teams, additions.teams),
      characters: mergeRows(existing?.characters, additions.characters),
      devices: mergeRows(existing?.devices, additions.devices),
      strengths: mergeRows(existing?.strengths, additions.strengths),
      referencePoints: mergeRows(existing?.referencePoints, additions.referencePoints),
      recommendedVideos: mergeRows(existing?.recommendedVideos, additions.recommendedVideos),
    },
  };
}
