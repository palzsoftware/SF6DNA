import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SearchResultItem } from "@/types/search";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function normalizeSearchQuery(input: string) {
  return input.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export async function searchAcrossContent(rawQuery: string): Promise<SearchResultItem[]> {
  const query = normalizeSearchQuery(rawQuery);
  if (!query || !isConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const like = `%${query}%`;

  const [characters, characterAliases, moves, moveAliases, combos, players, playerAliases, glossary] =
    await Promise.all([
      supabase.from("characters").select("id, slug, name_ja, summary").eq("status", "published").ilike("name_ja", like).limit(8),
      supabase.from("character_aliases").select("character_id, alias, characters!inner(id, slug, name_ja, summary, status)").ilike("normalized_alias", like).limit(8),
      supabase.from("moves").select("id, slug, name_ja, character_id, characters(name_ja)").eq("status", "published").ilike("name_ja", like).limit(10),
      supabase.from("move_aliases").select("move_id, alias, moves!inner(id, slug, name_ja, status, characters(name_ja))").ilike("normalized_alias", like).limit(10),
      supabase.from("combos").select("id, slug, name, purpose, characters(name_ja)").eq("status", "published").ilike("name", like).limit(8),
      supabase.from("players").select("id, slug, display_name, player_type").eq("status", "published").ilike("display_name", like).limit(8),
      supabase.from("player_aliases").select("player_id, alias, players!inner(id, slug, display_name, player_type, status)").ilike("normalized_alias", like).limit(8),
      supabase.from("glossary").select("id, slug, term, short_definition").eq("status", "published").ilike("term", like).limit(8),
    ]);

  const results: SearchResultItem[] = [];

  for (const row of characters.data ?? []) {
    results.push({ id: String(row.id), type: "character", title: String(row.name_ja), subtitle: row.summary ?? null, href: `/characters/${row.slug}`, matchedBy: "name" });
  }

  for (const row of characterAliases.data ?? []) {
    const c = row.characters as unknown as { id: string; slug: string; name_ja: string; summary: string | null; status: string };
    if (c?.status === "published") results.push({ id: c.id, type: "character", title: c.name_ja, subtitle: `別名: ${row.alias}`, href: `/characters/${c.slug}`, matchedBy: "alias" });
  }

  for (const row of moves.data ?? []) {
    const character = row.characters as unknown as { name_ja?: string } | null;
    results.push({ id: String(row.id), type: "move", title: String(row.name_ja), subtitle: character?.name_ja ?? null, href: `/moves/${row.slug}`, matchedBy: "name" });
  }

  for (const row of moveAliases.data ?? []) {
    const m = row.moves as unknown as { id: string; slug: string; name_ja: string; status: string; characters?: { name_ja?: string } | null };
    if (m?.status === "published") results.push({ id: m.id, type: "move", title: m.name_ja, subtitle: `別名: ${row.alias}${m.characters?.name_ja ? ` / ${m.characters.name_ja}` : ""}`, href: `/moves/${m.slug}`, matchedBy: "alias" });
  }

  for (const row of combos.data ?? []) {
    const character = row.characters as unknown as { name_ja?: string } | null;
    results.push({ id: String(row.id), type: "combo", title: String(row.name), subtitle: character?.name_ja ?? row.purpose ?? null, href: `/combos/${row.slug}`, matchedBy: "name" });
  }

  for (const row of players.data ?? []) {
    results.push({ id: String(row.id), type: "player", title: String(row.display_name), subtitle: row.player_type ?? null, href: `/players/${row.slug}`, matchedBy: "name" });
  }

  for (const row of playerAliases.data ?? []) {
    const p = row.players as unknown as { id: string; slug: string; display_name: string; player_type: string | null; status: string };
    if (p?.status === "published") results.push({ id: p.id, type: "player", title: p.display_name, subtitle: `別名: ${row.alias}`, href: `/players/${p.slug}`, matchedBy: "alias" });
  }

  for (const row of glossary.data ?? []) {
    results.push({ id: String(row.id), type: "glossary", title: String(row.term), subtitle: row.short_definition ?? null, href: `/glossary/${row.slug}`, matchedBy: "name" });
  }

  const seen = new Set<string>();
  return results.filter((item) => {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
