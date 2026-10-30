export const VIDEO_SEARCH_KINDS = ["all", "guide", "beginner", "counter", "quick", "match", "combo"] as const;
export type VideoSearchKind = typeof VIDEO_SEARCH_KINDS[number];
export const VIDEO_SEARCH_LABELS: Record<VideoSearchKind, string> = {
  all: "すべて", beginner: "初心者向け", counter: "キャラ対策", quick: "とりこれ", guide: "解説・攻略", match: "対戦", combo: "コンボ",
};
const terms = {
  ja: { beginner: "初心者", counter: "キャラ対策", quick: "とりこれ", all: "", guide: "解説", match: "対戦動画", combo: "コンボ" },
  en: { beginner: "beginner guide", counter: "matchup guide", quick: "quick guide", all: "", guide: "guide", match: "matches", combo: "combos" },
};
export function videoSearchText(names: readonly string[], kind: VideoSearchKind, language: "ja" | "en") {
  if (!VIDEO_SEARCH_KINDS.includes(kind) || !["ja", "en"].includes(language) || names.length > 5) return null;
  const safe = names.map(name => name.normalize("NFKC").replace(/[^\p{L}\p{N} ._\-]/gu, " ").replace(/\s+/g, " ").trim());
  if (safe.some(name => !name || name.length > 60)) return null;
  const text = [language === "ja" ? "スト6" : "Street Fighter 6", ...safe, terms[language][kind]].filter(Boolean).join(" ");
  return text.length <= 100 ? text : null;
}
export function youtubeSearchHref(names: readonly string[], kind: VideoSearchKind, language: "ja" | "en") {
  const text = videoSearchText(names, kind, language);
  return text ? `https://www.youtube.com/results?${new URLSearchParams({ search_query: text })}` : null;
}
