// Search only for explicit topics in the user's question. A character name alone
// is not evidence for a training recommendation.
const TOPICS: Array<{ name: string; forms: string[] }> = [
  { name: "対空", forms: ["対空", "ジャンプ", "飛び"] },
  { name: "ドライブインパクト", forms: ["ドライブインパクト", "インパクト返し", "DI"] },
  { name: "画面端", forms: ["画面端"] },
  { name: "飛び道具", forms: ["飛び道具", "弾"] },
  { name: "接近", forms: ["接近", "近づく", "近づけ"] },
  { name: "敗因", forms: ["敗因", "負け", "反省", "課題"] },
];

function containsTerm(text: string, term: string): boolean {
  if (term.toLowerCase() === "di") return /(?:^|[^a-z])di(?:$|[^a-z])/i.test(text);
  return text.includes(term);
}

export function planCoachSearch(raw: string) {
  const normalized = raw.normalize("NFKC").toLowerCase().replace(/[、。！？?!,.:;()（）「」]/g, " ").replace(/\s+/g, " ").trim();
  const topics = TOPICS.filter((topic) => topic.forms.some((form) =>
    containsTerm(normalized, form.toLowerCase()) && !(form === "飛び" && normalized.includes("飛び道具")),
  ));
  // Aliases are emitted only when the corresponding wording is present in the
  // question. They are lookup terms, not gameplay claims.
  const terms = [...new Set(topics.flatMap((topic) => topic.forms.filter((form) => {
    const lower = form.toLowerCase();
    return containsTerm(normalized, lower) || (topic.name === "ドライブインパクト" && lower === "ドライブインパクト" && containsTerm(normalized, "di")) || (topic.name === "飛び道具" && lower === "飛び道具" && containsTerm(normalized, "弾"));
  })))];
  return { normalized, topics: topics.map((topic) => topic.name), terms: terms.length ? terms : [normalized] };
}

export function isTopicResultMatch(title: string, subtitle: string | null, term: string): boolean {
  // RPC substring matching treats "DI" inside Edition or player names as a hit.
  return term.toLowerCase() !== "di" || containsTerm(`${title} ${subtitle ?? ""}`.toLowerCase(), "di");
}
