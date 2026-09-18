export type CharacterDetailV2FallbackSection =
  | "moves"
  | "combos"
  | "setups"
  | "sequences"
  | "videos"
  | "players"
  | "sources";

const fallbackCopy: Record<CharacterDetailV2FallbackSection, string> = {
  moves: "技データは未掲載です。",
  combos: "コンボは未掲載です。",
  setups: "セットプレイは未掲載です。",
  sequences: "連携・対策は未掲載です。",
  videos: "関連動画は未掲載です。",
  players: "関連プレイヤーは未掲載です。",
  sources: "参考リンクは未掲載です。",
};

export function getCharacterDetailV2Fallback(section: CharacterDetailV2FallbackSection) {
  return fallbackCopy[section];
}

export function hasRenderableCharacterDetailV2Data<T>(items: T[] | null | undefined) {
  return Array.isArray(items) && items.length > 0;
}
