export type DiagnosisOption = {
  id: string;
  label: string;
  value: string;
  scorePayload: Record<string, number>;
};

export type DiagnosisQuestion = {
  id: string;
  prompt: string;
  helpText: string | null;
  sortOrder: number;
  options: DiagnosisOption[];
};

export type DiagnosisDefinition = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  questionCount: number;
  questions: DiagnosisQuestion[];
};
