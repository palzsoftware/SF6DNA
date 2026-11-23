import { getSupabaseServerClient } from "@/lib/supabase/server";

type GlossaryRow = {
  id?: unknown;
  slug?: unknown;
  term?: unknown;
  short_definition?: unknown;
};

export type PublicGlossaryItem = {
  id: string;
  slug: string;
  term: string;
  shortDefinition: string | null;
};

export type PublicGlossaryList =
  | { ok: true; items: PublicGlossaryItem[] }
  | { ok: false; items: [] };

export const GLOSSARY_INDEX_LIMIT = 500;

/** The index is Preview-only until a public release is approved; Production keeps the existing 404. */
export function isGlossaryIndexVisible(environment: string | undefined) {
  return ["development", "preview"].includes(environment ?? "");
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** Drops incomplete or unsafe rows, removes duplicate slugs, and sorts by term for Japanese readers. */
export function normalizeGlossaryRows(rows: unknown): PublicGlossaryItem[] {
  if (!Array.isArray(rows)) return [];
  const seen = new Set<string>();
  const items: PublicGlossaryItem[] = [];
  for (const row of rows as GlossaryRow[]) {
    if (!row || typeof row !== "object") continue;
    const id = text(row.id);
    const slug = text(row.slug);
    const term = text(row.term);
    // A slug is one path segment; never let response data add a path, query or fragment.
    if (!id || !slug || !term || /[\s/?#\\]/.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    items.push({ id, slug, term, shortDefinition: text(row.short_definition) || null });
  }
  return items.sort((a, b) => a.term.localeCompare(b.term, "ja") || a.slug.localeCompare(b.slug));
}

export async function listPublishedGlossary(): Promise<PublicGlossaryList> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return { ok: false, items: [] };
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("glossary")
    .select("id, slug, term, short_definition")
    .eq("status", "published")
    .order("term", { ascending: true })
    .limit(GLOSSARY_INDEX_LIMIT);
  if (error) {
    console.error("[glossary] public list failed");
    return { ok: false, items: [] };
  }
  return { ok: true, items: normalizeGlossaryRows(data) };
}
