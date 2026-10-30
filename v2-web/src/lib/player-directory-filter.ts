import { playerTypeLabel } from "@/lib/player-labels";
import type { PlayerSummary } from "@/types/player";

const normalizeSearch = (value: string) => value
  .normalize("NFKC")
  .toLocaleLowerCase("ja")
  .replace(/[\s_-]+/g, "")
  .trim();

export function playerMatchesQuery(player: PlayerSummary, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) return true;
  const fields = [
    player.displayName,
    ...player.aliases,
    player.teamName,
    player.region,
    player.countryCode,
    playerTypeLabel(player.playerType),
    ...player.characters.flatMap((character) => [character.characterName, character.characterSlug]),
  ];
  return fields.some((field) => field && normalizeSearch(field).includes(needle));
}

export type PlayerFilters = {
  teams?: string[];
  categories: string[];
  characters: string[];
};

export function playerMatchesFilters(player: PlayerSummary, filters: PlayerFilters) {
  const categoryMatch = !filters.categories.length ||
    (player.playerType !== null && filters.categories.includes(player.playerType));
  const characterMatch = !filters.characters.length || player.characters.some(
    (character) => filters.characters.includes(character.characterSlug),
  );
  const teamMatch = !filters.teams?.length || (player.teamName !== null && filters.teams.includes(player.teamName));
  return categoryMatch && characterMatch && teamMatch;
}

