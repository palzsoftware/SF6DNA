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

  const results = await Promise.allSettled([
    supabase
      .from("characters")
      .select("slug")
      .eq("status", "published")
      .eq("is_playable", true),

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

  const roots = ["/characters", "/players", "/videos", "/diagnosis"];
  const seen = new Set(entries.map((entry) => entry.url));
  for (const [index, result] of results.entries()) {
    const root = roots[index];
    if (result.status === "rejected" || result.value.error) {
      // Keep other published groups and static URLs available, without logging DB details.
      console.error(`[sitemap] ${root} lookup failed`);
      continue;
    }
    if (!Array.isArray(result.value.data)) continue;
    for (const row of result.value.data) {
      if (!row || typeof row.slug !== "string" || !row.slug.trim()) continue;
      // A slug is one path segment; never turn response data into a query or fragment.
      const url = `${siteUrl}${root}/${encodeURIComponent(row.slug)}`;
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}
