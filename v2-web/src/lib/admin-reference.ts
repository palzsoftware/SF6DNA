export const REFERENCE_KINDS = ["players", "tournaments", "videos", "glossary"] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export const REFERENCE_META: Record<ReferenceKind, { label: string; table: string; titleColumn: string; publicPath: string }> = {
  players: { label: "プレイヤー", table: "players", titleColumn: "display_name", publicPath: "/players" },
  tournaments: { label: "大会", table: "tournaments", titleColumn: "name", publicPath: "/tournaments" },
  videos: { label: "動画", table: "videos", titleColumn: "title", publicPath: "/videos" },
  glossary: { label: "用語", table: "glossary_terms", titleColumn: "term", publicPath: "/glossary" },
};

export function isReferenceKind(value: string): value is ReferenceKind {
  return REFERENCE_KINDS.includes(value as ReferenceKind);
}
