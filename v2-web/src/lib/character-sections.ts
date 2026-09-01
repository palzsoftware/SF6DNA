import { getDevicePreviewBundle, getDevicePreviewCharacterMoveGlossary } from "@/lib/device-preview";
import {
  localizeComboText,
  localizeCounterText,
  localizeMoveText,
  localizeSetupDetail,
  localizeSetupType,
  localizeSequenceType,
  localizeTrainingLevel,
  localizeTrainingText,
  localizeTrainingType,
} from "@/lib/detail-localization";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isMovePublicReady } from "@/lib/public-move-gate";
import type { CharacterSectionKey } from "@/types/character";

export type CharacterSectionItem = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
  meta: string | null;
};

function previewMeta(
  status: string | null | undefined,
  verificationStatus: string | null | undefined,
  parts: Array<string | number | null | undefined>
) {
  return [
    "未公開プレビュー",
    status ?? null,
    verificationStatus ?? null,
    ...parts,
  ].filter((value) => value !== null && value !== undefined && value !== "").join(" / ");
}

export async function listCharacterSectionItems(
  characterId: string,
  section: Exclude<CharacterSectionKey, "overview">,
  previewToken?: string | null
): Promise<CharacterSectionItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = getSupabaseServerClient();
  const previewBundle = await getDevicePreviewBundle(characterId, previewToken);
  const trainingGlossary = previewBundle && section === "training"
    ? await getDevicePreviewCharacterMoveGlossary(characterId, previewToken)
    : [];

  if (previewBundle) {
    if (section === "moves") {
      return previewBundle.moves.map((row) => {
        const frame = row.frame;
        return {
          id: row.id,
          title: row.name,
          subtitle: localizeMoveText(row.usageSummary) as string | null,
          href: `/moves/${row.slug}`,
          meta: previewMeta(row.status, frame?.verificationStatus, [
            row.moveType,
            frame?.startup ? `発生 ${frame.startup}` : null,
            frame?.onBlock ? `G ${frame.onBlock}` : null,
            typeof frame?.damage === "number" ? `${frame.damage} dmg` : null,
          ]),
        };
      });
    }

    if (section === "combos") {
      return previewBundle.combos.map((row) => ({
        id: row.id,
        title: row.name,
        subtitle: row.purpose,
        href: `/combos/${row.slug}`,
        meta: previewMeta(row.status, row.verificationStatus, [
          typeof row.damage === "number" ? `${row.damage} dmg` : null,
          row.driveCost !== null ? `D ${row.driveCost}` : null,
          row.saCost !== null ? `SA ${row.saCost}` : null,
          row.difficulty ? `難易度 ${row.difficulty}` : null,
        ]),
      }));
    }

    if (section === "setups") {
      return previewBundle.setups.map((row) => ({
        id: row.id,
        title: String(localizeComboText(row.name)),
        subtitle: localizeSetupDetail("description", row.description) as string | null,
        href: `/setups/${row.slug}`,
        meta: previewMeta(row.status, row.verificationStatus, [
          localizeSetupType(row.setupType),
          localizeSetupDetail("frame_advantage", row.frameAdvantage),
          localizeSetupDetail("position", row.position),
        ]),
      }));
    }

    if (section === "sequences") {
      return previewBundle.sequences.map((row) => ({
        id: row.id,
        title: String(localizeComboText(row.name)),
        subtitle: localizeComboText(row.notes ?? row.sequenceText) as string | null,
        href: `/sequences/${row.slug}`,
        meta: previewMeta(row.status, row.verificationStatus, [localizeSequenceType(row.sequenceType)]),
      }));
    }

    if (section === "matchups") {
      return previewBundle.matchups.map((row) => ({
        id: row.id,
        title: String(localizeCounterText(row.title)),
        subtitle: localizeCounterText(row.summary) as string | null,
        href: `/counters/${row.slug}`,
        meta: previewMeta(row.status, row.verificationStatus, [
          row.counterType,
          row.defenderCharacterId === characterId ? "自キャラ側" : "相手側",
          row.difficulty ? `難易度 ${row.difficulty}` : null,
        ]),
      }));
    }

    if (section === "training") {
      return previewBundle.training.map((row) => ({
        id: row.id,
        title: String(localizeTrainingText("name", row.name, trainingGlossary)),
        subtitle: localizeTrainingText("purpose", row.purpose, trainingGlossary) as string | null,
        href: `/training/${row.slug}`,
        meta: previewMeta(row.status, row.verificationStatus, [
          localizeTrainingType(row.trainingType),
          localizeTrainingLevel(row.level),
          row.durationMinutes ? `${row.durationMinutes}分` : null,
        ]),
      }));
    }
  }

  if (section === "moves") {
    const { data, error } = await supabase
      .from("moves")
      .select("id, slug, name_ja, move_type, usage_summary, move_frame_data(startup, on_block, damage, valid_to_patch_id, verification_status)")
      .eq("character_id", characterId)
      .eq("status", "published")
      .order("display_order", { ascending: true });
    if (error) return fail(section, error.message);

    const rows = data ?? [];
    const readiness = await Promise.all(rows.map((row) => isMovePublicReady(String(row.slug))));

    return rows.flatMap((row, index) => {
      if (!readiness[index]) return [];
      const frames = Array.isArray(row.move_frame_data) ? row.move_frame_data : [];
      const currentFrame = frames.find((frame) => frame.valid_to_patch_id === null && frame.verification_status === "verified");
      const metaParts = [
        currentFrame?.startup ? `発生 ${currentFrame.startup}` : null,
        currentFrame?.on_block ? `G ${currentFrame.on_block}` : null,
        typeof currentFrame?.damage === "number" ? `${currentFrame.damage} dmg` : null,
      ].filter(Boolean);
      return [{
        id: String(row.id),
        title: String(row.name_ja),
        subtitle: typeof row.usage_summary === "string"
          ? String(localizeMoveText(row.usage_summary))
          : null,
        href: `/moves/${row.slug}`,
        meta: [row.move_type, ...metaParts].filter(Boolean).join(" / ") || null,
      }];
    });
  }

  if (section === "combos") {
    const { data, error } = await supabase
      .from("combos")
      .select("id, slug, name, purpose, damage, drive_cost, sa_cost, difficulty")
      .eq("character_id", characterId)
      .eq("status", "published")
      .eq("verification_status", "verified")
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
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(localizeComboText(row.name)), subtitle: localizeSetupDetail("description", row.description ?? null) as string | null, href: `/setups/${row.slug}`,
      meta: [localizeSetupType(row.setup_type), localizeSetupDetail("frame_advantage", row.frame_advantage), localizeSetupDetail("position", row.position)].filter(Boolean).join(" / ") || null,
    }));
  }

  if (section === "sequences") {
    const { data, error } = await supabase
      .from("sequences")
      .select("id, slug, name, sequence_type, sequence_text, notes")
      .eq("character_id", characterId)
      .eq("status", "published")
      .eq("verification_status", "verified")
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(localizeComboText(row.name)),
      subtitle: localizeComboText(row.notes ?? row.sequence_text ?? null) as string | null,
      href: `/sequences/${row.slug}`,
      meta: localizeSequenceType(row.sequence_type) as string | null,
    }));
  }

  if (section === "matchups") {
    const { data, error } = await supabase
      .from("counters")
      .select("id, slug, title, summary, counter_type, difficulty, defender_character_id, opponent_character_id")
      .eq("status", "published")
      .eq("verification_status", "verified")
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
      .eq("verification_status", "verified")
      .or(`player_character_id.eq.${characterId},dummy_character_id.eq.${characterId}`)
      .limit(100);
    if (error) return fail(section, error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id), title: String(localizeTrainingText("name", row.name)), subtitle: localizeTrainingText("purpose", row.purpose ?? null) as string | null, href: `/training/${row.slug}`,
      meta: [localizeTrainingType(row.training_type), localizeTrainingLevel(row.level), row.duration_minutes ? `${row.duration_minutes}分` : null].filter(Boolean).join(" / ") || null,
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
