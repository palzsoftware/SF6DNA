export type KnowledgeListItem = {
  id: string;
  slug: string;
  title: string;
  characterName: string | null;
  summary: string | null;
  difficulty: number | null;
};

export type KnowledgeCategory = "combo" | "setup" | "sequence" | "counter" | "training";
