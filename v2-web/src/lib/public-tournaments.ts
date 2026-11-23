import { getSupabaseServerClient } from "@/lib/supabase/server";

type TournamentRow = {
  id?: unknown;
  slug?: unknown;
  name?: unknown;
  series_name?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  region?: unknown;
};

export type PublicTournamentItem = {
  id: string;
  slug: string;
  name: string;
  seriesName: string | null;
  startDate: string | null;
  endDate: string | null;
  region: string | null;
};

export type PublicTournamentList =
  | { ok: true; items: PublicTournamentItem[] }
  | { ok: false; items: [] };

export const TOURNAMENT_INDEX_LIMIT = 500;

/** The index is Preview-only until a public release is approved; Production keeps the existing 404. */
export function isTournamentIndexVisible(environment: string | undefined) {
  return ["development", "preview"].includes(environment ?? "");
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** Accepts only YYYY-MM-DD dates so the list never shows an unparsed value. */
function isoDate(value: unknown) {
  const date = text(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

/** Drops incomplete or unsafe rows, removes duplicate slugs, newest start date first (undated last). */
export function normalizeTournamentRows(rows: unknown): PublicTournamentItem[] {
  if (!Array.isArray(rows)) return [];
  const seen = new Set<string>();
  const items: PublicTournamentItem[] = [];
  for (const row of rows as TournamentRow[]) {
    if (!row || typeof row !== "object") continue;
    const id = text(row.id);
    const slug = text(row.slug);
    const name = text(row.name);
    // A slug is one path segment; never let response data add a path, query or fragment.
    if (!id || !slug || !name || /[\s/?#\\]/.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    items.push({
      id, slug, name,
      seriesName: text(row.series_name) || null,
      startDate: isoDate(row.start_date),
      endDate: isoDate(row.end_date),
      region: text(row.region) || null,
    });
  }
  return items.sort((a, b) => {
    if (a.startDate !== b.startDate) {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return b.startDate.localeCompare(a.startDate);
    }
    return a.name.localeCompare(b.name, "ja") || a.slug.localeCompare(b.slug);
  });
}

/** "2026年3月1日" or "2026年3月1日〜3月2日"; null when the start date is unknown. */
export function formatTournamentPeriod(startDate: string | null, endDate: string | null): string | null {
  if (!startDate) return null;
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const start = `${sy}年${sm}月${sd}日`;
  if (!endDate || endDate <= startDate) return start;
  const [ey, em, ed] = endDate.split("-").map(Number);
  return `${start}〜${ey === sy ? "" : `${ey}年`}${em}月${ed}日`;
}

export async function listPublishedTournaments(): Promise<PublicTournamentList> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return { ok: false, items: [] };
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, slug, name, series_name, start_date, end_date, region")
    .eq("status", "published")
    .order("start_date", { ascending: false, nullsFirst: false })
    .limit(TOURNAMENT_INDEX_LIMIT);
  if (error) {
    console.error("[tournaments] public list failed");
    return { ok: false, items: [] };
  }
  return { ok: true, items: normalizeTournamentRows(data) };
}
