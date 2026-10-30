/** Search aliases describe a query; they never create a published relation. */
export const VIDEO_TOURNAMENT_ALIASES = [
  { id: "capcom_cup", aliases: ["capcom cup", "カプコンカップ", "cc"] },
  { id: "sfl", aliases: ["street fighter league", "ストリートファイターリーグ", "sfl"] },
  { id: "evo", aliases: ["evo"] },
  { id: "ewc", aliases: ["esports world cup", "eスポーツワールドカップ", "ewc"] },
  { id: "ufa", aliases: ["ultimate fighting arena", "ufa"] },
  { id: "world_warrior", aliases: ["world warrior", "ワールドウォリアー", "ww"] },
] as const;

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[()（）‐‑–—−_・-]/g, " ").replace(/\s+/g, " ").trim();
}

function aliasPattern(alias: string) {
  return normalize(alias).split(" ").map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
}

export function extractVideoTournamentIntent(input: string) {
  let remainingText = normalize(input);
  const events = new Set<string>();
  const years = new Set<string>();
  for (const entry of VIDEO_TOURNAMENT_ALIASES) {
    const alternatives = [...entry.aliases].sort((a, b) => b.length - a.length).map(aliasPattern).join("|");
    // A year can be attached to an abbreviation, but other word substrings cannot.
    const pattern = new RegExp(`(^|[^a-z0-9])(?:${alternatives})(?=20\\d{2}(?!\\d)|[^a-z0-9]|$)`, "gu");
    remainingText = remainingText.replace(pattern, (_match, prefix: string) => {
      events.add(entry.id);
      return `${prefix} `;
    });
  }
  if (events.size) {
    remainingText = remainingText.replace(/(^|\s)(20\d{2})(?:年度|年)?(?=\s|$)/gu, (_match, prefix: string, year: string) => {
      years.add(year);
      return prefix;
    });
    if (years.size) remainingText = remainingText.replace(/\bseason\b/gu, " ");
  }
  return { events, years, remainingText: remainingText.replace(/\s+/g, " ").trim() };
}

/** Call only with a confirmed tournament ref label, never the video title. */
export function videoTournamentLabelMatches(label: string, events: Set<string>, years: Set<string> = new Set()): boolean {
  if (!events.size) return true;
  const normalized = normalize(label);
  return VIDEO_TOURNAMENT_ALIASES.some(entry => events.has(entry.id) && entry.aliases.some(alias => {
    const match = normalized.match(new RegExp(`^(?:${aliasPattern(alias)})(?:\\s*(?:season\\s*)?(20\\d{2})(?:年度|年)?(?:\\s*season)?)?$`, "u"));
    return Boolean(match && (!years.size || (match[1] && years.has(match[1]))));
  }));
}

// Compatibility exports retained from the inherited search-UX candidate.
export const VIDEO_EVENT_ALIASES: Record<string, string[]> = Object.fromEntries(
  VIDEO_TOURNAMENT_ALIASES.map(entry => [entry.id, [...entry.aliases]]),
);
export function matchesVideoEventLabel(label: string, id: string): boolean {
  return videoTournamentLabelMatches(label, new Set([id]));
}
export function extractVideoEvents(input: string): { events: Set<string>; remaining: string } {
  const result = extractVideoTournamentIntent(input);
  // Preserve year terms for callers of the earlier extractor.
  return { events: result.events, remaining: [result.remainingText, ...result.years].filter(Boolean).join(" ") };
}
