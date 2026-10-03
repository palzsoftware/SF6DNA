import manifest from "@/data/ALEX_REVIEWED_MEDIA_20261003.json";
import type { DevicePreviewBundle, DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

export const ALEX_CHARACTER_ID = "0a82075f-b2c3-4a3d-9267-89f3da1543dd";

/** Reviewed default clips only. No production grant, remote override or conditional binding. */
export function getAlexReviewedMedia(characterId: string): DevicePreviewMoveMotionMedia[] {
  if (process.env.VERCEL_ENV !== "preview" || characterId !== ALEX_CHARACTER_ID
    || manifest.character_slug !== "alex" || manifest.character_id !== characterId
    || manifest.publication !== "PREVIEW_ONLY") return [];
  return manifest.clips.flatMap((clip) => {
    const matches = manifest.moves.filter(move => move.id === clip.move_id);
    const move = matches[0];
    if (matches.length !== 1 || !move || clip.verification_status !== "approved_for_preview"
      || clip.media_role !== "DEFAULT" || clip.cut_review_status !== "CUT_REVIEW_PASS"
      || clip.visual_review_status !== "PASS" || clip.other_attack_contamination
      || clip.identity_status !== "GAME_INPUT_CROSSCHECK_CONFIRMED"
      || clip.move_slug !== move.slug || clip.name_snapshot !== move.name
      || clip.category !== move.moveType || clip.command_snapshot !== move.command
      || clip.variant !== move.variant || clip.character_id !== characterId
      || !manifest.source_files.some(source => source.filename === clip.source_file)
      || manifest.clips.filter(row => row.move_id === clip.move_id).length !== 1) return [];
    return [{ id: `alex-reviewed-${move.slug}`, moveId: move.id, mediaType: "video" as const,
      mediaUrl: clip.media_url, posterUrl: clip.poster_url, sourceUrl: null,
      sourceLabel: "ユーザー録画（Preview）", status: "approved_for_preview", displayOrder: move.displayOrder }];
  });
}

export function getAlexReviewedBundle(characterId: string): DevicePreviewBundle | null {
  if (process.env.VERCEL_ENV !== "preview" || characterId !== ALEX_CHARACTER_ID) return null;
  const media = new Map(getAlexReviewedMedia(characterId).map(row => [row.moveId, row]));
  return {
    guideSections: [], combos: [], setups: [], sequences: [], matchups: [], training: [],
    moves: [...manifest.moves].sort((a, b) => a.displayOrder - b.displayOrder).map(move => ({
      id: move.id, slug: move.slug, name: move.variant === "OD" ? `OD ${move.name}`
        : move.variant === "HEAVY" ? `強 ${move.name}` : move.name,
      moveType: move.moveType, usageSummary: null, status: "draft", frame: null,
      media: media.get(move.id) ?? null,
      commands: [{ moveId: move.id, scheme: "classic", commandText: move.command,
        numericNotation: move.command, buttonNotation: null, conditionText: null, sortOrder: 0 }],
    })),
  };
}
