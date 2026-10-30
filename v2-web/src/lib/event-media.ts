import { getPublicEntitySources } from "@/lib/public-source-links";
import { safeExternalUrl } from "@/lib/safe-external-url";
import { applyConfirmedVideoRelations, confirmedVideoIdsForQuery, PUBLIC_CONFIRMED_VIDEO_RELATIONS } from "@/lib/confirmed-video-relations";
import type { VideoRetrievalResult } from "@/lib/video-retrieval-state";
import { youtubeThumbnail } from "@/lib/youtube-thumbnail";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { DetailSource, SimpleDetail } from "@/lib/content-detail";

function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type VideoSummary = {
  id: string;
  slug: string;
  title: string;
  platform: string | null;
  videoType: string | null;
  publishedAt: string | null;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  channelName: string | null;
  durationSeconds: number | null;
  language: "ja" | "en" | "other" | null;
  controlTypes: Array<"classic" | "modern">;
  events: string[];
  characters: string[];
  players: string[];
  categories: string[];
  level: "beginner" | "intermediate" | "advanced" | "unknown";
  viewCount: number | null;
  viewCountCheckedAt: string | null;
  entityRefs?: { characters: Array<{ id: string; label: string }>; players: Array<{ id: string; label: string }>; tournaments: Array<{ id: string; label: string }> };
  matchBindings?: Array<{ matchId: string; playerId: string; characterId: string; tournamentId: string | null }>;

};

export function formatVideoPublishedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export type VideoQuery = { playerId?: string; characterId?: string; tournamentId?: string; limit?: number };

// A player × character request requires the same match participant row.
// Independent entity links do not prove which character the player used.
async function relatedVideoIds(supabase: ReturnType<typeof getSupabaseServerClient>, query: VideoQuery): Promise<string[]> {
  let matchIds: string[] | null = null;
  if (query.playerId || query.characterId) {
    let participants = supabase.from("match_participants").select("match_id");
    if (query.playerId) participants = participants.eq("player_id", query.playerId);
    if (query.characterId) participants = participants.eq("character_id", query.characterId);
    const { data, error } = await participants;
    if (error) throw new Error("Match relation lookup failed");
    matchIds = Array.from(new Set((data ?? []).map(row => String(row.match_id))));
  }
  const ids: string[] = [];
  if (matchIds === null || matchIds.length) {
    let matchesQuery = supabase.from("matches").select("video_id").eq("status", "published");
    if (matchIds) matchesQuery = matchesQuery.in("id", matchIds);
    if (query.tournamentId) matchesQuery = matchesQuery.eq("tournament_id", query.tournamentId);
    const { data, error } = await matchesQuery;
    if (error) throw new Error("Published match lookup failed");
    ids.push(...(data ?? []).flatMap(row => row.video_id ? [String(row.video_id)] : []));
  }
  // A tournament combination must come from the same published match.
  if (!query.tournamentId && !(query.playerId && query.characterId)) {
    const { data: links, error } = await supabase.from("entity_videos").select("video_id")
      .eq("entity_type", query.playerId ? "player" : "character")
      .eq("entity_id", query.playerId ?? query.characterId!);
    if (error) throw new Error("Video relation lookup failed");
    ids.push(...(links ?? []).map(row => String(row.video_id)));
  }

  return Array.from(new Set(ids));
}

export async function listVideos(query: VideoQuery = {}): Promise<VideoSummary[]> {
  try {
    return await loadVideos(query);
  } catch {
    console.error("[event-media] video lookup unavailable");
    return [];
  }
}

/** State-bearing loader for /videos; legacy array callers retain their contract. */
export async function listVideosResult(query: VideoQuery = {}): Promise<VideoRetrievalResult<VideoSummary>> {
  if (!configured()) return { state: "UNAVAILABLE", items: [], warnings: [] };
  const ids = [query.playerId, query.characterId, query.tournamentId].filter((id): id is string => id !== undefined);
  if (ids.some(id => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) {
    return { state: "RELATION_UNRESOLVED", items: [], warnings: ["INVALID_FILTER"] };
  }
  try {
    const approvedIds = query.playerId || query.tournamentId
      ? confirmedVideoIdsForQuery(PUBLIC_CONFIRMED_VIDEO_RELATIONS, query) : undefined;
    if (approvedIds && !approvedIds.length) return { state: "RELATION_UNRESOLVED", items: [], warnings: [] };
    // Bound the approved-candidate query; limit is an upper bound, not a promise
    // to replenish rows rejected by metadata checks or final projection.
    const retrieval = { candidateRows: 0 };
    const videos = await loadVideos(approvedIds ? { ...query, limit: query.limit ?? 24 } : query, approvedIds, retrieval);
    const safeVideos = videos.map(video => applyConfirmedVideoRelations(video, PUBLIC_CONFIRMED_VIDEO_RELATIONS));
    const items = safeVideos.filter(video => {
      const refs = video.entityRefs!;
      if (query.playerId && !refs.players.some(ref => ref.id === query.playerId)) return false;
      if (query.characterId && !refs.characters.some(ref => ref.id === query.characterId)) return false;
      if (query.tournamentId && !refs.tournaments.some(ref => ref.id === query.tournamentId)) return false;
      const needsBinding = (query.playerId && query.characterId)
        || (query.tournamentId && (query.playerId || query.characterId));
      if (needsBinding && !(video.matchBindings ?? []).some(b => (!query.playerId || b.playerId === query.playerId)
        && (!query.characterId || b.characterId === query.characterId)
        && (!query.tournamentId || b.tournamentId === query.tournamentId))) return false;
      return true;
    });
    // A nonempty bounded sample rejected by final projection cannot establish
    // that all approved candidates are absent. Do not misreport normal zero.
    const windowEmpty = approvedIds !== undefined && retrieval.candidateRows > 0 && items.length === 0;
    return { state: items.length ? "SUCCESS_WITH_RESULTS" : windowEmpty ? "SUCCESS_WINDOW_EMPTY" : "SUCCESS_EMPTY", items,
      warnings: windowEmpty ? ["APPROVAL_PROJECTION_EMPTY"] : [] };
  } catch {
    console.error("[event-media] video result unavailable");
    return { state: "API_ERROR", items: [], warnings: [] };
  }
}

async function loadVideos(query: VideoQuery, approvedVideoIds?: readonly string[], retrieval?: { candidateRows: number }): Promise<VideoSummary[]> {
  if (!configured()) return [];

  const supabase = getSupabaseServerClient();

  let videoQuery = supabase
    .from("videos")
    .select(
      "id, slug, title, platform, video_type, published_at, description, url, thumbnail_url, external_id",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });
  let ids = approvedVideoIds ? [...approvedVideoIds] : null;
  if (query.playerId || query.characterId || query.tournamentId) {
    const relatedIds = await relatedVideoIds(supabase, query);
    const approved = ids ? new Set(ids) : null;
    ids = approved ? relatedIds.filter(id => approved.has(id)) : relatedIds;
  }
  if (ids !== null) {
    if (!ids.length) return [];
    videoQuery = videoQuery.in("id", ids);
  }
  if (query.limit !== undefined) {
    const limit = Number.isFinite(query.limit) ? Math.max(1, Math.min(100, Math.floor(query.limit))) : 24;
    videoQuery = videoQuery.limit(limit);
  }
  const { data, error } = await videoQuery;

  if (error) throw new Error("Video list failed");
  if (retrieval) retrieval.candidateRows = (data ?? []).length;

  const videoIds = (data ?? []).map((row) => String(row.id));
  const { data: relationRows, error: relationError } = videoIds.length
    ? await supabase.from("entity_videos").select("video_id, entity_type, entity_id").in("video_id", videoIds)
    : { data: [], error: null };

  if (relationError) throw new Error("Video relation list failed");

  const characterIds = Array.from(new Set((relationRows ?? []).filter((row) => row.entity_type === "character").map((row) => String(row.entity_id))));
  const playerIds = Array.from(new Set((relationRows ?? []).filter((row) => row.entity_type === "player").map((row) => String(row.entity_id))));
  const [{ data: characterRows, error: characterError }, { data: playerRows, error: playerError }, { data: matchRows, error: matchError }] = await Promise.all([
    characterIds.length ? supabase.from("characters").select("id, name_ja").in("id", characterIds).eq("status", "published") : Promise.resolve({ data: [], error: null }),
    playerIds.length ? supabase.from("players").select("id, display_name").in("id", playerIds).eq("status", "published") : Promise.resolve({ data: [], error: null }),
    videoIds.length
      ? supabase
          .from("matches")
          .select("id, video_id, tournament_id")
          .in("video_id", videoIds)
          .eq("status", "published")
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (matchError || characterError || playerError) throw new Error("Video metadata failed");

  const matchIds = (matchRows ?? []).map((row) => String(row.id));
  const tournamentIds = Array.from(new Set((matchRows ?? []).flatMap((row) => row.tournament_id ? [String(row.tournament_id)] : [])));
  const [{ data: participantRows, error: participantError }, { data: tournamentRows, error: tournamentError }] = await Promise.all([
    matchIds.length
      ? supabase.from("match_participants").select("match_id, player_id, character_id").in("match_id", matchIds)
      : Promise.resolve({ data: [], error: null }),
    tournamentIds.length
      ? supabase.from("tournaments").select("id, name").in("id", tournamentIds).eq("status", "published")
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (participantError) throw new Error("Participant metadata failed");
  if (tournamentError) throw new Error("Tournament metadata failed");

  const matchCharacterIds = Array.from(new Set((participantRows ?? []).flatMap((row) => row.character_id ? [String(row.character_id)] : [])));
  const matchPlayerIds = Array.from(new Set((participantRows ?? []).flatMap((row) => row.player_id ? [String(row.player_id)] : [])));
  const missingCharacterIds = matchCharacterIds.filter((id) => !characterIds.includes(id));
  const missingPlayerIds = matchPlayerIds.filter((id) => !playerIds.includes(id));
  const [{ data: matchCharacterRows, error: matchCharacterError }, { data: matchPlayerRows, error: matchPlayerError }] = await Promise.all([
    missingCharacterIds.length ? supabase.from("characters").select("id, name_ja").in("id", missingCharacterIds).eq("status", "published") : Promise.resolve({ data: [], error: null }),
    missingPlayerIds.length ? supabase.from("players").select("id, display_name").in("id", missingPlayerIds).eq("status", "published") : Promise.resolve({ data: [], error: null }),
  ]);
  if (matchCharacterError || matchPlayerError) throw new Error("Participant name lookup failed");
  const characterNames = new Map((characterRows ?? []).map((row) => [String(row.id), String(row.name_ja)]));
  const playerNames = new Map((playerRows ?? []).map((row) => [String(row.id), String(row.display_name)]));
  for (const row of matchCharacterRows ?? []) characterNames.set(String(row.id), String(row.name_ja));
  for (const row of matchPlayerRows ?? []) playerNames.set(String(row.id), String(row.display_name));
  const tournamentNames = new Map((tournamentRows ?? []).map((row) => [String(row.id), String(row.name)]));

  return (data ?? []).filter((row) => safeExternalUrl(row.url) !== null).map((row) => {
    const related = (relationRows ?? []).filter((relation) => String(relation.video_id) === String(row.id));
    const relatedMatches = (matchRows ?? []).filter((match) => String(match.video_id) === String(row.id));
    const relatedMatchIds = new Set(relatedMatches.map((match) => String(match.id)));
    const relatedParticipants = (participantRows ?? []).filter((participant) => relatedMatchIds.has(String(participant.match_id)));
    const url = safeExternalUrl(row.url)!;
    const characterRefIds = new Set([
      ...related.filter(r => r.entity_type === "character").map(r => String(r.entity_id)),
      ...relatedParticipants.flatMap(p => p.character_id ? [String(p.character_id)] : []),
    ]);
    const playerRefIds = new Set([
      ...related.filter(r => r.entity_type === "player").map(r => String(r.entity_id)),
      ...relatedParticipants.flatMap(p => p.player_id ? [String(p.player_id)] : []),
    ]);
    const tournamentRefIds = new Set(relatedMatches.flatMap(m => m.tournament_id ? [String(m.tournament_id)] : []));
    const refs = (ids: Set<string>, names: Map<string, string>) => [...ids].flatMap(id => names.has(id) ? [{ id, label: names.get(id)! }] : []);

    return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    platform:
      typeof row.platform === "string"
        ? row.platform
        : null,
    videoType:
      typeof row.video_type === "string"
        ? row.video_type
        : null,
    publishedAt:
      typeof row.published_at === "string"
        ? row.published_at
        : null,
    description:
      typeof row.description === "string"
        ? row.description
        : null,
    url,
    thumbnailUrl:
      typeof row.thumbnail_url === "string" && row.thumbnail_url.startsWith("https://")
        ? row.thumbnail_url
        : youtubeThumbnail(url, typeof row.external_id === "string" ? row.external_id : null),
    // These fields are intentionally null/empty until approved metadata columns exist.
    // Do not infer language, control type, duration, or publisher from title/URL.
    channelName: null,
    durationSeconds: null,
    language: null,
    controlTypes: [],
    events: Array.from(new Set(relatedMatches.flatMap((match) => match.tournament_id ? [tournamentNames.get(String(match.tournament_id))].filter((name): name is string => Boolean(name)) : []))),
    characters: Array.from(new Set([
      ...related.flatMap((relation) => relation.entity_type === "character" ? [characterNames.get(String(relation.entity_id))].filter((name): name is string => Boolean(name)) : []),
      ...relatedParticipants.flatMap((participant) => participant.character_id ? [characterNames.get(String(participant.character_id))].filter((name): name is string => Boolean(name)) : []),
    ])),
    players: Array.from(new Set([
      ...related.flatMap((relation) => relation.entity_type === "player" ? [playerNames.get(String(relation.entity_id))].filter((name): name is string => Boolean(name)) : []),
      ...relatedParticipants.flatMap((participant) => participant.player_id ? [playerNames.get(String(participant.player_id))].filter((name): name is string => Boolean(name)) : []),
    ])),
    categories: typeof row.video_type === "string" ? [row.video_type] : [],
    level: "unknown",
    viewCount: null,
    viewCountCheckedAt: null,
    entityRefs: { characters: refs(characterRefIds, characterNames), players: refs(playerRefIds, playerNames), tournaments: refs(tournamentRefIds, tournamentNames) },
    matchBindings: relatedParticipants.flatMap(p => p.player_id && p.character_id ? [{
      matchId: String(p.match_id), playerId: String(p.player_id), characterId: String(p.character_id),
      tournamentId: relatedMatches.find(m => String(m.id) === String(p.match_id))?.tournament_id ?? null,
    }] : []),
  };
  });
}

export async function getTournamentBySlug(
  slug: string,
): Promise<SimpleDetail | null> {
  if (!configured()) return null;

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, slug, name, series_name, start_date, end_date, region, venue, event_type, scale, official_url, notes",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary:
      typeof data.series_name === "string"
        ? data.series_name
        : null,
    body: [
      ["開始日", data.start_date ?? null],
      ["終了日", data.end_date ?? null],
      ["地域", data.region ?? null],
      ["会場", data.venue ?? null],
      ["形式", data.event_type ?? null],
      ["規模", data.scale ?? null],
      ["公式URL", data.official_url ?? null],
      ["補足", data.notes ?? null],
    ],
  };
}

export async function getVideoBySlug(
  slug: string,
): Promise<SimpleDetail | null> {
  if (!configured()) return null;

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .select(
      "id, slug, platform, title, url, published_at, description, video_type",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const videoUrl = safeExternalUrl(data.url);
  if (!videoUrl) return null;

  const [
    { data: relationRows, error: relationError },
    sourceRows,
  ] = await Promise.all([
    supabase
      .from("entity_videos")
      .select(
        "entity_type, entity_id, relationship, display_order",
      )
      .eq("video_id", data.id)
      .eq("entity_type", "character")
      .order("display_order", { ascending: true }),

    getPublicEntitySources(
      ["video"],
      [String(data.id)],
    ),
  ]);

  if (relationError) {
    console.error(
      "[event-media] video relations failed",
      relationError.message,
    );
  }

  const characterIds = Array.from(
    new Set(
      (relationRows ?? []).map((row) =>
        String(row.entity_id),
      ),
    ),
  );

  let relatedCharacters: string[] = [];

  if (characterIds.length) {
    const {
      data: characters,
      error: characterError,
    } = await supabase
      .from("characters")
      .select("id, name_ja, status")
      .in("id", characterIds)
      .eq("status", "published");

    if (characterError) {
      console.error(
        "[event-media] video characters failed",
        characterError.message,
      );
    } else {
      const nameById = new Map(
        (characters ?? []).map((character) => [
          String(character.id),
          String(character.name_ja),
        ]),
      );

      relatedCharacters = (relationRows ?? [])
        .map(
          (row) =>
            nameById.get(String(row.entity_id)) ??
            null,
        )
        .filter(
          (name): name is string =>
            Boolean(name),
        );
    }
  }

  const sources: DetailSource[] = sourceRows.map(
    (row) => ({
      id: row.sourceId,
      title: row.title,
      url: row.url,
      publisher: row.publisher,
      sourceType: row.sourceType,
      relationship: row.relationship,
    }),
  );

  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.title),
    summary:
      typeof data.description === "string"
        ? data.description
        : null,
    body: [
      ["プラットフォーム", data.platform ?? null],
      ["種類", data.video_type ?? null],
      ["公開日", data.published_at ?? null],
      [
        "関連キャラクター",
        relatedCharacters.length
          ? relatedCharacters.join(" / ")
          : null,
      ],
    ],
    sources,
    externalLink:
      videoUrl.startsWith("https:")
        ? { href: videoUrl, label: "YouTubeで見る" }
        : undefined,
  };
}
