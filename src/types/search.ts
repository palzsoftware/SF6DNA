export type SearchEntityType =
  | "character"
  | "move"
  | "combo"
  | "setup"
  | "sequence"
  | "counter"
  | "training"
  | "player"
  | "tournament"
  | "video"
  | "glossary";

export type SearchResultItem = {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string | null;
  href: string;
  matchedBy: "name" | "alias" | "content";
};
