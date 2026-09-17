import type { VideoSummary } from "@/lib/event-media";
import { normalizeIntentText, parseVideoIntent, type VideoIntent } from "@/lib/video-intent";

export type VideoSort = "recommended" | "newest" | "oldest" | "view_count" | "favorite" | "unwatched" | "watched" | "shortest" | "longest";

export type VideoFilters = {
  query: string;
  events: Set<string>;
  players: Set<string>;
  characters: Set<string>;
  controls: Set<string>;
  categories: Set<string>;
  levels: Set<string>;
  languages: Set<string>;
  modes: Set<"guide" | "match">;
  preference: Set<"favorite" | "watched" | "unwatched">;
};

export const VIDEO_CATEGORY_LABELS: Record<string, string> = {
  combo: "コンボ",
  setup: "セットプレイ",
  setplay: "セットプレイ",
  neutral: "立ち回り",
  counter: "対策",
  torikore: "とりこれ",
  oki: "起き攻め", pressure: "連携", sa2: "SA2", lethal: "リーサル",
  max_damage_combo: "最大コンボ", corner: "画面端", defense: "防御", anti_air: "対空",
  projectile: "弾", line_management: "ライン管理", hadoken: "波動拳", shoryuken: "昇龍拳",
  crouching_mk: "中足", drive_rush: "Drive Rush",
  guide: "ガイド",
  official_guide: "公式ガイド",
  tournament: "大会",
  match: "対戦",
};

export const VIDEO_LANGUAGE_LABELS: Record<string, string> = { ja: "日本語", en: "英語", other: "その他" };
export const VIDEO_CONTROL_LABELS: Record<string, string> = { classic: "クラシック", modern: "モダン" };
export const VIDEO_LEVEL_LABELS: Record<string, string> = { beginner: "初心者", intermediate: "中級者", advanced: "上級者" };

export function normalizeVideoText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/[\s・_\-]+/g, "");
}

function includesAny(values: string[], selected: Set<string>) {
  return selected.size === 0 || values.some((value) => selected.has(value));
}

function modeValues(video: VideoSummary): Array<"guide" | "match"> {
  const type = video.videoType?.toLowerCase() ?? "";
  const values: Array<"guide" | "match"> = [];
  if (["guide", "official_guide"].includes(type)) values.push("guide");
  if (["match", "tournament"].includes(type)) values.push("match");
  return values;
}

const ENTITY_ALIASES: Record<string, string[]> = {
  jp: ["jp", "ジェイピー", "じぇいぴー"], ryu: ["ryu", "リュウ", "りゅう"],
  sho: ["翔", "sho"], tokido: ["ときど", "tokido"], ryusei: ["りゅうせい", "ryusei"], kisaragi_ren: ["如月れん"],
  capcom_cup: ["capcom cup", "カプコンカップ", "cc"], sfl: ["sfl"], evo: ["evo"], world_warrior: ["world warrior", "ワールドウォリアー"],
};

function matchesEntity(values: string[], ids: Set<string>) {
  if (!ids.size) return true;
  const normalizedValues = values.map(normalizeIntentText);
  return [...ids].some((id) => (ENTITY_ALIASES[id] ?? [id]).some((alias) => normalizedValues.includes(normalizeIntentText(alias))));
}

export function videoMatchesIntent(video: VideoSummary, intent: VideoIntent): boolean {
  const categories = video.categories.length ? video.categories : video.videoType ? [video.videoType] : [];
  const haystack = normalizeIntentText([video.title, video.description, video.channelName].filter(Boolean).join(" "));
  return matchesEntity(video.characters, intent.characters)
    && matchesEntity(video.players, intent.players)
    && matchesEntity(video.events, intent.events)
    && includesAny(categories, intent.categories)
    && includesAny(video.level === "unknown" ? [] : [video.level], intent.levels)
    && includesAny(modeValues(video), intent.modes)
    && includesAny(video.controlTypes, intent.controls)
    && includesAny(video.language ? [video.language] : [], intent.languages)
    && intent.remainingTerms.every((term) => haystack.includes(normalizeIntentText(term)));
}

export function filterVideos(
  videos: VideoSummary[],
  filters: VideoFilters,
  favorites: Set<string>,
  watched: Set<string>,
) {
  const intent = parseVideoIntent(filters.query);
  return videos.filter((video) => {
    const preferenceMatches = filters.preference.size === 0 || [
      filters.preference.has("favorite") && favorites.has(video.id),
      filters.preference.has("watched") && watched.has(video.id),
      filters.preference.has("unwatched") && !watched.has(video.id),
    ].some(Boolean);
    return videoMatchesIntent(video, intent)
      && includesAny(video.events, filters.events)
      && includesAny(video.players, filters.players)
      && includesAny(video.characters, filters.characters)
      && includesAny(video.controlTypes, filters.controls)
      && includesAny(video.categories.length ? video.categories : video.videoType ? [video.videoType] : [], filters.categories)
      && includesAny(video.level === "unknown" ? [] : [video.level], filters.levels)
      && includesAny(video.language ? [video.language] : [], filters.languages)
      && includesAny(modeValues(video), filters.modes)
      && preferenceMatches;
  });
}

export function sortVideos(videos: VideoSummary[], sort: VideoSort, favorites: Set<string>, watched: Set<string>) {
  const time = (video: VideoSummary) => video.publishedAt ? new Date(video.publishedAt).getTime() : 0;
  const duration = (video: VideoSummary) => video.durationSeconds ?? Number.POSITIVE_INFINITY;
  return [...videos].sort((a, b) => {
    if (sort === "oldest") return time(a) - time(b);
    if (sort === "favorite") return Number(favorites.has(b.id)) - Number(favorites.has(a.id)) || time(b) - time(a);
    if (sort === "unwatched") return Number(watched.has(a.id)) - Number(watched.has(b.id)) || time(b) - time(a);
    if (sort === "watched") return Number(watched.has(b.id)) - Number(watched.has(a.id)) || time(b) - time(a);
    if (sort === "shortest") return duration(a) - duration(b) || time(b) - time(a);
    if (sort === "longest") return (b.durationSeconds ?? -1) - (a.durationSeconds ?? -1) || time(b) - time(a);
    if (sort === "view_count") return (b.viewCount ?? -1) - (a.viewCount ?? -1) || time(b) - time(a);
    if (sort === "recommended") return recommendationScore(b) - recommendationScore(a) || time(b) - time(a) || a.id.localeCompare(b.id);
    return time(b) - time(a) || a.id.localeCompare(b.id);
  });
}

export function recommendationScore(video: VideoSummary): number {
  const published = video.publishedAt ? new Date(video.publishedAt).getTime() : 0;
  const ageDays = published ? Math.max(0, (Date.now() - published) / 86_400_000) : Number.POSITIVE_INFINITY;
  const recency = Number.isFinite(ageDays) ? 20 * Math.pow(0.5, ageDays / 180) : 0;
  const popularity = video.viewCount === null ? 0 : Math.min(15, Math.log10(video.viewCount + 1) * 3);
  const relevance = Math.min(35, (video.characters.length * 12) + (video.players.length * 8) + (video.events.length * 5));
  const completeness = [video.channelName, video.durationSeconds, video.language, video.level !== "unknown", video.categories.length].filter(Boolean).length * 2;
  return relevance + recency + popularity + completeness;
}

export function formatVideoDuration(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const remaining = whole % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}
