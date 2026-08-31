export type KnowledgeListItem = {
  id: string;
  slug: string;
  title: string;
  characterName: string | null;
  summary: string | null;
  difficulty: number | null;
};

export type TrainingListItem = KnowledgeListItem & {
  characterSlug: string | null;
  trainingType: string | null;
  level: string | null;
  durationMinutes: number | null;
};

export type KnowledgeCategory = "combo" | "setup" | "sequence" | "counter" | "training";
