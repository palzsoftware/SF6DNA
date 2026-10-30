import { applyReviewedVideoMetadata, videoLearningMetadata, VIDEO_LEARNING_TOPIC_LABELS } from "@/lib/video-learning";
import { PUBLISHED_VIDEO_LEARNING, type VideoLearningAnnotation } from "@/lib/video-learning-registry";
import { videoTournamentLabelMatches } from "@/lib/video-event-aliases";
import { uniqueVideoSummaries } from "@/lib/video-presentation";
import type { VideoSummary } from "@/lib/event-media";
import { normalizeIntentText, parseVideoIntent, type VideoIntent } from "@/lib/video-intent";

export type VideoSort = "recommended" | "newest" | "oldest" | "view_count" | "favorite" | "unwatched" | "watched" | "shortest" | "longest";

export type VideoFilters = {
  query: string;
  learningTopics?: Set<string>;
  targetRanks?: Set<string>;
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
  ...VIDEO_LEARNING_TOPIC_LABELS,
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

export function videoContentCategories(video: VideoSummary): string[] {
  const values = video.categories.length ? video.categories : video.videoType ? [video.videoType] : [];
  return [...new Set(values.map(value => value === "setup" ? "setplay" : value))];
}

function includesAny(values: string[], selected: Set<string>) {
  return selected.size === 0 || values.some((value) => selected.has(value));
}

function modeValues(video: VideoSummary): Array<"guide" | "match"> {
  const type = video.videoType?.toLowerCase() ?? "";
  const values: Array<"guide" | "match"> = [];
  if (["guide", "official_guide", "theory"].includes(type)) values.push("guide");
  if (["match", "tournament"].includes(type)) values.push("match");
  return values;
}

const ENTITY_ALIASES: Record<string, string[]> = {
  jp: ["jp", "ジェイピー", "じぇいぴー"], ryu: ["ryu", "リュウ", "りゅう"],
  sho: ["翔", "sho"], tokido: ["ときど", "tokido"], ryusei: ["りゅうせい", "ryusei"], kisaragi_ren: ["如月れん"],
};

function matchesEntity(values: string[], ids: Set<string>) {
  if (!ids.size) return true;
  const normalizedValues = values.map(normalizeIntentText);
  return [...ids].some((id) => (ENTITY_ALIASES[id] ?? [id]).some((alias) => normalizedValues.includes(normalizeIntentText(alias))));
}

export function videoMatchesIntent(video: VideoSummary, intent: VideoIntent, records: readonly VideoLearningAnnotation[] = PUBLISHED_VIDEO_LEARNING): boolean {
  video = applyReviewedVideoMetadata(video, records);
  const learning = videoLearningMetadata(video, records);
  if ([...(intent.learningTopics ?? [])].some(topic => !learning.topics.includes(topic))
    || (intent.targetRanks?.size && !includesAny(learning.targetRanks, intent.targetRanks))) return false;
  const categories = videoContentCategories(video);
  const haystack = normalizeIntentText([video.title, video.description, video.channelName].filter(Boolean).join(" "));
  // A legacy summary can support character-text discovery only. Player and
  // Tournament association must come exclusively from confirmed entityRefs.
  if (!video.entityRefs) {
    if (intent.players.size > 0 || intent.events.size > 0) return false;
    if (!matchesEntity(video.characters, intent.characters)) return false;
  } else {
    const matchingIds = (refs: Array<{ id: string; label: string }>, ids: Set<string>) => new Set(refs.filter(ref => matchesEntity([ref.label], ids)).map(ref => ref.id));
    const selected = { characters: intent.characters.size ? matchingIds(video.entityRefs.characters, intent.characters) : new Set<string>(),
      players: intent.players.size ? matchingIds(video.entityRefs.players, intent.players) : new Set<string>(),
      events: intent.events.size ? new Set(video.entityRefs.tournaments.filter(ref => videoTournamentLabelMatches(ref.label, intent.events, intent.eventYears)).map(ref => ref.id)) : new Set<string>() };
    if ((intent.characters.size && !selected.characters.size) || (intent.players.size && !selected.players.size) || (intent.events.size && !selected.events.size)
      || !videoMatchesRelationFilters(video, selected)) return false;
  }
  // With confirmed refs, the relation filters above are authoritative.
  // Do not require legacy free-text label arrays to agree with verified IDs.
  return includesAny(categories, intent.categories)
    && includesAny(video.level === "unknown" ? [] : [video.level], intent.levels)
    && includesAny(modeValues(video), intent.modes)
    && includesAny(video.controlTypes, intent.controls)
    && includesAny(video.language ? [video.language] : [], intent.languages)
    && intent.remainingTerms.every((term) => haystack.includes(normalizeIntentText(term)));
}

export function videoMatchesRelationFilters(video: VideoSummary, selected: { characters: Set<string>; players: Set<string>; events: Set<string> }): boolean {
  const refs = video.entityRefs;
  if (!refs) {
    // Preserve character-only browsing for legacy videos, but fail closed for
    // Player/Tournament: labels are not verified relation evidence.
    return selected.players.size === 0 && selected.events.size === 0
      && includesAny(video.characters, selected.characters);
  }
  if (!includesAny(refs.characters.map(r => r.id), selected.characters) || !includesAny(refs.players.map(r => r.id), selected.players)
    || !includesAny(refs.tournaments.map(r => r.id), selected.events)) return false;
  if ((selected.players.size && selected.characters.size) || (selected.events.size && (selected.players.size || selected.characters.size))) {
    return (video.matchBindings ?? []).some(b => (!selected.players.size || selected.players.has(b.playerId))
      && (!selected.characters.size || selected.characters.has(b.characterId)) && (!selected.events.size || (b.tournamentId !== null && selected.events.has(b.tournamentId))));
  }
  return true;
}

export function videoInitialPlayerIds(videos: VideoSummary[], displayName: string): string[] {
  const ids = videoEntityOptions(videos, "players").filter(ref => ref.label === displayName).map(ref => ref.id);
  // A legacy label must never become a free-text title search or an all-video filter.
  return ids.length ? ids : [`unresolved-player:${displayName}`];
}

function videoMatchesCombinedRelations(video: VideoSummary, intent: VideoIntent, filters: VideoFilters): boolean {
  // Text intent and checkbox filters are AND constraints, not independent
  // evidence from different participants or matches in the same archive.
  if (!video.entityRefs || !(intent.players.size || intent.characters.size || intent.events.size)
    || !(filters.players.size || filters.characters.size || filters.events.size)) return true;
  const selected = { players: new Set<string>(), characters: new Set<string>(), events: new Set<string>() };
  for (const group of ["players", "characters", "events"] as const) {
    const refs = group === "events" ? video.entityRefs.tournaments : video.entityRefs[group];
    const fromIntent = new Set(refs.filter(ref => group === "events"
      ? videoTournamentLabelMatches(ref.label, intent.events, intent.eventYears)
      : matchesEntity([ref.label], intent[group])).map(ref => ref.id));
    selected[group] = intent[group].size
      ? new Set([...fromIntent].filter(id => !filters[group].size || filters[group].has(id)))
      : filters[group];
    if ((intent[group].size || filters[group].size) && !selected[group].size) return false;
  }
  return videoMatchesRelationFilters(video, selected);
}

export function videoEntityOptions(videos: VideoSummary[], group: "characters" | "players" | "tournaments"): Array<{ id: string; label: string }> {
  const values = videos.flatMap(video => video.entityRefs ? video.entityRefs[group] :
    group === "characters" ? video.characters.map(label => ({ id: label, label })) : []);
  return [...new Map(values.map(value => [value.id, value])).values()].sort((a,b) => a.label.localeCompare(b.label, "ja") || a.id.localeCompare(b.id));
}

export function filterVideos(
  videos: VideoSummary[],
  filters: VideoFilters,
  favorites: Set<string>,
  watched: Set<string>,
  records: readonly VideoLearningAnnotation[] = PUBLISHED_VIDEO_LEARNING,
) {
  const intent = parseVideoIntent(filters.query);
  return uniqueVideoSummaries(videos).map(video => applyReviewedVideoMetadata(video, records)).filter((video) => {
    const preferenceMatches = filters.preference.size === 0 || [
      filters.preference.has("favorite") && favorites.has(video.id),
      filters.preference.has("watched") && watched.has(video.id),
      filters.preference.has("unwatched") && !watched.has(video.id),
    ].some(Boolean);
    const learning = videoLearningMetadata(video, records);
    return includesAny(learning.topics, filters.learningTopics ?? new Set())
      && includesAny(learning.targetRanks, filters.targetRanks ?? new Set())
      && videoMatchesIntent(video, intent, records)
      && videoMatchesRelationFilters(video, filters)
      && videoMatchesCombinedRelations(video, intent, filters)
      && includesAny(video.controlTypes, filters.controls)
      && includesAny(videoContentCategories(video), new Set([...filters.categories].map(value => value === "setup" ? "setplay" : value)))
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
