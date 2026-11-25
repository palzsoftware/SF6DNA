import type { VideoSummary } from "./event-media";
import playerVideoRows from "../data/player-research/videos.json";
import playerVideoBindings from "../data/player-research/video-bindings.json";
import profileSupplements from "../data/player-research/profile-supplements.json";
import characterVideoRows from "../data/character-videos/registered.json";
import characterIds from "../data/character-videos/character-ids.json";
import teamBindings from "../data/player-research/team-bindings.json";

/**
 * One shared projection of the reviewed YouTube video data for the video list, character pages and Player図鑑.
 * - Server-side only: rows that are not APPROVED are dropped here unless loopback local preview is on,
 *   so pending rows never reach page props, search results or the browser.
 * - One card per YouTube ID. A full stream whose matches are all covered by single-match clips is not listed;
 *   each clip card links to that full stream as a supporting YouTube link.
 * - Time-offset links only for start times confirmed in the video (startSeconds > 0). Chapter times stay notes.
 * - Players and characters are attached only when the row's evidence ties them (player bindings for the
 *   environment's real ID, characterLinks / characterSlug); the uploading channel is kept separately.
 */
type PlayerRow = {
  key: string; playerSlug: string; title: string; youtubeId: string; channelName: string;
  kind: "本人解説" | "大会対戦" | "配信・ランクマ"; reason: string; relationConfirmed: boolean;
  publicationApproval: "PENDING" | "APPROVED"; sourceDate?: string;
  characterLinks?: readonly { slug: string; name: string }[]; startSeconds?: number;
  sameMatchFullStream?: { youtubeId: string; startSeconds: number | null; chapterNote?: string | null };
  pastYear?: string;
  /** Short label shown on the card, e.g. 「チーム間スクリム（公式大会ではない）」. */
  cardNote?: string;
};
type CharacterRow = {
  key: string; characterSlug: string | null; youtubeId: string; title: string; channelName: string; sourceDate: string;
  category: "解説" | "対戦"; origin: string; playerSlug: string | null; caution: string | null; publicationApproval: "PENDING" | "APPROVED";
};
type Binding = { environment: string; playerId: string; playerSlug: string; recommendationKey: string };
type Supplement = { playerSlug: string; displayName: string };

export type RegisteredVideoCategory = "guide" | "match" | "ranked_replay";
export const REGISTERED_VIDEO_CATEGORY_LABELS: Record<RegisteredVideoCategory, string> = { guide: "解説", match: "対戦", ranked_replay: "ランクマ／リプレイ" };
const KIND_CATEGORY: Record<PlayerRow["kind"], RegisteredVideoCategory> = { 本人解説: "guide", 大会対戦: "match", "配信・ランクマ": "ranked_replay" };
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const CHARACTERS = (characterIds as { characters: Record<string, { id: string; name: string; developmentMissing?: boolean }> }).characters;
const PRODUCTION = "wnuxaxbrpudyypzdbdho";
const DEVELOPMENT = "vvsknbmlfvvnrmgtyhbf";

export const youtubeWatch = (id: string, start?: number | null) =>
  `https://www.youtube.com/watch?v=${id}${typeof start === "number" && Number.isInteger(start) && start > 0 && start < 86400 ? `&t=${start}s` : ""}`;

export type RegisteredVideo = VideoSummary & { registeredCategory: RegisteredVideoCategory; characterSlugs: string[]; playerSlugs: string[] };

export function registeredYouTubeVideos(environment: string, preview: boolean, source: {
  players?: readonly PlayerRow[]; bindings?: readonly Binding[]; characters?: readonly CharacterRow[]; supplements?: readonly Supplement[];
  /** Player図鑑: only this player's own rows, so a full stream card shows that player's match only (not other matches in it). */
  onlyPlayerId?: string;
} = {}): RegisteredVideo[] {
  if (environment !== PRODUCTION && environment !== DEVELOPMENT) return []; // unknown environment shows nothing
  const players = source.players ?? playerVideoRows as PlayerRow[];
  const bindings = source.bindings ?? playerVideoBindings as Binding[];
  const characterRows = source.characters ?? characterVideoRows as CharacterRow[];
  // Display names: SFL48 profile data first, then the reviewed team display names (non-48 players).
  const names = new Map<string, string>((teamBindings as { playerSlug: string; display?: { name?: string } }[])
    .flatMap(t => t.display?.name ? [[t.playerSlug, t.display.name] as [string, string]] : []));
  for (const s of source.supplements ?? profileSupplements as Supplement[]) names.set(s.playerSlug, s.displayName);
  const allowed = (approval: string) => preview || approval === "APPROVED";
  const characterAvailable = (slug: string) => Boolean(CHARACTERS[slug]) && !(environment !== PRODUCTION && CHARACTERS[slug].developmentMissing);
  const bound = new Map(bindings.filter(b => b.environment === environment).map(b => [b.recommendationKey, b]));

  type Acc = { first: { title: string; channelName: string; date: string | null }; categories: Set<RegisteredVideoCategory>;
    characters: Map<string, string>; players: Map<string, { slug: string; label: string }>; bindings: VideoSummary["matchBindings"];
    supporting: Map<string, string>; notes: Set<string>; start: number | null; rows: number };
  const acc = new Map<string, Acc>();
  const get = (id: string, title: string, channelName: string, date: string | null) => {
    let a = acc.get(id);
    if (!a) acc.set(id, a = { first: { title, channelName, date }, categories: new Set(), characters: new Map(), players: new Map(), bindings: [], supporting: new Map(), notes: new Set(), start: null, rows: 0 });
    return a;
  };

  // Full streams covered by a clip for the same player are folded into that clip card.
  const visiblePlayerRows = players.filter(r => r.relationConfirmed && allowed(r.publicationApproval) && YOUTUBE_ID.test(r.youtubeId) && bound.has(r.key)
    && (!source.onlyPlayerId || bound.get(r.key)!.playerId === source.onlyPlayerId));
  const coveredFull = new Set(visiblePlayerRows.filter(r => r.sameMatchFullStream).map(r => `${r.playerSlug}:${r.sameMatchFullStream!.youtubeId}`));
  for (const r of visiblePlayerRows) {
    if (coveredFull.has(`${r.playerSlug}:${r.youtubeId}`) && !r.sameMatchFullStream) continue;
    const b = bound.get(r.key)!;
    const a = get(r.youtubeId, r.title, r.channelName, r.sourceDate || null);
    a.rows++;
    a.categories.add(KIND_CATEGORY[r.kind]);
    a.players.set(b.playerId, { slug: r.playerSlug, label: names.get(r.playerSlug) ?? r.playerSlug });
    for (const c of r.characterLinks ?? []) if (characterAvailable(c.slug)) {
      a.characters.set(c.slug, CHARACTERS[c.slug].name);
      a.bindings!.push({ matchId: r.key, playerId: b.playerId, characterId: CHARACTERS[c.slug].id, tournamentId: null });
    }
    if (typeof r.startSeconds === "number" && r.startSeconds > 0) a.start = r.startSeconds;
    if (r.pastYear) a.notes.add(`${r.pastYear}年の動画`);
    if (r.cardNote) a.notes.add(r.cardNote);
    const full = r.sameMatchFullStream;
    if (full && YOUTUBE_ID.test(full.youtubeId)) a.supporting.set(youtubeWatch(full.youtubeId, full.startSeconds),
      typeof full.startSeconds === "number" && full.startSeconds > 0 ? "同じ試合のフル配信（YouTube・開始位置から）" : "同じ試合のフル配信（YouTube）");
  }
  // A full stream already represented by a single-match clip of the same character is not repeated as its own card.
  const clipCovered = new Set(visiblePlayerRows.filter(r => r.sameMatchFullStream)
    .flatMap(r => (r.characterLinks ?? []).map(c => `${r.sameMatchFullStream!.youtubeId}:${c.slug}`)));
  for (const r of source.onlyPlayerId ? [] : characterRows) {
    if (!r.characterSlug || !characterAvailable(r.characterSlug) || !allowed(r.publicationApproval) || !YOUTUBE_ID.test(r.youtubeId)) continue;
    if (r.category === "対戦" && clipCovered.has(`${r.youtubeId}:${r.characterSlug}`)) continue;
    const a = get(r.youtubeId, r.title, r.channelName, r.sourceDate || null);
    a.rows++;
    a.categories.add(r.category === "解説" ? "guide" : "match");
    a.characters.set(r.characterSlug, CHARACTERS[r.characterSlug].name);
    // Past tournaments are labelled on the card (e.g. 2025年の過去大会).
    if (r.caution) a.notes.add(r.origin);
  }

  return [...acc].filter(([, a]) => a.rows > 0).map(([id, a]): RegisteredVideo => {
    const category: RegisteredVideoCategory = a.categories.has("match") ? "match" : a.categories.has("ranked_replay") ? "ranked_replay" : "guide";
    const typeKey = category === "guide" ? "explainer" : category; // labels in VIDEO_CATEGORY_LABELS
    const characterSlugs = [...a.characters.keys()];
    const playerRefs = [...a.players].map(([pid, p]) => ({ id: pid, label: p.label }));
    return {
      id: `youtube:${id}`, slug: `youtube-${id}`, title: a.first.title, platform: "YouTube", videoType: typeKey,
      publishedAt: a.first.date, description: null, url: youtubeWatch(id, a.start), thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channelName: a.first.channelName, durationSeconds: null, language: null, controlTypes: [], events: [...a.notes],
      characters: characterSlugs.map(s => CHARACTERS[s].name), players: playerRefs.map(p => p.label),
      categories: [typeKey], level: "unknown", viewCount: null, viewCountCheckedAt: null,
      entityRefs: { characters: characterSlugs.map(s => ({ id: CHARACTERS[s].id, label: CHARACTERS[s].name })), players: playerRefs, tournaments: [] },
      matchBindings: a.bindings,
      detailHref: null, supportingLinks: [...a.supporting].map(([url, label]) => ({ url, label })),
      registeredCategory: category, characterSlugs, playerSlugs: [...a.players.values()].map(p => p.slug),
    };
  }).sort((x, y) => (y.publishedAt ?? "").localeCompare(x.publishedAt ?? "") || x.id.localeCompare(y.id));
}

/** DB rows win; registered rows with the same YouTube ID are dropped. */
export function youtubeIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(u.hostname) ? u.searchParams.get("v") : null;
    return id && YOUTUBE_ID.test(id) ? id : null;
  } catch { return null; }
}
export function mergeWithListedVideos<T extends VideoSummary>(listed: readonly VideoSummary[], registered: readonly T[]): Array<VideoSummary | T> {
  const seen = new Set(listed.map(v => youtubeIdFromUrl(v.url)).filter(Boolean));
  return [...listed, ...registered.filter(v => !seen.has(youtubeIdFromUrl(v.url)))];
}
