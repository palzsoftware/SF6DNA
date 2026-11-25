import copyData from "@/data/character-copy/character-copy-20261125.json";

/** C's character copy (2026-11-25): corrected intro / strengths / weaknesses plus "最初にやること" and "詳しい解説".
 * Repo data only (no DB column yet). Every row is source-checked but not checked in the game. */
export type CharacterCopy = {
  slug: string;
  summary?: string;
  strengths?: string;
  weaknesses?: string;
  firstSteps?: string[];
  guide?: { how?: string; strong?: string; weak?: string };
  sources: { url: string; note: string }[];
  checkedOn: string;
};

const characters = (copyData as { characters: Record<string, CharacterCopy> }).characters;

export function getCharacterCopy(slug: string): CharacterCopy | null {
  return Object.prototype.hasOwnProperty.call(characters, slug) ? characters[slug] : null;
}

/** Corrected DB fields win over the DB text; anything C kept ("維持") falls back to the DB text. */
export function withCharacterCopy<T extends { slug: string; shortDescription: string | null; strengthsSummary?: string | null; weaknessesSummary?: string | null }>(character: T): T {
  const copy = getCharacterCopy(character.slug);
  if (!copy) return character;
  return {
    ...character,
    shortDescription: copy.summary ?? character.shortDescription,
    strengthsSummary: copy.strengths ?? character.strengthsSummary,
    weaknessesSummary: copy.weaknesses ?? character.weaknessesSummary,
  };
}
