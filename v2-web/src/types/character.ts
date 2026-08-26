export type SourceReference = {
  id: string;
  title: string;
  url: string;
  publisher: string | null;
  sourceType: string;
  relationship: string;
};

export type CharacterSummary = {
  id: string;
  slug: string;
  name: string;
  nameEn: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  difficulty: number | null;
  rangeLabel: string | null;
  archetypeLabel: string | null;
  releaseDate: string | null;
  updatedAt: string | null;
};

export type CharacterGuideSection = {
  id: string;
  sectionKey: string;
  title: string;
  body: string;
  sortOrder: number;
};

export type CharacterDetail = CharacterSummary & {
  strengthsSummary: string | null;
  weaknessesSummary: string | null;
  guideSections: CharacterGuideSection[];
  sources: SourceReference[];
};

export const CHARACTER_SECTION_KEYS = [
  "overview",
  "moves",
  "combos",
  "setups",
  "matchups",
  "training",
  "players",
  "videos",
] as const;

export type CharacterSectionKey = (typeof CHARACTER_SECTION_KEYS)[number];
