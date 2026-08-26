"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { isReferenceKind, REFERENCE_META, type ReferenceKind } from "@/lib/admin-reference";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const nullableNumber = (fd: FormData, key: string) => {
  const raw = text(fd, key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};
const checkbox = (fd: FormData, key: string) => fd.get(key) === "on";

function assertKind(kind: string): asserts kind is ReferenceKind {
  if (!isReferenceKind(kind)) throw new Error("Unsupported reference kind");
}

function payloadFor(kind: ReferenceKind, fd: FormData) {
  const status = text(fd, "status") || "draft";
  switch (kind) {
    case "players":
      return {
        slug: text(fd, "slug"),
        display_name: text(fd, "display_name"),
        real_name: nullable(fd, "real_name"),
        country_code: nullable(fd, "country_code"),
        region: nullable(fd, "region"),
        player_type: text(fd, "player_type"),
        team_name: nullable(fd, "team_name"),
        bio: nullable(fd, "bio"),
        image_url: nullable(fd, "image_url"),
        youtube_url: nullable(fd, "youtube_url"),
        twitch_url: nullable(fd, "twitch_url"),
        x_url: nullable(fd, "x_url"),
        website_url: nullable(fd, "website_url"),
        is_active: checkbox(fd, "is_active"),
        status,
      };
    case "tournaments":
      return {
        slug: text(fd, "slug"),
        name: text(fd, "name"),
        series_name: nullable(fd, "series_name"),
        start_date: nullable(fd, "start_date"),
        end_date: nullable(fd, "end_date"),
        region: nullable(fd, "region"),
        venue: nullable(fd, "venue"),
        event_type: nullable(fd, "event_type"),
        scale: nullable(fd, "scale"),
        official_url: nullable(fd, "official_url"),
        notes: nullable(fd, "notes"),
        status,
      };
    case "videos":
      return {
        slug: nullable(fd, "slug"),
        platform: text(fd, "platform"),
        external_id: nullable(fd, "external_id"),
        url: text(fd, "url"),
        title: text(fd, "title"),
        description: nullable(fd, "description"),
        thumbnail_url: nullable(fd, "thumbnail_url"),
        channel_name: nullable(fd, "channel_name"),
        published_at: nullable(fd, "published_at"),
        video_type: nullable(fd, "video_type"),
        duration_seconds: nullableNumber(fd, "duration_seconds"),
        status,
      };
    case "glossary":
      return {
        slug: text(fd, "slug"),
        term: text(fd, "term"),
        short_definition: nullable(fd, "short_definition"),
        definition: text(fd, "definition"),
        category: nullable(fd, "category"),
        beginner_level: nullable(fd, "beginner_level"),
        status,
      };
  }
}

function validate(kind: ReferenceKind, payload: Record<string, unknown>) {
  if (kind !== "videos" && !payload.slug) throw new Error("slug is required");
  if (kind === "players" && (!payload.display_name || !payload.player_type)) throw new Error("display_name and player_type are required");
  if (kind === "tournaments" && !payload.name) throw new Error("name is required");
  if (kind === "videos" && (!payload.platform || !payload.url || !payload.title)) throw new Error("platform, url and title are required");
  if (kind === "glossary" && (!payload.term || !payload.definition)) throw new Error("term and definition are required");
}

export async function saveReferenceContent(kindValue: string, id: string | null, formData: FormData) {
  assertKind(kindValue);
  const kind = kindValue;
  const { supabase } = await requireAdmin();
  const payload = payloadFor(kind, formData) as Record<string, unknown>;
  validate(kind, payload);
  const table = REFERENCE_META[kind].table;

  if (id) {
    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/reference/${kind}`);
  revalidatePath(REFERENCE_META[kind].publicPath);
  redirect(`/admin/reference/${kind}`);
}

export async function archiveReferenceContent(kindValue: string, id: string) {
  assertKind(kindValue);
  const kind = kindValue;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(REFERENCE_META[kind].table).update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/reference/${kind}`);
}
