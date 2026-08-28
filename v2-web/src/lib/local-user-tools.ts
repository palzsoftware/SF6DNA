export type CharacterUseStatus = "main" | "sub" | "learning";

export type RankRecord = {
  id: string;
  date: string;
  characterSlug: string;
  characterName: string;
  metric: "MR" | "LP";
  value: number;
  note: string;
  createdAt: string;
};

const FAVORITES_KEY = "sf6dna_v2_favorite_characters";
const CHARACTER_STATUS_KEY = "sf6dna_v2_character_status";
const RANK_HISTORY_KEY = "sf6dna_v2_rank_history";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavoriteCharacterSlugs() {
  return readJson<string[]>(FAVORITES_KEY, []).filter((value) => typeof value === "string");
}

export function isFavoriteCharacter(slug: string) {
  return getFavoriteCharacterSlugs().includes(slug);
}

export function setFavoriteCharacter(slug: string, enabled: boolean) {
  const current = new Set(getFavoriteCharacterSlugs());
  if (enabled) current.add(slug);
  else current.delete(slug);
  writeJson(FAVORITES_KEY, [...current]);
}

export function getCharacterStatuses() {
  return readJson<Record<string, CharacterUseStatus>>(CHARACTER_STATUS_KEY, {});
}

export function setCharacterStatus(slug: string, status: CharacterUseStatus | null) {
  const current = getCharacterStatuses();
  if (status) current[slug] = status;
  else delete current[slug];
  writeJson(CHARACTER_STATUS_KEY, current);
}

export function getRankHistory() {
  return readJson<RankRecord[]>(RANK_HISTORY_KEY, [])
    .filter((record) => record && typeof record.id === "string" && Number.isFinite(record.value))
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
}

export function saveRankRecord(record: RankRecord) {
  const current = getRankHistory();
  writeJson(RANK_HISTORY_KEY, [...current, record]);
}

export function deleteRankRecord(id: string) {
  writeJson(RANK_HISTORY_KEY, getRankHistory().filter((record) => record.id !== id));
}
