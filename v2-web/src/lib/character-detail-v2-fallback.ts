export type CharacterDetailV2FallbackSection =
  | "moves"
  | "combos"
  | "setups"
  | "sequences"
  | "videos"
  | "players"
  | "sources";

const fallbackCopy: Record<CharacterDetailV2FallbackSection, string> = {
  moves: "表示できる技データはありません。",
  combos: "確認対象のコンボはありません。",
  setups: "確認対象のセットプレイはありません。",
  sequences: "確認対象の連携・対策はありません。",
  videos: "表示できる関連動画はありません。",
  players: "表示できる関連プレイヤーはありません。",
  sources: "表示できる情報源はありません。",
};

export function getCharacterDetailV2Fallback(section: CharacterDetailV2FallbackSection) {
  return fallbackCopy[section];
}

export function hasRenderableCharacterDetailV2Data<T>(items: T[] | null | undefined) {
  return Array.isArray(items) && items.length > 0;
}
