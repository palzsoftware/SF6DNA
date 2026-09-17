import type { VideoSummary } from "@/lib/event-media";

export type VideoSort = "newest" | "oldest" | "favorite" | "unwatched" | "watched" | "shortest" | "longest";

export type VideoFilters = {
  query: string;
  events: Set<string>;
  players: Set<string>;
  characters: Set<string>;
  controls: Set<string>;
  categories: Set<string>;
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
  torikore: "トリコレ",
  guide: "ガイド",
  official_guide: "公式ガイド",
  tournament: "大会",
  match: "対戦",
};

export const VIDEO_LANGUAGE_LABELS: Record<string, string> = { ja: "日本語", en: "英語", other: "その他" };
export const VIDEO_CONTROL_LABELS: Record<string, string> = { classic: "クラシック", modern: "モダン" };

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

export function filterVideos(
  videos: VideoSummary[],
  filters: VideoFilters,
  favorites: Set<string>,
  watched: Set<string>,
) {
  const query = normalizeVideoText(filters.query);
  return videos.filter((video) => {
    const haystack = normalizeVideoText([
      video.title,
      video.description,
      video.channelName,
      video.videoType,
      ...video.events,
      ...video.characters,
      ...video.players,
    ].filter(Boolean).join(" "));
    const preferenceMatches = filters.preference.size === 0 || [
      filters.preference.has("favorite") && favorites.has(video.id),
      filters.preference.has("watched") && watched.has(video.id),
      filters.preference.has("unwatched") && !watched.has(video.id),
    ].some(Boolean);
    return (!query || haystack.includes(query))
      && includesAny(video.events, filters.events)
      && includesAny(video.players, filters.players)
      && includesAny(video.characters, filters.characters)
      && includesAny(video.controlTypes, filters.controls)
      && includesAny(video.videoType ? [video.videoType] : [], filters.categories)
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
    return time(b) - time(a);
  });
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
