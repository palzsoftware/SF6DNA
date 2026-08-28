export type PlayerSummary = {
  id: string;
  slug: string;
  displayName: string;
  playerType: string | null;
  teamName: string | null;
  countryCode: string | null;
  imageUrl: string | null;
};

export type PlayerCharacter = {
  characterId: string;
  characterSlug: string;
  characterName: string;
  role: string;
};

export type PlayerSource = {
  id: string;
  title: string;
  url: string;
  publisher: string | null;
  sourceType: string;
  relationship: string;
};

export type PlayerDetail = PlayerSummary & {
  realName: string | null;
  region: string | null;
  bio: string | null;
  youtubeUrl: string | null;
  twitchUrl: string | null;
  xUrl: string | null;
  websiteUrl: string | null;
  characters: PlayerCharacter[];
  sources: PlayerSource[];
};
