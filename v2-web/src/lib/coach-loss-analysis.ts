export type LossAnalysisInput = {
  playerCharacter: string;
  opponentCharacter: string;
  result: "loss" | "win" | "";
  problemScene: string;
  selfNoticedMistake: string;
  notes: string;
};

export type LossAnalysisHold = {
  status: "HELD_FOR_INSUFFICIENT_EVIDENCE";
  observed: string[];
  hypothesis: string | null;
  nextPractice: null;
  nextQuestion: string;
  errors: string[];
};

const limits = {
  playerCharacter: 80,
  opponentCharacter: 80,
  problemScene: 500,
  selfNoticedMistake: 300,
  notes: 500,
} as const;

export function holdLossAnalysis(input: LossAnalysisInput): LossAnalysisHold {
  const errors: string[] = [];
  for (const [key, limit] of Object.entries(limits) as Array<[keyof typeof limits, number]>) {
    if (input[key].trim().length > limit) errors.push(`${key} exceeds ${limit} characters`);
  }
  if (!input.playerCharacter.trim()) errors.push("playerCharacter is required");
  if (!input.opponentCharacter.trim()) errors.push("opponentCharacter is required");
  if (input.result !== "loss" && input.result !== "win") errors.push("result is required");
  if (!input.problemScene.trim()) errors.push("problemScene is required");
  if (errors.length) return {
    status: "HELD_FOR_INSUFFICIENT_EVIDENCE",
    observed: [], hypothesis: null, nextPractice: null,
    nextQuestion: "入力内容を確認してください。", errors,
  };

  const observed = [
    `本人の記録: ${input.playerCharacter.trim()} 対 ${input.opponentCharacter.trim()}、${input.result === "loss" ? "負け" : "勝ち"}`,
    `本人が困った場面: ${input.problemScene.trim()}`,
  ];
  if (input.notes.trim()) observed.push(`本人の補足: ${input.notes.trim()}`);
  return {
    status: "HELD_FOR_INSUFFICIENT_EVIDENCE",
    observed,
    hypothesis: input.selfNoticedMistake.trim() ? `本人の仮説: ${input.selfNoticedMistake.trim()}` : null,
    nextPractice: null,
    nextQuestion: "この場面のリプレイで、相手の行動と自分の入力が分かる時刻はありますか？",
    errors: [],
  };
}
