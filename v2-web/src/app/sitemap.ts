import type { MetadataRoute } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  return vercelUrl ? `https://${vercelUrl}` : null;
}

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (
    process.env.VERCEL_ENV &&
    process.env.VERCEL_ENV !== "production"
  ) {
    return [];
  }

  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const staticPaths = [
    "/",
    "/search",
    "/diagnosis",
    "/characters",
    "/players",
    "/videos",
    "/about",
    "/faq",
    "/sources",
    "/changelog",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "/" ? "daily" : "weekly",
  }));

  if (!supabaseConfigured()) return entries;

  const supabase = getSupabaseServerClient();

  const [
    characters,
    players,
    videos,
    diagnoses,
  ] = await Promise.all([
    supabase
      .from("characters")
      .select("slug")
      .eq("status", "published"),

    supabase
      .from("players")
      .select("slug")
      .eq("status", "published"),

    supabase
      .from("videos")
      .select("slug")
      .eq("status", "published"),

    supabase
      .from("diagnoses")
      .select("slug")
      .eq("status", "published"),
  ]);

  const dynamicGroups: Array<
    [string, Array<{ slug: string }> | null, string | null]
  > = [
    ["/characters", characters.data, characters.error?.message ?? null],
    ["/players", players.data, players.error?.message ?? null],
    ["/videos", videos.data, videos.error?.message ?? null],
    ["/diagnosis", diagnoses.data, diagnoses.error?.message ?? null],
  ];

  for (const [root, rows, error] of dynamicGroups) {
    if (error) {
      console.error(`[sitemap] ${root} lookup failed`, error);
      continue;
    }

    for (const row of rows ?? []) {
      if (!row.slug) continue;

      entries.push({
        url: `${siteUrl}${root}/${row.slug}`,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}
