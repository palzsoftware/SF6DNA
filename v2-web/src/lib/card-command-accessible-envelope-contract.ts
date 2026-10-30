/** WS12 local-only Card → command renderer accessibility boundary. */
export type CardControl = "classic" | "modern" | "unknown";
export type CardInputPath = "normal" | "manual" | "special" | "assist" | "shared" | "followup" | "unknown";
export type CommandEvidenceState = "VERIFIED" | "UNAVAILABLE_VERIFIED" | "NOT_VERIFIED" | "API_ERROR";
export type TokenizationState = "VERIFIED" | "UNSUPPORTED" | "NOT_TOKENIZED";
export type ConditionEvidence =
  | { state: "EXACT"; text: string }
  | { state: "NOT_APPLICABLE" }
  | { state: "UNKNOWN" };

export type CardCommandContext = {
  characterId: string;
  moveId: string;
  formalMoveName: string;
  control: CardControl;
  inputPath: CardInputPath;
  condition: ConditionEvidence;
  rawCommand: string | null;
  spokenCommand: string | null;
  evidenceState: CommandEvidenceState;
  tokenizationState: TokenizationState;
  officialSourceVerified: boolean;
  identityMatch: boolean;
};

export type CardCommandEnvelope = {
  characterId: string;
  moveId: string;
  formalMoveName: string;
  control: CardControl;
  inputPath: CardInputPath;
  conditionState: ConditionEvidence["state"];
  visible: string;
  accessibleName: string;
  renderMode: "ICON_SEQUENCE_CANDIDATE" | "WHOLE_RAW_FALLBACK" | "UNAVAILABLE" | "PENDING" | "API_ERROR_FALLBACK";
  reasons: string[];
  beginnerExplanation: null;
  publicationGrant: false;
};

const controlLabel: Record<CardControl, string> = {
  classic: "クラシック",
  modern: "モダン",
  unknown: "操作方式未確認",
};

const pathLabel: Record<CardInputPath, string> = {
  normal: "通常入力",
  manual: "手動入力",
  special: "必殺技ボタン入力",
  assist: "アシスト入力",
  shared: "共通入力",
  followup: "派生入力",
  unknown: "入力経路未確認",
};

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function conditionLabel(condition: ConditionEvidence): string {
  if (condition.state === "EXACT") return nonEmpty(condition.text) ? `条件、${condition.text}` : "条件未確認";
  if (condition.state === "NOT_APPLICABLE") return "条件、該当なし";
  return "条件未確認";
}

function namePrefix(row: CardCommandContext): string[] {
  return [row.formalMoveName, controlLabel[row.control], pathLabel[row.inputPath], conditionLabel(row.condition)];
}

/**
 * Keeps formal name, control, route and condition separate from the token renderer.
 * Beginner copy is intentionally excluded; it belongs to a different UI field.
 */
export function buildCardCommandEnvelope(row: CardCommandContext): CardCommandEnvelope {
  const reasons: string[] = [];
  if (!nonEmpty(row.characterId)) reasons.push("CHARACTER_ID_MISSING");
  if (!nonEmpty(row.moveId)) reasons.push("MOVE_ID_MISSING");
  if (!nonEmpty(row.formalMoveName)) reasons.push("FORMAL_MOVE_NAME_MISSING");
  if (row.control === "unknown") reasons.push("CONTROL_UNVERIFIED");
  if (row.inputPath === "unknown") reasons.push("INPUT_PATH_UNVERIFIED");
  if (!row.identityMatch) reasons.push("RELATION_UNRESOLVED");
  if (row.control === "classic" && ["special", "assist"].includes(row.inputPath)) reasons.push("CONTROL_PATH_MISMATCH");
  if (row.control === "modern" && row.inputPath === "normal") reasons.push("MODERN_PATH_UNRESOLVED");
  if (row.condition.state === "UNKNOWN" || (row.condition.state === "EXACT" && !nonEmpty(row.condition.text))) reasons.push("CONDITION_UNVERIFIED");

  const prefix = namePrefix(row);
  const raw = nonEmpty(row.rawCommand) ? row.rawCommand : null;
  const spoken = nonEmpty(row.spokenCommand) ? row.spokenCommand : raw;

  if (row.evidenceState === "API_ERROR") {
    return {
      characterId: row.characterId,
      moveId: row.moveId,
      formalMoveName: row.formalMoveName,
      control: row.control,
      inputPath: row.inputPath,
      conditionState: row.condition.state,
      visible: raw ?? "コマンド情報を取得できません",
      accessibleName: [...prefix, spoken ? `コマンド、${spoken}` : "コマンド情報を取得できません"].join("、"),
      renderMode: "API_ERROR_FALLBACK",
      reasons: [...new Set([...reasons, "API_ERROR"])],
      beginnerExplanation: null,
      publicationGrant: false,
    };
  }

  if (row.evidenceState === "UNAVAILABLE_VERIFIED") {
    const unavailableProven = row.officialSourceVerified && row.identityMatch && reasons.length === 0;
    return {
      characterId: row.characterId,
      moveId: row.moveId,
      formalMoveName: row.formalMoveName,
      control: row.control,
      inputPath: row.inputPath,
      conditionState: row.condition.state,
      visible: unavailableProven ? "使用不可" : "コマンドを確認中",
      accessibleName: [...prefix, unavailableProven ? "コマンド、使用不可" : "コマンド未確認"].join("、"),
      renderMode: unavailableProven ? "UNAVAILABLE" : "PENDING",
      reasons: unavailableProven ? reasons : [...new Set([...reasons, "UNAVAILABLE_NOT_PROVEN"])],
      beginnerExplanation: null,
      publicationGrant: false,
    };
  }

  if (row.evidenceState !== "VERIFIED" || !raw) {
    return {
      characterId: row.characterId,
      moveId: row.moveId,
      formalMoveName: row.formalMoveName,
      control: row.control,
      inputPath: row.inputPath,
      conditionState: row.condition.state,
      visible: raw ?? "コマンドを確認中",
      accessibleName: [...prefix, spoken ? `コマンド、${spoken}` : "コマンド未確認"].join("、"),
      renderMode: raw ? "WHOLE_RAW_FALLBACK" : "PENDING",
      reasons: [...new Set([...reasons, row.evidenceState !== "VERIFIED" ? "COMMAND_NOT_VERIFIED" : "RAW_COMMAND_MISSING"])],
      beginnerExplanation: null,
      publicationGrant: false,
    };
  }

  const iconAllowed = reasons.length === 0 && row.tokenizationState === "VERIFIED" && nonEmpty(row.spokenCommand);
  return {
    characterId: row.characterId,
    moveId: row.moveId,
    formalMoveName: row.formalMoveName,
    control: row.control,
    inputPath: row.inputPath,
    conditionState: row.condition.state,
    visible: raw,
    accessibleName: [...prefix, `コマンド、${spoken ?? raw}`].join("、"),
    renderMode: iconAllowed ? "ICON_SEQUENCE_CANDIDATE" : "WHOLE_RAW_FALLBACK",
    reasons: iconAllowed ? reasons : [...new Set([...reasons, "TOKEN_SEQUENCE_UNVERIFIED"])],
    beginnerExplanation: null,
    publicationGrant: false,
  };
}
