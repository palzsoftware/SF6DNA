export type SearchSuggestionCandidate = {
  label: string;
  value: string;
  type: string;
  aliases: string[];
};

export type SearchSuggestion = SearchSuggestionCandidate & {
  matchedBy: "alias" | "normalized" | "typo";
  score: number;
};

export function normalizeSuggestionText(input: string) {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (character) => String.fromCharCode(character.charCodeAt(0) + 0x60))
    .replace(/[\s・_\-.'’]+/g, "");
}

export function levenshteinDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const upper = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = upper;
    }
  }
  return previous[b.length];
}

function similarity(a: string, b: string) {
  const longest = Math.max(a.length, b.length);
  return longest === 0 ? 1 : 1 - levenshteinDistance(a, b) / longest;
}

export function suggestSearchTerms(rawQuery: string, candidates: SearchSuggestionCandidate[], limit = 3): SearchSuggestion[] {
  const query = rawQuery.trim();
  const normalizedQuery = normalizeSuggestionText(query);
  if (normalizedQuery.length < 2) return [];

  const unique = new Map<string, SearchSuggestion>();
  for (const candidate of candidates) {
    const normalizedValue = normalizeSuggestionText(candidate.value);
    const normalizedLabel = normalizeSuggestionText(candidate.label);
    if (query === candidate.value || normalizedQuery === normalizedValue || normalizedQuery === normalizedLabel) continue;

    const aliases = candidate.aliases.map(normalizeSuggestionText).filter(Boolean);
    let suggestion: SearchSuggestion | null = null;
    if (candidate.aliases.some((alias) => alias.toLowerCase() === query.toLowerCase())) {
      suggestion = { ...candidate, matchedBy: "alias", score: 1 };
    } else if (aliases.includes(normalizedQuery)) {
      suggestion = { ...candidate, matchedBy: "normalized", score: .98 };
    } else if (normalizedQuery.length >= 3) {
      const score = Math.max(similarity(normalizedQuery, normalizedValue), similarity(normalizedQuery, normalizedLabel), ...aliases.map((alias) => similarity(normalizedQuery, alias)));
      const threshold = normalizedQuery.length <= 4 ? .75 : .68;
      if (score >= threshold) suggestion = { ...candidate, matchedBy: "typo", score };
    }
    if (!suggestion) continue;
    const existing = unique.get(candidate.value);
    if (!existing || suggestion.score > existing.score) unique.set(candidate.value, suggestion);
  }
  return [...unique.values()].sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "ja")).slice(0, limit);
}
