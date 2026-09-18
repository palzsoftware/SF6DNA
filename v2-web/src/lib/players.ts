import { approvedPlayerImage } from "@/lib/approved-player-images";
import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlayerDetail, PlayerSummary } from "@/types/player";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function toSummary(
  row: Record<string, unknown>,
): PlayerSummary {
  const slug = String(row.slug);

  return {
    id: String(row.id),
    slug,
    displayName: String(row.display_name),
    playerType:
      typeof row.player_type === "string"
        ? row.player_type
        : null,
    teamName:
      typeof row.team_name === "string"
        ? row.team_name
        : null,
    countryCode:
      typeof row.country_code === "string"
        ? row.country_code
        : null,
    imageUrl: approvedPlayerImage(slug, row.image_url),
    characters: [],
  };
}

export async function listPlayers(): Promise<
  PlayerSummary[]
> {
  if (!isConfigured()) return [];

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("players")
    .select(
      "id, slug, display_name, player_type, team_name, country_code, image_url",
    )
    .eq("status", "published")
    .order("display_name", { ascending: true });

  if (error) {
    console.error(
      "[players] list failed",
      error.message,
    );
    return [];
  }

  const summaries = (data ?? []).map((row) => toSummary(row));
  const playerIds = summaries.map((player) => player.id);
  if (!playerIds.length) return summaries;

  const { data: links, error: linkError } = await supabase
    .from("player_characters")
    .select("player_id, character_id, role, characters!inner(slug, name_ja, status)")
    .in("player_id", playerIds);
  if (linkError) console.error("[players] list character links failed", linkError.message);

  for (const row of links ?? []) {
    const player = summaries.find((item) => item.id === String(row.player_id));
    const character = row.characters as unknown as { slug: string; name_ja: string; status: string } | null;
    if (!player || !character || character.status !== "published") continue;
    player.characters.push({
      characterId: String(row.character_id),
      characterSlug: character.slug,
      characterName: character.name_ja,
      role: String(row.role ?? "main"),
    });
  }
  return summaries;
}

export async function getPlayerBySlug(
  slug: string,
): Promise<PlayerDetail | null> {
  if (!isConfigured()) return null;

  const supabase = getSupabaseServerClient();

  const { data: player, error } = await supabase
    .from("players")
    .select(
      "id, slug, display_name, real_name, country_code, region, player_type, team_name, bio, image_url, youtube_url, twitch_url, x_url, website_url",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !player) {
    if (error) {
      console.error(
        "[players] detail failed",
        error.message,
      );
    }

    return null;
  }

  const [
    { data: links, error: linkError },
    { data: resultRows, error: resultError },
    sourceLinks,
  ] = await Promise.all([
    supabase
      .from("player_characters")
      .select(
        "character_id, role, characters!inner(slug, name_ja, status)",
      )
      .eq("player_id", player.id),

    supabase
      .from("tournament_results")
      .select("tournament_id, placement, note, tournaments!inner(slug, name, status)")
      .eq("player_id", player.id),

    getPublicEntitySources(
      ["player"],
      [String(player.id)],
    ),
  ]);

  if (linkError) {
    console.error(
      "[players] character links failed",
      linkError.message,
    );
  }
  if (resultError) console.error("[players] tournament results failed", resultError.message);

  return {
    ...toSummary(player),

    realName:
      typeof player.real_name === "string"
        ? player.real_name
        : null,

    region:
      typeof player.region === "string"
        ? player.region
        : null,

    bio:
      typeof player.bio === "string"
        ? player.bio
        : null,

    youtubeUrl:
      typeof player.youtube_url === "string"
        ? player.youtube_url
        : null,

    twitchUrl:
      typeof player.twitch_url === "string"
        ? player.twitch_url
        : null,

    xUrl:
      typeof player.x_url === "string"
        ? player.x_url
        : null,

    websiteUrl:
      typeof player.website_url === "string"
        ? player.website_url
        : null,

    characters: (links ?? []).flatMap((row) => {
      const character = row.characters as unknown as {
        slug: string;
        name_ja: string;
        status: string;
      };

      if (
        !character ||
        character.status !== "published"
      ) {
        return [];
      }

      return [{
        characterId: String(row.character_id),
        characterSlug: character.slug,
        characterName: character.name_ja,
        role: String(row.role ?? "main"),
      }];
    }),

    sources: sourceLinks.map((row) => ({
      id: row.sourceId,
      title: row.title,
      url: row.url,
      publisher: row.publisher,
      sourceType: row.sourceType,
      relationship: row.relationship,
    })),
    tournamentResults: (resultRows ?? []).flatMap((row) => {
      const tournament = row.tournaments as unknown as { slug: string; name: string; status: string } | null;
      if (!tournament || tournament.status !== "published") return [];
      return [{
        tournamentId: String(row.tournament_id),
        tournamentSlug: tournament.slug,
        tournamentName: tournament.name,
        placement: typeof row.placement === "number" ? row.placement : null,
        note: typeof row.note === "string" ? row.note : null,
      }];
    }),
  };
}
