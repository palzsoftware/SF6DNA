import orderData from "@/data/official-move-order.json";

/** Saved official command-list order per character: [official row key, official name] (scripts/moves/build_official_move_order.mjs). */
type OrderRow = readonly [string | null, string];
const ORDER = (orderData as unknown as { byCharacter: Record<string, readonly OrderRow[]> }).byCharacter;

type OrderableMove = { id: string; name: string; ws5CanonicalSource?: string; officialFrameKey?: string };

/** Spaces and full-width variants removed, so "強スピンサイズ" and "強 スピンサイズ" are the same name. */
const normalize = (name: string) => name.normalize("NFKC").replace(/\s+/g, "").trim();
/** Name without a trailing official note, e.g. "立ち弱P（チークスパン）" → "立ち弱P". */
const base = (name: string) => normalize(name).replace(/\([^()]*\)$/, "");
/** Name without strength / SA / state prefixes, e.g. "OD ライノホーン" → "ライノホーン", "SA2リヴァイブダンス" → "リヴァイブダンス". */
const core = (name: string) => base(name).replace(/^\[[^\]]*\]/, "").replace(/^(弱|中|強|OD|SA[1-3]|CA)/, "");

const preview = (id: string) => id.startsWith("sf6dna-preview:") ? decodeURIComponent(id.split(":").slice(2).join(":")) : null;

/**
 * Position of a move in the saved official command list, or Infinity when no official row matches (kept after the
 * matched moves, in their existing order). Matching: official row key, then exact name, then name without the
 * trailing note, then name without strength/SA prefixes (placed just after that row).
 */
export function officialMoveOrderIndex(characterSlug: string, move: OrderableMove): number {
  const rows = ORDER[characterSlug];
  if (!rows?.length) return Infinity;
  const key = move.ws5CanonicalSource ?? move.officialFrameKey ?? preview(move.id);
  if (key) { const index = rows.findIndex(([rowKey]) => rowKey === key); if (index >= 0) return index; }
  const name = normalize(move.name);
  const exact = rows.findIndex(([, rowName]) => normalize(rowName) === name);
  if (exact >= 0) return exact;
  const short = base(move.name);
  const byBase = rows.findIndex(([, rowName]) => base(rowName) === short);
  if (byBase >= 0) return byBase;
  const loose = core(move.name);
  const byCore = loose ? rows.findIndex(([, rowName]) => core(rowName) === loose) : -1;
  return byCore >= 0 ? byCore + 0.5 : Infinity;
}

/** Stable sort into the official command-list order; moves without an official row keep their relative order at the end. */
export function sortByOfficialMoveOrder<T>(characterSlug: string, items: readonly T[], moveOf: (item: T) => OrderableMove): T[] {
  return items.map((item, position) => ({ item, position, index: officialMoveOrderIndex(characterSlug, moveOf(item)) }))
    .sort((a, b) => a.index - b.index || a.position - b.position).map(entry => entry.item);
}
