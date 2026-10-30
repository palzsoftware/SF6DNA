import type { VideoSummary } from "@/lib/event-media";
import { PUBLISHED_VIDEO_LEARNING, type VideoLearningAnnotation } from "@/lib/video-learning-registry";

export const VIDEO_LEARNING_TOPIC_LABELS: Record<string, string> = {
  theory: "座学・考え方",
  neutral: "立ち回り・差し合い",
  spacing: "間合い管理",
  whiff_punish: "差し返し",
  line_management: "ライン管理",
  defense: "守り・切り返し",
  anti_air: "対空の考え方",
  resource_management: "ドライブ・SA管理",
  risk_reward: "読み合い・リスク管理",
  frame_knowledge: "フレームの基礎",
  replay_review: "リプレイ分析",
  training_method: "練習方法・上達法",
};

export const VIDEO_TARGET_RANK_LABELS: Record<string, string> = {
  rookie: "ルーキー〜ブロンズ向け", silver: "シルバー向け", gold: "ゴールド向け",
  platinum: "プラチナ向け", diamond: "ダイヤ向け", master: "マスター到達を目指す",
  mr1400: "MR1400向け", mr1500: "MR1500向け", mr1600: "MR1600向け",
  mr1700: "MR1700向け", mr1800: "MR1800向け", mr1900: "MR1900向け", mr2000: "MR2000向け",
};

const TOPIC_ALIASES: Record<string, readonly string[]> = {
  theory: ["座学", "考え方", "theory"], neutral: ["立ち回り", "差し合い", "neutral"],
  spacing: ["間合い", "間合い管理", "spacing"], whiff_punish: ["差し返し", "whiff punish"],
  line_management: ["ライン管理"], defense: ["防御", "守り", "切り返し"],
  anti_air: ["対空"], resource_management: ["ゲージ管理", "ドライブ管理", "sa管理"],
  risk_reward: ["読み合い", "リスク管理"], frame_knowledge: ["フレーム", "frame data"],
  replay_review: ["リプレイ分析", "リプレイ添削"], training_method: ["練習方法", "上達法"],
};

const RANK_ALIASES: Record<string, readonly string[]> = {
  platinum: ["プラチナ帯向け", "プラチナ帯", "プラチナ向け", "プラチナ", "platinum"],
  diamond: ["ダイヤモンド帯向け", "ダイヤモンド帯", "ダイヤモンド", "ダイヤ帯向け", "ダイヤ帯", "ダイヤ向け", "ダイヤ", "diamond"],
  silver: ["シルバー帯", "シルバー向け", "シルバー", "silver"],
  gold: ["ゴールド帯", "ゴールド向け", "ゴールド", "gold"],
  master: ["マスター到達", "マスターを目指す", "マスター到達向け"],
};

function matchingAnnotation(video: VideoSummary, records: readonly VideoLearningAnnotation[]) {
  return records.find(entry => entry.videoId === video.id
    && entry.expectedUrl === video.url && entry.expectedTitle === video.title);
}

// An annotation enriches an already supplied row; it cannot load a draft or
// invent a video, publication state, Player relation, or Character relation.
export function applyReviewedVideoMetadata(video: VideoSummary, records: readonly VideoLearningAnnotation[] = PUBLISHED_VIDEO_LEARNING): VideoSummary {
  const record = matchingAnnotation(video, records);
  if (!record) return video;
  return { ...video,
    categories: [...new Set([...video.categories, ...(record.categories ?? [])])],
    controlTypes: [...new Set([...video.controlTypes, ...(record.controlTypes ?? [])])]
      .filter(value => value === "classic" || value === "modern"),
    level: video.level === "unknown" ? record.level ?? "unknown" : video.level,
  };
}

export function videoLearningMetadata(video: VideoSummary, records: readonly VideoLearningAnnotation[] = PUBLISHED_VIDEO_LEARNING) {
  const record = matchingAnnotation(video, records);
  // Registered structured categories remain valid; never derive tags or target
  // ranks from a title, channel skill, description keywords, or research drafts.
  const topics = [...new Set([...video.categories, ...(video.videoType === "theory" ? ["theory"] : []), ...(record?.topics ?? [])])]
    .filter(value => Object.hasOwn(VIDEO_LEARNING_TOPIC_LABELS, value));
  if (topics.length && ["guide", "official_guide", "theory"].includes(video.videoType ?? "") && !topics.includes("theory")) topics.unshift("theory");
  const targetRanks = [...new Set(record?.targetRanks ?? [])]
    .filter(value => Object.hasOwn(VIDEO_TARGET_RANK_LABELS, value));
  return { topics, targetRanks };
}

export function extractVideoLearningIntent(input: string) {
  const topics = new Set<string>();
  const targetRanks = new Set<string>();
  let rest = input.normalize("NFKC").toLowerCase();
  // MR tokens express the requested audience, never the broadcaster's rating.
  rest = rest.replace(/(^|\s)mr\s*(1400|1500|1600|1700|1800|1900|2000)(?:\s*(?:向け|帯))?(?=\s|$)/gu, (_match, prefix: string, value: string) => {
    targetRanks.add(`mr${value}`); return prefix;
  });
  const rankAliases = Object.entries(RANK_ALIASES).flatMap(([id, values]) => values.map(alias => ({ id, alias })))
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const { id, alias } of rankAliases) {
    const pattern = new RegExp(`(^|\\s)${alias}(?=\\s|$)`, "gu");
    if (pattern.test(rest)) { targetRanks.add(id); rest = rest.replace(pattern, " "); }
  }
  const aliases = Object.entries(TOPIC_ALIASES).flatMap(([id, values]) => values.map(alias => ({ id, alias })))
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const { id, alias } of aliases) {
    const pattern = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$)`, "gu");
    if (pattern.test(rest)) { topics.add(id); rest = rest.replace(pattern, " "); }
  }
  return { topics, targetRanks, remainingText: rest.replace(/\s+/g, " ").trim() };
}
