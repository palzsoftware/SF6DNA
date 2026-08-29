import { legacyPlayerImageUrl } from "@/lib/legacy-player-images";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlayerDetail, PlayerSummary } from "@/types/player";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function toSummary(row: Record<string, unknown>): PlayerSummary {
  const slug = String(row.slug);
  return {
    id: String(row.id),
    slug,
    displayName: String(row.display_name),
    playerType: typeof row.player_type === "string" ? row.player_type : null,
    teamName: typeof row.team_name === "string" ? row.team_name : null,
    countryCode: typeof row.country_code === "string" ? row.country_code : null,
    imageUrl:
      typeof row.image_url === "string" && row.image_url.trim()
        ? row.image_url
        : legacyPlayerImageUrl(slug),
  };
}

export async function listPlayers(): Promise<PlayerSummary[]> {
  if (!isConfigured()) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, slug, display_name, player_type, team_name, country_code, image_url")
    .eq("status", "published")
    .order("display_name", { ascending: true });

  if (error) {
    console.error("[players] list failed", error.message);
    return [];
  }
  return (data ?? []).map((row) => toSummary(row));
}

export async function getPlayerBySlug(slug: string): Promise<PlayerDetail | null> {
  if (!isConfigured()) return null;
  const supabase = getSupabaseServerClient();
  const { data: player, error } = await supabase
    .from("players")
    .select("id, slug, display_name, real_name, country_code, region, player_type, team_name, bio, image_url, youtube_url, twitch_url, x_url, website_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !player) {
    if (error) console.error("[players] detail failed", error.message);
    return null;
  }

  const [{ data: links, error: linkError }, { data: sourceLinks, error: sourceError }] = await Promise.all([
    supabase
      .from("player_characters")
      .select("character_id, role, characters!inner(slug, name_ja, status)")
      .eq("player_id", player.id),
    supabase
      .from("entity_sources")
      .select("relationship, sources!inner(id, title, url, publisher, source_type)")
      .eq("entity_type", "player")
      .eq("entity_id", player.id),
  ]);

  if (linkError) console.error("[players] character links failed", linkError.message);
  if (sourceError) console.error("[players] source links failed", sourceError.message);

  return {
    ...toSummary(player),
    realName: typeof player.real_name === "string" ? player.real_name : null,
    region: typeof player.region === "string" ? player.region : null,
    bio: typeof player.bio === "string" ? player.bio : null,
    youtubeUrl: typeof player.youtube_url === "string" ? player.youtube_url : null,
    twitchUrl: typeof player.twitch_url === "string" ? player.twitch_url : null,
    xUrl: typeof player.x_url === "string" ? player.x_url : null,
    websiteUrl: typeof player.website_url === "string" ? player.website_url : null,
    characters: (links ?? []).flatMap((row) => {
      const character = row.characters as unknown as { slug: string; name_ja: string; status: string };
      if (!character || character.status !== "published") return [];
      return [{
        characterId: String(row.character_id),
        characterSlug: character.slug,
        characterName: character.name_ja,
        role: String(row.role ?? "main"),
      }];
    }),
    sources: (sourceLinks ?? []).flatMap((row) => {
      const source = row.sources as unknown as {
        id?: string;
        title?: string;
        url?: string;
        publisher?: string | null;
        source_type?: string;
      } | null;
      if (!source?.id || !source.title || !source.url || !source.source_type) return [];
      return [{
        id: source.id,
        title: source.title,
        url: source.url,
        publisher: source.publisher ?? null,
        sourceType: source.source_type,
        relationship: String(row.relationship ?? "supporting"),
      }];
    }),
  };
}
