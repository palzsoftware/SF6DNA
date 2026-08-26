import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CharacterSectionKey } from "@/types/character";

export type CharacterSectionItem = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
  meta: string | null;
};

export async function listCharacterSectionItems(
  characterId: string,
  section: Exclude<CharacterSectionKey, "overview">
): Promise<CharacterSectionItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = getSupabaseServerClient();

  if (section === "moves") {
    const { data, error } = await supabase
      .from("moves")
      .select("id, slug, name_ja, move_type, usage_summary, move_frame_data(startup, on_block, damage, valid_to_patch_id)")
      .eq("character_id", characterId)
      .eq("status", "published")
      .order("display_order", { ascending: true });
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => {
      const frames = Array.isArray(row.move_frame_data) ? row.move_frame_data : [];
      const currentFrame = frames.find((frame) => frame.valid_to_patch_id === null) ?? frames[0];
      const metaParts = [
        currentFrame?.startup ? `発生 ${currentFrame.startup}` : null,
        currentFrame?.on_block ? `G ${currentFrame.on_block}` : null,
        typeof currentFrame?.damage === "number" ? `${currentFrame.damage} dmg` : null,
      ].filter(Boolean);
      return {
        id: String(row.id),
        title: String(row.name_ja),
        subtitle: typeof row.usage_summary === "string" ? row.usage_summary : null,
        href: `/moves/${row.slug}`,
        meta: [row.move_type, ...metaParts].filter(Boolean).join(" / ") || null,
      };
    });
  }

  if (section === "combos") {
    const { data, error } = await supabase
      .from("combos")
      .select("id, slug, name, purpose, damage, drive_cost, sa_cost, difficulty")
      .eq("character_id", characterId)
      .eq("status", "published")
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(row.name), subtitle: row.purpose ?? null, href: `/combos/${row.slug}`,
      meta: [`${row.damage ?? "?"} dmg`, row.drive_cost !== null ? `D ${row.drive_cost}` : null, row.sa_cost !== null ? `SA ${row.sa_cost}` : null, row.difficulty ? `難易度 ${row.difficulty}` : null].filter(Boolean).join(" / "),
    }));
  }

  if (section === "setups") {
    const { data, error } = await supabase
      .from("setups")
      .select("id, slug, name, setup_type, description, frame_advantage, position")
      .eq("character_id", characterId)
      .eq("status", "published")
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(row.name), subtitle: row.description ?? null, href: `/setups/${row.slug}`,
      meta: [row.setup_type, row.frame_advantage, row.position].filter(Boolean).join(" / ") || null,
    }));
  }

  if (section === "matchups") {
    const { data, error } = await supabase
      .from("counters")
      .select("id, slug, title, summary, counter_type, difficulty, defender_character_id, opponent_character_id")
      .eq("status", "published")
      .or(`defender_character_id.eq.${characterId},opponent_character_id.eq.${characterId}`)
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(row.title), subtitle: row.summary ?? null, href: `/counters/${row.slug}`,
      meta: [row.counter_type, row.defender_character_id === characterId ? "自キャラ側" : "相手側", row.difficulty ? `難易度 ${row.difficulty}` : null].filter(Boolean).join(" / ") || null,
    }));
  }

  if (section === "training") {
    const { data, error } = await supabase
      .from("trainings")
      .select("id, slug, name, purpose, training_type, level, duration_minutes, player_character_id, dummy_character_id")
      .eq("status", "published")
      .or(`player_character_id.eq.${characterId},dummy_character_id.eq.${characterId}`)
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(row.name), subtitle: row.purpose ?? null, href: `/training/${row.slug}`,
      meta: [row.training_type, row.level, row.duration_minutes ? `${row.duration_minutes}分` : null].filter(Boolean).join(" / ") || null,
    }));
  }

  if (section === "players") {
    const { data, error } = await supabase
      .from("player_characters")
      .select("role, players!inner(id, slug, display_name, player_type, team_name, status)")
      .eq("character_id", characterId);
    if (error) return fail(section, error.message);
    return (data ?? []).flatMap((row) => {
      const player = row.players as unknown as { id: string; slug: string; display_name: string; player_type: string | null; team_name: string | null; status: string } | null;
      if (!player || player.status !== "published") return [];
      return [{
        id: player.id,
        title: player.display_name,
        subtitle: player.team_name,
        href: `/players/${player.slug}`,
        meta: [row.role, player.player_type].filter(Boolean).join(" / ") || null,
      }];
    });
  }

  if (section === "videos") {
    const { data, error } = await supabase
      .from("entity_videos")
      .select("relationship, display_order, videos!inner(id, slug, title, video_type, description, status)")
      .eq("entity_type", "character")
      .eq("entity_id", characterId)
      .order("display_order", { ascending: true });
    if (error) return fail(section, error.message);
    return (data ?? []).flatMap((row) => {
      const video = row.videos as unknown as { id: string; slug: string; title: string; video_type: string | null; description: string | null; status: string } | null;
      if (!video || video.status !== "published") return [];
      return [{
        id: video.id,
        title: video.title,
        subtitle: video.description,
        href: `/videos/${video.slug}`,
        meta: [row.relationship, video.video_type].filter(Boolean).join(" / ") || null,
      }];
    });
  }

  return [];
}

function fail(section: string, message: string): CharacterSectionItem[] {
  console.error(`[character-sections] ${section} failed`, message);
  return [];
}
