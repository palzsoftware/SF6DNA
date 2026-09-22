import type { CharacterSummary } from "@/types/character";

type RandomSource = () => number;

export function pickRandomHeroCharacters(
  characters: CharacterSummary[],
  count = 3,
  random: RandomSource = Math.random,
) {
  const candidates = characters.filter((character) => Boolean(character.imageUrl));

  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }

  return candidates.slice(0, Math.max(0, count));
}
