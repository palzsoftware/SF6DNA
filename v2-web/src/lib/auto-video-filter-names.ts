import "server-only";
import { listCharacters } from "@/lib/characters";
import { listPlayers } from "@/lib/players";

/** Resolve exact public identities before calling external search; never use raw URL text. */
export async function autoVideoFilterNames(filters: {
  playerId?: string | null; characterId?: string | null;
  tournamentId?: string | null; player?: string | null; invalidFilter: boolean;
}): Promise<string[] | null> {
  if (filters.invalidFilter || filters.tournamentId) return null;
  try {
    const names: string[] = [];
    if (filters.playerId || filters.player) {
      const players = await listPlayers();
      const matches = players.filter(row => filters.playerId
        ? row.id === filters.playerId : row.displayName === filters.player);
      if (matches.length !== 1) return null;
      names.push(matches[0].displayName);
    }
    if (filters.characterId) {
      const matches = (await listCharacters()).filter(row => row.id === filters.characterId);
      if (matches.length !== 1) return null;
      names.push(matches[0].name);
    }
    return names;
  } catch { return null; }
}

/** Preserve the exact resolved player name; use stored English character names only. */
export async function autoVideoEnglishNames(names: readonly string[], characterId?: string | null): Promise<string[]> {
  if (!characterId) return [...names];
  try {
    const matches = (await listCharacters()).filter(row => row.id === characterId);
    if (matches.length !== 1) return [...names];
    const character = matches[0];
    return names.map(name => name === character.name ? character.nameEn || name : name);
  } catch { return [...names]; }
}
