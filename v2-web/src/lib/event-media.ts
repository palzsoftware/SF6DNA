import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SimpleDetail } from "@/lib/content-detail";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type VideoSummary = {
  id: string;
  slug: string;
  title: string;
  platform: string | null;
  videoType: string | null;
  publishedAt: string | null;
  description: string | null;
};

export async function listVideos(): Promise<VideoSummary[]> {
  if (!configured()) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("id, slug, title, platform, video_type, published_at, description")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[event-media] video list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    platform: typeof row.platform === "string" ? row.platform : null,
    videoType: typeof row.video_type === "string" ? row.video_type : null,
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    description: typeof row.description === "string" ? row.description : null,
  }));
}

export async function getTournamentBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, slug, name, series_name, start_date, end_date, region, venue, event_type, scale, official_url, notes")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.series_name ?? null,
    body: [["開催日", data.start_date ?? null], ["終了日", data.end_date ?? null], ["地域", data.region ?? null], ["会場", data.venue ?? null], ["形式", data.event_type ?? null], ["規模", data.scale ?? null], ["公式URL", data.official_url ?? null], ["補足", data.notes ?? null]],
  };
}

export async function getVideoBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("id, slug, platform, title, url, published_at, description, video_type")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.title),
    summary: data.description ?? null,
    body: [["プラットフォーム", data.platform ?? null], ["種類", data.video_type ?? null], ["公開日", data.published_at ?? null], ["URL", data.url ?? null]],
  };
}
