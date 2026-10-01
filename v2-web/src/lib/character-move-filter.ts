export type SearchableMove = { name: string; commands: string[] };

function normalized(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, " ").trim();
}

export function matchesMoveSearch(move: SearchableMove, query: string) {
  const terms = normalized(query).split(" ").filter(Boolean);
  const fields = [move.name, ...move.commands].map(normalized);
  return terms.every(term => fields.some(field => field.includes(term)));
}
