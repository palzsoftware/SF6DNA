import snapshot from "@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json";
import handoff from "@/data/ALEX_ID_LEVEL_HANDOFF_20261006.json";
import manifest from "@/data/ALEX_REVIEWED_MEDIA_20261003.json";
import { ALEX_CHARACTER_ID, getAlexReviewedMedia } from "@/lib/alex-reviewed-media";
import type { DevicePreviewBundle, DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

/** Overlay cannot replace data or join by names. Handoff does not grant publication. */
export function overlayAlexReviewedMedia(base: DevicePreviewBundle, media: DevicePreviewMoveMotionMedia[]): DevicePreviewBundle {
  const uniqueBase = new Set(base.moves.map(m => m.id)).size === base.moves.length;
  return { ...base, moves: base.moves.map(move => {
    const identities = manifest.moves.filter(m => m.id === move.id && m.slug === move.slug && m.moveType === move.moveType);
    const identity = identities.length === 1 ? identities[0] : null;
    const owner = handoff.moves.filter(m => m.id === move.id && m.slug === move.slug);
    const candidates = media.filter(m => m.moveId === move.id);
    const commandMatches = identity && move.commands?.some(c => c.scheme === "classic" &&
      (c.numericNotation ?? c.commandText)?.toUpperCase() === identity.command.toUpperCase());
    const candidate = uniqueBase && owner.length === 1 && owner[0].mediaStatus === "READY_REUSED"
      && identity && commandMatches && candidates.length === 1 && candidates[0].status === "approved_for_preview"
      && candidates[0].id === `alex-reviewed-${move.slug}` ? candidates[0] : null;
    return { ...move, media: candidate ? { ...candidate } : null };
  }) };
}
export function getAlexFullDataWithReviewedMedia(characterId: string): DevicePreviewBundle | null {
  if (process.env.VERCEL_ENV !== "preview" || characterId !== ALEX_CHARACTER_ID || snapshot.characters.alex.characterId !== characterId) return null;
  const base: DevicePreviewBundle = { guideSections: [], combos: [], setups: [], sequences: [], matchups: [], training: [],
    moves: structuredClone(snapshot.characters.alex.moves) };
  return overlayAlexReviewedMedia(base, getAlexReviewedMedia(characterId));
}
