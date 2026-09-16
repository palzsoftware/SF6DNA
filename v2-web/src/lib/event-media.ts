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
  characters: string[];
  players: string[];
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
  const [{ data: characterRows }, { data: playerRows }] = await Promise.all([
    characterIds.length ? supabase.from("characters").select("id, name_ja").in("id", characterIds).eq("status", "published") : Promise.resolve({ data: [] }),
    playerIds.length ? supabase.from("players").select("id, display_name").in("id", playerIds).eq("status", "published") : Promise.resolve({ data: [] }),
  ]);
  const characterNames = new Map((characterRows ?? []).map((row) => [String(row.id), String(row.name_ja)]));
  const playerNames = new Map((playerRows ?? []).map((row) => [String(row.id), String(row.display_name)]));

  return (data ?? []).map((row) => {
    const related = (relationRows ?? []).filter((relation) => String(relation.video_id) === String(row.id));
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
    characters: related.flatMap((relation) => relation.entity_type === "character" ? [characterNames.get(String(relation.entity_id))].filter((name): name is string => Boolean(name)) : []),
    players: related.flatMap((relation) => relation.entity_type === "player" ? [playerNames.get(String(relation.entity_id))].filter((name): name is string => Boolean(name)) : []),
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
