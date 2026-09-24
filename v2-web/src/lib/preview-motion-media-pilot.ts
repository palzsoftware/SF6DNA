import jpManifest from "@/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json";
import ryuManifest from "@/data/SF6DNA_VER1_RYU_MEDIA_MANIFEST_20260924.json";
import lukeManifest from "@/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json";
import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

const JP_CHARACTER_ID = "87077ba6-e9da-48b7-b3bd-2499ea4f6d86";
const RYU_CHARACTER_ID = "9c3a7aaa-e090-40a6-b598-f63afb761b77";
const LUKE_CHARACTER_ID = "1e4e3f57-7ba0-454c-86d7-72b1deeb3713";

type PilotClip = (typeof jpManifest.clips)[number] | (typeof ryuManifest.clips)[number] | (typeof lukeManifest.clips)[number];

function toPreviewRecord(clip: PilotClip, displayOrder: number, characterSlug: string): DevicePreviewMoveMotionMedia {
  return {
    id: `${characterSlug}-motion-pilot-${clip.move_slug}-${clip.variant}`,
    moveId: clip.move_id,
    mediaType: clip.media_type === "gif" ? "gif" : "video",
    mediaUrl: clip.media_url,
    posterUrl: clip.poster_url,
    sourceUrl: null,
    sourceLabel: "ユーザー録画（Preview Pilot）",
    status: clip.verification_status,
    displayOrder,
  };
}

export function getPreviewPilotMotionMedia(characterId: string): DevicePreviewMoveMotionMedia[] {
  const manifest = characterId === JP_CHARACTER_ID && jpManifest.character_slug === "jp" ? jpManifest
    : characterId === RYU_CHARACTER_ID && ryuManifest.character_slug === "ryu" ? ryuManifest
    : characterId === LUKE_CHARACTER_ID && lukeManifest.character_slug === "luke" ? lukeManifest
    : null;
  if (!manifest) return [];
  return manifest.clips
    .filter((clip) => clip.verification_status === "approved_for_preview")
    .map((clip, index) => toPreviewRecord(clip, index, manifest.character_slug));
}
