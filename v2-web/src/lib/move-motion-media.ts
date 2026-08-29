import {
  getDevicePreviewMoveMotionMedia,
  isDevicePreviewRequest,
  type DevicePreviewMoveMotionMedia,
} from "@/lib/device-preview";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MoveMotionMedia = DevicePreviewMoveMotionMedia;

export async function listMoveMotionMediaForCharacter(
  characterId: string,
  previewToken?: string | null
): Promise<MoveMotionMedia[]> {
  if (isDevicePreviewRequest(previewToken)) {
    return getDevicePreviewMoveMotionMedia(characterId, previewToken);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("move_motion_media")
    .select("id, move_id, media_type, media_url, poster_url, source_url, source_label, status, display_order, moves!inner(character_id)")
    .eq("moves.character_id", characterId)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[move-motion-media] list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    moveId: String(row.move_id),
    mediaType: row.media_type === "gif" ? "gif" : "video",
    mediaUrl: String(row.media_url),
    posterUrl: typeof row.poster_url === "string" ? row.poster_url : null,
    sourceUrl: typeof row.source_url === "string" ? row.source_url : null,
    sourceLabel: typeof row.source_label === "string" ? row.source_label : null,
    status: String(row.status),
    displayOrder: typeof row.display_order === "number" ? row.display_order : null,
  }));
}
