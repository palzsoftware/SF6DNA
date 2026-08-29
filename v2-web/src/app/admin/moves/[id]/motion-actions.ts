"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const allowedStatuses = new Set(["draft", "reviewed", "published"]);
const allowedMediaTypes = new Set(["gif", "video"]);

function text(fd: FormData, key: string) {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullable(fd: FormData, key: string) {
  return text(fd, key) || null;
}

function displayOrder(fd: FormData) {
  const raw = text(fd, "display_order");
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isInteger(value)) throw new Error("display_order must be an integer");
  return value;
}

function assertHttpsUrl(value: string, label: string) {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL`);
  }
  if (parsed.protocol !== "https:") throw new Error(`${label} must use HTTPS`);
}

export async function addMoveMotionMedia(moveId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const mediaType = text(formData, "media_type");
  const mediaUrl = text(formData, "media_url");
  const posterUrl = nullable(formData, "poster_url");
  const sourceUrl = nullable(formData, "source_url");
  const sourceLabel = nullable(formData, "source_label");
  const status = text(formData, "status") || "draft";

  if (!allowedMediaTypes.has(mediaType)) throw new Error("media_type must be gif or video");
  if (!allowedStatuses.has(status)) throw new Error("invalid motion media status");
  if (!mediaUrl) throw new Error("media_url is required");
  assertHttpsUrl(mediaUrl, "media_url");
  if (posterUrl) assertHttpsUrl(posterUrl, "poster_url");
  if (sourceUrl) assertHttpsUrl(sourceUrl, "source_url");

  const { data: move, error: moveError } = await supabase
    .from("moves")
    .select("id, status")
    .eq("id", moveId)
    .maybeSingle();
  if (moveError) throw new Error(moveError.message);
  if (!move) throw new Error("Move not found");

  if (status === "published") {
    if (move.status !== "published") {
      throw new Error("Move本体がpublishedになるまではMotion Mediaをpublishedにできません");
    }
    if (!sourceUrl || !sourceLabel) {
      throw new Error("published Motion MediaにはSource URLとSource Labelが必要です");
    }
  }

  const { error } = await supabase.from("move_motion_media").insert({
    move_id: moveId,
    media_type: mediaType,
    media_url: mediaUrl,
    poster_url: posterUrl,
    source_url: sourceUrl,
    source_label: sourceLabel,
    status,
    display_order: displayOrder(formData),
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/moves/${moveId}`);
  revalidatePath("/characters");
}

export async function archiveMoveMotionMedia(moveId: string, mediaId: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("move_motion_media")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", mediaId)
    .eq("move_id", moveId)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Motion Media not found for this Move");

  revalidatePath(`/admin/moves/${moveId}`);
  revalidatePath("/characters");
}
