import { VIDEO_SEARCH_KINDS, videoSearchText, type VideoSearchKind } from "./auto-video-search";
import { VIDEO_LEARNING_TOPIC_LABELS, VIDEO_TARGET_RANK_LABELS } from "./video-learning";
export type VideoSearchParams = Record<string, string | string[] | undefined>;
export type VideoSearchFilters = {
  character: string; playerName: string; tournament: string;
  kind: VideoSearchKind; language: "ja" | "en"; valid: boolean;
  topic?: string; targetRank?: string; level?: string; control?: string;
};
export const VIDEO_SEARCH_TOPIC_LABELS = VIDEO_LEARNING_TOPIC_LABELS;
export const VIDEO_SEARCH_RANK_LABELS = VIDEO_TARGET_RANK_LABELS;
export const VIDEO_SEARCH_LEVEL_LABELS: Record<string, string> = { beginner: "初心者向け", intermediate: "中級者向け", advanced: "上級者向け" };
export const VIDEO_SEARCH_CONTROL_LABELS: Record<string, string> = { modern: "モダン", classic: "クラシック" };

const ENGLISH_TOPICS: Record<string, string> = {
  theory: "theory guide", neutral: "neutral guide", spacing: "spacing guide", whiff_punish: "whiff punish guide",
  line_management: "screen positioning guide", defense: "defense guide", anti_air: "anti air guide",
  resource_management: "drive SA meter management", risk_reward: "mind games risk reward",
  frame_knowledge: "frame data basics", replay_review: "replay analysis", training_method: "training method",
};

function discoverySearchTerms(filters: VideoSearchFilters): string[] {
  const groups: Array<[string | undefined, Record<string, string>, Record<string, string>]> = [
    [filters.topic, VIDEO_SEARCH_TOPIC_LABELS, ENGLISH_TOPICS],
    [filters.targetRank, VIDEO_SEARCH_RANK_LABELS, { rookie: "rookie bronze guide", silver: "silver rank guide", gold: "gold rank guide", platinum: "platinum rank guide", diamond: "diamond rank guide", master: "reach master guide" }],
    [filters.level, VIDEO_SEARCH_LEVEL_LABELS, { beginner: "beginner guide", intermediate: "intermediate guide", advanced: "advanced guide" }],
    [filters.control, VIDEO_SEARCH_CONTROL_LABELS, { modern: "modern controls", classic: "classic controls" }],
  ];
  const terms = groups.flatMap(([id, japanese, english]) => !id ? [] : [filters.language === "ja"
    ? japanese[id] : english[id] ?? `${id.toUpperCase()} guide`]);
  const chunks: string[] = [];
  for (const term of terms) {
    const last = chunks.length - 1;
    if (last >= 0 && chunks[last].length + term.length + 1 <= 60) chunks[last] += ` ${term}`;
    else chunks.push(term);
  }
  return chunks;
}
export const TOURNAMENT_SEARCH_NAMES: Record<string, string> = {
  CC: "Capcom Cup", EWC: "Esports World Cup", SFL: "Street Fighter League",
  EMEA: "EMEA", EMEAA: "EMEA", EVO: "EVO",
};
export function parseVideoSearchFilters(params: VideoSearchParams): VideoSearchFilters {
  let valid = true;
  const field = (key: string) => {
    const raw = params[key];
    if (raw === undefined) return "";
    if (typeof raw !== "string" || raw.length > 100) { valid = false; return ""; }
    const value = raw.normalize("NFKC").replace(/\s+/g, " ").trim();
    if (value.length > 40 || (value && !/^[\p{L}\p{N} ._\-]+$/u.test(value))) { valid = false; return ""; }
    return value;
  };
  const character = field("character"), playerName = field("playerName"), tournament = field("tournament");
  const kindInput = params.kind ?? "all", languageInput = params.language ?? "ja";
  const kind = typeof kindInput === "string" && VIDEO_SEARCH_KINDS.includes(kindInput as VideoSearchKind) ? kindInput as VideoSearchKind : "all";
  const language = languageInput === "en" ? "en" : "ja";
  if (kindInput !== kind || languageInput !== language) valid = false;
  const option = (key: string, labels: Record<string, string>) => {
    const raw = params[key];
    if (raw === undefined || raw === "") return "";
    if (typeof raw !== "string" || !Object.hasOwn(labels, raw)) { valid = false; return ""; }
    return raw;
  };
  const topic = option("topic", VIDEO_SEARCH_TOPIC_LABELS), targetRank = option("targetRank", VIDEO_SEARCH_RANK_LABELS);
  const level = option("level", VIDEO_SEARCH_LEVEL_LABELS), control = option("control", VIDEO_SEARCH_CONTROL_LABELS);
  return { character, playerName, tournament, kind, language, topic, targetRank, level, control, valid };
}
export function videoSearchNames(filters: VideoSearchFilters, resolved: readonly string[]): string[] | null {
  if (!filters.valid) return null;
  const tournament = TOURNAMENT_SEARCH_NAMES[filters.tournament.toUpperCase()] ?? filters.tournament;
  // Combine controlled facet terms into one name group, retaining the existing
  // query length and five-group limits used by the YouTube search adapter.
  const names = [...new Set([...resolved, filters.character, filters.playerName, tournament, ...discoverySearchTerms(filters)].filter(Boolean))];
  return videoSearchText(names, filters.kind, filters.language) ? names : null;
}
