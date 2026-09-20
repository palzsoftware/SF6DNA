import { getPublicEntitySources } from "@/lib/public-source-links";
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
  playerIds: string[];
  categories: string[];
  level: "beginner" | "intermediate" | "advanced" | "unknown";
  viewCount: number | null;
  viewCountCheckedAt: string | null;
  availability: "UNKNOWN";
  availabilityCheckedAt: null;
};

function youtubeThumbnail(url: string, externalId: string | null): string | null {
  let id = externalId?.trim() || null;
  if (!id) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "youtu.be") id = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
      if (parsed.hostname.endsWith("youtube.com")) {
        id = parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:live|shorts|embed)\/([^/?]+)/)?.[1] ?? null;
      }
    } catch {
      return null;
    }
  }
  return id && /^[A-Za-z0-9_-]{6,}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

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

export async function listVideos(): Promise<VideoSummary[]> {
  if (!configured()) return [];

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .select(
      "id, slug, title, platform, video_type, published_at, description, url, thumbnail_url, external_id",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error(
      "[event-media] video list failed",
      error.message,
    );
    return [];
  }

  const videoIds = (data ?? []).map((row) => String(row.id));
  const { data: relationRows, error: relationError } = videoIds.length
    ? await supabase.from("entity_videos").select("video_id, entity_type, entity_id").in("video_id", videoIds)
    : { data: [], error: null };

  if (relationError) console.error("[event-media] video relation list failed", relationError.message);

  const characterIds = Array.from(new Set((relationRows ?? []).filter((row) => row.entity_type === "character").map((row) => String(row.entity_id))));
  const playerIds = Array.from(new Set((relationRows ?? []).filter((row) => row.entity_type === "player").map((row) => String(row.entity_id))));
  const [{ data: characterRows }, { data: playerRows }, { data: matchRows, error: matchError }] = await Promise.all([
    characterIds.length ? supabase.from("characters").select("id, name_ja").in("id", characterIds).eq("status", "published") : Promise.resolve({ data: [] }),
    playerIds.length ? supabase.from("players").select("id, display_name").in("id", playerIds).eq("status", "published") : Promise.resolve({ data: [] }),
    videoIds.length
      ? supabase
          .from("matches")
          .select("id, video_id, tournament_id")
          .in("video_id", videoIds)
          .eq("status", "published")
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (matchError) console.error("[event-media] match metadata failed", matchError.message);

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
  if (participantError) console.error("[event-media] match participant metadata failed", participantError.message);
  if (tournamentError) console.error("[event-media] tournament metadata failed", tournamentError.message);

  const matchCharacterIds = Array.from(new Set((participantRows ?? []).flatMap((row) => row.character_id ? [String(row.character_id)] : [])));
  const matchPlayerIds = Array.from(new Set((participantRows ?? []).flatMap((row) => row.player_id ? [String(row.player_id)] : [])));
  const missingCharacterIds = matchCharacterIds.filter((id) => !characterIds.includes(id));
  const missingPlayerIds = matchPlayerIds.filter((id) => !playerIds.includes(id));
  const [{ data: matchCharacterRows }, { data: matchPlayerRows }] = await Promise.all([
    missingCharacterIds.length ? supabase.from("characters").select("id, name_ja").in("id", missingCharacterIds).eq("status", "published") : Promise.resolve({ data: [] }),
    missingPlayerIds.length ? supabase.from("players").select("id, display_name").in("id", missingPlayerIds).eq("status", "published") : Promise.resolve({ data: [] }),
  ]);
  const characterNames = new Map((characterRows ?? []).map((row) => [String(row.id), String(row.name_ja)]));
  const playerNames = new Map((playerRows ?? []).map((row) => [String(row.id), String(row.display_name)]));
  for (const row of matchCharacterRows ?? []) characterNames.set(String(row.id), String(row.name_ja));
  for (const row of matchPlayerRows ?? []) playerNames.set(String(row.id), String(row.display_name));
  const tournamentNames = new Map((tournamentRows ?? []).map((row) => [String(row.id), String(row.name)]));

  return (data ?? []).map((row) => {
    const related = (relationRows ?? []).filter((relation) => String(relation.video_id) === String(row.id));
    const relatedMatches = (matchRows ?? []).filter((match) => String(match.video_id) === String(row.id));
    const relatedMatchIds = new Set(relatedMatches.map((match) => String(match.id)));
    const relatedParticipants = (participantRows ?? []).filter((participant) => relatedMatchIds.has(String(participant.match_id)));
    const url = String(row.url);
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
    playerIds: Array.from(new Set([
      ...related.flatMap((relation) => relation.entity_type === "player" ? [String(relation.entity_id)] : []),
      ...relatedParticipants.flatMap((participant) => participant.player_id ? [String(participant.player_id)] : []),
    ])),
    categories: typeof row.video_type === "string" ? [row.video_type] : [],
    level: "unknown",
    viewCount: null,
    viewCountCheckedAt: null,
    availability: "UNKNOWN",
    availabilityCheckedAt: null,
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
      typeof data.url === "string" && /^https:\/\//i.test(data.url)
        ? { href: data.url, label: "YouTubeで見る" }
        : undefined,
  };
}
