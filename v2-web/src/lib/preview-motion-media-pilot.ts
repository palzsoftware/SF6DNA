import jpManifest from "@/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json";
import ryuManifest from "@/data/SF6DNA_VER1_RYU_MEDIA_MANIFEST_20260924.json";
import lukeManifest from "@/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json";
import lukeGifManifest from "@/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json";
import manonManifest from "@/data/SF6DNA_VER1_MANON_MEDIA_MANIFEST_20260925.json";
import yasmineManifest from "@/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json";
import marisaManifest from "@/data/SF6DNA_VER1_MARISA_MEDIA_MANIFEST_20261003.json";
import jamieManifest from "@/data/SF6DNA_VER1_JAMIE_MEDIA_MANIFEST_20261003.json";
import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

const JP_CHARACTER_ID = "87077ba6-e9da-48b7-b3bd-2499ea4f6d86";
const RYU_CHARACTER_ID = "9c3a7aaa-e090-40a6-b598-f63afb761b77";
const LUKE_CHARACTER_ID = "1e4e3f57-7ba0-454c-86d7-72b1deeb3713";
const MANON_CHARACTER_ID = "efc5d359-27ec-4660-937c-dc0d84e862f8";
const MARISA_CHARACTER_ID = "e224c371-84b8-4bf4-bde9-3b65d8d8a3b9";
const JAMIE_CHARACTER_ID = "558f125c-3ddf-472c-9a15-7f9ce20c9580";
const YASMINE_CHARACTER_ID = "a9f61f3f-d6e0-4f98-8f1f-6fb94fae7baa";

type PilotClip = (typeof jpManifest.clips)[number] | (typeof ryuManifest.clips)[number] | (typeof lukeManifest.clips)[number] | (typeof manonManifest.clips)[number] | (typeof yasmineManifest.clips)[number] | (typeof jamieManifest.clips)[number] | (typeof marisaManifest.clips)[number];

/** The fields the Preview card needs. PilotClip (MP4 manifests) and the Luke GIF manifest both satisfy it. */
type MotionClip = {
  move_id: string;
  move_slug: string;
  variant: string;
  media_type: string;
  media_url: string;
  poster_url?: string | null;
  verification_status: string;
};

function toPreviewRecord(clip: MotionClip, displayOrder: number, characterSlug: string): DevicePreviewMoveMotionMedia {
  return {
    id: `${characterSlug}-motion-pilot-${clip.move_slug}-${clip.variant}`,
    moveId: clip.move_id,
    mediaType: clip.media_type === "gif" ? "gif" : "video",
    mediaUrl: clip.media_url,
    posterUrl: clip.poster_url ?? null,
    sourceUrl: null,
    sourceLabel: "ユーザー録画（Preview Pilot）",
    status: clip.verification_status,
    displayOrder,
  };
}

/** Hold applies to all Yasmine Preview media sources, not only local approved clips. */
export function isPreviewPilotMotionMediaHeld(characterId: string): boolean {
  return characterId === YASMINE_CHARACTER_ID;
}

export function getPreviewPilotMotionMedia(characterId: string): DevicePreviewMoveMotionMedia[] {
  if (isPreviewPilotMotionMediaHeld(characterId)) return [];
  const manifest = characterId === JP_CHARACTER_ID && jpManifest.character_slug === "jp" ? jpManifest
    : characterId === RYU_CHARACTER_ID && ryuManifest.character_slug === "ryu" ? ryuManifest
    : characterId === LUKE_CHARACTER_ID && lukeManifest.character_slug === "luke" ? lukeManifest
    : characterId === MARISA_CHARACTER_ID && marisaManifest.character_slug === "marisa" ? marisaManifest
    : characterId === JAMIE_CHARACTER_ID && jamieManifest.character_slug === "jamie" ? jamieManifest
    : characterId === MANON_CHARACTER_ID && manonManifest.character_slug === "manon" ? manonManifest
    : characterId === YASMINE_CHARACTER_ID && yasmineManifest.character_slug === "yasmine" ? yasmineManifest
    : null;
  if (!manifest) return [];
  const records = manifest.clips
    .filter((clip) => clip.verification_status === "approved_for_preview")
    .map((clip, index) => toPreviewRecord(clip, index, manifest.character_slug));
  if (characterId !== LUKE_CHARACTER_ID) return records;
  return [...records, ...getLukeGifMotionMedia(new Set(records.map((record) => record.moveId)), records.length)];
}

/**
 * Luke GIFs (docs: scripts/luke-gif). Same Preview-only gate as the MP4 clips: only "approved_for_preview" is shown.
 * A move that already has an MP4 clip keeps it; its GIF is never added on top.
 */
function getLukeGifMotionMedia(movesWithMp4: ReadonlySet<string>, firstDisplayOrder: number): DevicePreviewMoveMotionMedia[] {
  if (lukeGifManifest.character_slug !== "luke") return [];
  return (lukeGifManifest.clips as ReadonlyArray<MotionClip>)
    .filter((clip) => clip.verification_status === "approved_for_preview" && !movesWithMp4.has(clip.move_id))
    .map((clip, index) => toPreviewRecord(clip, firstDisplayOrder + index, "luke"));
}
