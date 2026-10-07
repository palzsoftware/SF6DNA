export type MoveSchemeFilter = "all" | "classic" | "modern";
export type SearchableMove = { name: string; commands: string[]; schemes?: string[] };

function normalized(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, " ").trim();
}

export function matchesMoveSearch(move: SearchableMove, query: string) {
  const terms = normalized(query).split(" ").filter(Boolean);
  const fields = [move.name, ...move.commands].map(normalized);
  return terms.every(term => fields.some(field => field.includes(term)));
}

export function matchesMoveScheme(move: SearchableMove, scheme: MoveSchemeFilter) {
  if (scheme === "all") return true;
  const explicitSchemes = (move.schemes ?? []).map(value => value.trim().toLocaleLowerCase("ja-JP").replaceAll("-", "_"));
  if (!explicitSchemes.length) return true;
  const narrowing = new Set(["classic", "modern", "modern_simple", "modern_manual", "modern_assist"]);
  if (explicitSchemes.some(value => !narrowing.has(value))) return true;
  const hasClassic = explicitSchemes.some(value => value === "classic");
  const hasModern = explicitSchemes.some(value => value === "modern" || value === "modern_simple" || value === "modern_manual" || value === "modern_assist");
  // Unknown/common/shared labels must not disappear from either filter. Only explicit Classic/Modern evidence narrows visibility.
  if (!hasClassic && !hasModern) return true;
  return scheme === "modern" ? hasModern : hasClassic;
}
