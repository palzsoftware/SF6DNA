import manifest from "@/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json";
import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

const JP_CHARACTER_ID = "87077ba6-e9da-48b7-b3bd-2499ea4f6d86";

type PilotClip = (typeof manifest.clips)[number];

function toPreviewRecord(clip: PilotClip, displayOrder: number): DevicePreviewMoveMotionMedia {
  return {
    id: `jp-motion-pilot-${clip.move_slug}-${clip.variant}`,
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
  if (characterId !== JP_CHARACTER_ID || manifest.character_slug !== "jp") return [];
  return manifest.clips
    .filter((clip) => clip.verification_status === "approved_for_preview")
    .map((clip, index) => toPreviewRecord(clip, index));
}
