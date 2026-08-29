import type { MetadataRoute } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  return vercelUrl ? `https://${vercelUrl}` : null;
}

function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return [];

  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const staticPaths = [
    "/",
    "/search",
    "/diagnosis",
    "/characters",
    "/moves",
    "/combos",
    "/setups",
    "/sequences",
    "/counters",
    "/training",
    "/players",
    "/videos",
    "/coach",
    "/tools",
    "/compare",
    "/improve",
    "/matchup-card",
    "/about",
    "/faq",
    "/sources",
    "/changelog",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "daily" : "weekly",
  }));

  if (!supabaseConfigured()) return entries;

  const supabase = getSupabaseServerClient();
  const [
    characters,
    moves,
    combos,
    setups,
    sequences,
    counters,
    trainings,
    players,
    videos,
    diagnoses,
  ] = await Promise.all([
    supabase.from("characters").select("slug").eq("status", "published"),
    supabase.from("moves").select("slug").eq("status", "published"),
    supabase.from("combos").select("slug").eq("status", "published").eq("verification_status", "verified"),
    supabase.from("setups").select("slug").eq("status", "published").eq("verification_status", "verified"),
    supabase.from("sequences").select("slug").eq("status", "published").eq("verification_status", "verified"),
    supabase.from("counters").select("slug").eq("status", "published").eq("verification_status", "verified"),
    supabase.from("trainings").select("slug").eq("status", "published").eq("verification_status", "verified"),
    supabase.from("players").select("slug").eq("status", "published"),
    supabase.from("videos").select("slug").eq("status", "published"),
    supabase.from("diagnoses").select("slug").eq("status", "published"),
  ]);

  const dynamicGroups: Array<[string, Array<{ slug: string }> | null, string | null]> = [
    ["/characters", characters.data, characters.error?.message ?? null],
    ["/moves", moves.data, moves.error?.message ?? null],
    ["/combos", combos.data, combos.error?.message ?? null],
    ["/setups", setups.data, setups.error?.message ?? null],
    ["/sequences", sequences.data, sequences.error?.message ?? null],
    ["/counters", counters.data, counters.error?.message ?? null],
    ["/training", trainings.data, trainings.error?.message ?? null],
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
      entries.push({ url: `${siteUrl}${root}/${row.slug}`, changeFrequency: "weekly" });
    }
  }

  return entries;
}
