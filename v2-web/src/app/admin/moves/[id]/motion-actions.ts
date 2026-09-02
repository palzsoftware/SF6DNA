"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const allowedStatuses = new Set(["draft", "reviewed", "published"]);
const allowedMediaTypes = new Set(["gif", "video"]);
const uploadStatuses = new Set(["draft", "reviewed"]);
const uploadMimeTypes: ReadonlyMap<string, { mediaType: "gif" | "video"; extension: "gif" | "mp4" | "webm" }> = new Map([
  ["image/gif", { mediaType: "gif", extension: "gif" }],
  ["video/mp4", { mediaType: "video", extension: "mp4" }],
  ["video/webm", { mediaType: "video", extension: "webm" }],
] as const);
const motionBucket = "move-motion-media";
const maxUploadBytes = 25 * 1024 * 1024;

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

export async function uploadMoveMotionMedia(moveId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("media_file");
  const status = text(formData, "status") || "reviewed";
  const sourceUrl = nullable(formData, "source_url");
  const sourceLabel = nullable(formData, "source_label") || "自前実機キャプチャ";

  if (!(file instanceof File) || file.size === 0) throw new Error("GIFまたは短尺動画を選択してください");
  if (file.size > maxUploadBytes) throw new Error("ファイルサイズは25MB以下にしてください");
  const fileType = uploadMimeTypes.get(file.type);
  if (!fileType) throw new Error("登録できる形式はGIF、MP4、WebMです");
  if (!uploadStatuses.has(status)) throw new Error("アップロード時の状態はdraftまたはreviewedを選んでください");
  if (sourceUrl) assertHttpsUrl(sourceUrl, "Source URL");

  const { data: move, error: moveError } = await supabase
    .from("moves")
    .select("id, slug, characters(slug)")
    .eq("id", moveId)
    .maybeSingle();
  if (moveError) throw new Error(moveError.message);
  if (!move) throw new Error("技データが見つかりません");

  const character = move.characters as unknown as { slug?: string } | null;
  if (!character?.slug) throw new Error("キャラクター情報が見つかりません");
  const storagePath = `${character.slug}/${move.slug}/${crypto.randomUUID()}.${fileType.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(motionBucket)
    .upload(storagePath, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage.from(motionBucket).getPublicUrl(storagePath);
  const { error: insertError } = await supabase.from("move_motion_media").insert({
    move_id: moveId,
    media_type: fileType.mediaType,
    media_url: publicUrlData.publicUrl,
    storage_path: storagePath,
    source_url: sourceUrl,
    source_label: sourceLabel,
    status,
    display_order: displayOrder(formData),
  });

  if (insertError) {
    await supabase.storage.from(motionBucket).remove([storagePath]);
    throw new Error(insertError.message);
  }

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
