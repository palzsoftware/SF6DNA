import { personalStorageKey, type PersonalOwner } from "./personalization-storage";

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

export type DiagnosisHistoryRecord = {
  id: string;
  diagnosisSlug: string;
  diagnosisTitle: string;
  diagnosisType: string;
  topResults: Array<{ key: string; label: string; score: number }>;
  completedAt: string;
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

function isDiagnosisHistoryRecord(value: unknown): value is DiagnosisHistoryRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DiagnosisHistoryRecord>;
  return typeof record.id === "string" && record.id.length > 0 &&
    typeof record.diagnosisSlug === "string" && record.diagnosisSlug.length > 0 &&
    typeof record.diagnosisTitle === "string" && typeof record.diagnosisType === "string" &&
    typeof record.completedAt === "string" && Array.isArray(record.topResults) &&
    record.topResults.every((item) => item && typeof item.key === "string" &&
      typeof item.label === "string" && typeof item.score === "number" && Number.isFinite(item.score));
}

/** Guest history is available only after auth explicitly resolves to Guest. */
function readGuestDiagnosisHistory(owner: PersonalOwner | null): { key: string; records: DiagnosisHistoryRecord[] } | null {
  if (owner !== "guest" || typeof window === "undefined") return null;
  const key = personalStorageKey(owner, "diagnosis_history");
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { key, records: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isDiagnosisHistoryRecord)) return null;
    return { key, records: parsed };
  } catch {
    return null;
  }
}

/** null means Owner/read/storage failure; it must not be rendered as an empty history. */
export function getDiagnosisHistory(owner: PersonalOwner | null): DiagnosisHistoryRecord[] | null {
  const read = readGuestDiagnosisHistory(owner);
  return read ? [...read.records].sort((a, b) => b.completedAt.localeCompare(a.completedAt)) : null;
}

export function saveDiagnosisHistory(owner: PersonalOwner | null, record: DiagnosisHistoryRecord): boolean {
  if (!isDiagnosisHistoryRecord(record)) return false;
  const current = readGuestDiagnosisHistory(owner);
  if (!current) return false;
  try {
    window.localStorage.setItem(current.key, JSON.stringify([record, ...current.records.filter(item => item.id !== record.id)].slice(0, 50)));
    return true;
  } catch {
    return false;
  }
}

export function deleteDiagnosisHistory(owner: PersonalOwner | null, id: string): boolean {
  if (typeof id !== "string" || !id) return false;
  const current = readGuestDiagnosisHistory(owner);
  if (!current) return false;
  try {
    window.localStorage.setItem(current.key, JSON.stringify(current.records.filter((record) => record.id !== id)));
    return true;
  } catch {
    return false;
  }
}
