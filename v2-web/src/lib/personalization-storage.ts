/** Client-only, per-owner browser preferences. Legacy unscoped keys are never read. */
export type PersonalOwner = "guest" | `uid:${string}`;
export type PersonalDataKind = "favorite_characters" | "character_status" | "rank_history" | "diagnosis_history" | "diagnosis_draft" | "diagnosis_save_request";
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,79}$/;

export function personalOwnerFromAuth(userId: string | null | undefined, error: { name?: string } | null): PersonalOwner | null {
  if (error && error.name !== "AuthSessionMissingError") return null;
  if (!userId) return "guest";
  if (!UUID_RE.test(userId)) return null;
  return `uid:${userId.toLowerCase()}`;
}

export function personalStorageKey(owner: PersonalOwner | null, kind: PersonalDataKind): string | null {
  if (owner === "guest") return `sf6dna_v3_guest_${kind}`;
  const id = owner?.startsWith("uid:") ? owner.slice(4) : null;
  return id && UUID_RE.test(id) ? `sf6dna_v3_user_${id.toLowerCase()}_${kind}` : null;
}

function getLocal(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

function readJson<T>(owner: PersonalOwner | null, kind: PersonalDataKind, fallback: T): T {
  const key = personalStorageKey(owner, kind);
  const storage = getLocal();
  if (!key || !storage) return fallback;
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function writeJson(owner: PersonalOwner | null, kind: PersonalDataKind, value: unknown): boolean {
  const key = personalStorageKey(owner, kind);
  const storage = getLocal();
  if (!key || !storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

/** A failed or unrecognized read must never become an empty successful write. */
function readForMutation(owner: PersonalOwner | null, kind: PersonalDataKind): { value: unknown } | null {
  if (kind === "diagnosis_history" || kind === "diagnosis_draft" || kind === "diagnosis_save_request") return null;
  const key = personalStorageKey(owner, kind);
  if (!key) return null;
  const storage = getLocal();
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { value: kind === "character_status" ? {} : [] };
    const value: unknown = JSON.parse(raw);
    if (kind === "favorite_characters") {
      return Array.isArray(value) && value.every(item => typeof item === "string" && SLUG_RE.test(item)) ? { value } : null;
    }
    if (kind === "rank_history") return Array.isArray(value) && value.every(isRankRecord) ? { value } : null;
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return Object.entries(value).every(([slug, status]) => SLUG_RE.test(slug) &&
      (status === "main" || status === "sub" || status === "learning")) ? { value } : null;
  } catch { return null; }
}

export function getFavoriteCharacterSlugs(owner: PersonalOwner | null): string[] {
  const value = readJson<unknown>(owner, "favorite_characters", []);
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && SLUG_RE.test(item)))] : [];
}

export function setFavoriteCharacter(owner: PersonalOwner | null, slug: string, enabled: boolean): boolean {
  if (!SLUG_RE.test(slug)) return false;
  const existing = readForMutation(owner, "favorite_characters");
  if (!existing) return false;
  const current = new Set(existing.value as string[]);
  if (enabled) current.add(slug);
  else current.delete(slug);
  return writeJson(owner, "favorite_characters", [...current]);
}

export function getCharacterStatuses(owner: PersonalOwner | null): Record<string, CharacterUseStatus> {
  const value = readJson<unknown>(owner, "character_status", {});
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, CharacterUseStatus> = {};
  for (const [slug, status] of Object.entries(value)) {
    if (SLUG_RE.test(slug) && (status === "main" || status === "sub" || status === "learning")) result[slug] = status;
  }
  return result;
}

export function setCharacterStatus(owner: PersonalOwner | null, slug: string, status: CharacterUseStatus | null): boolean {
  if (!SLUG_RE.test(slug) || (status !== null && status !== "main" && status !== "sub" && status !== "learning")) return false;
  const existing = readForMutation(owner, "character_status");
  if (!existing) return false;
  const current = existing.value as Record<string, CharacterUseStatus>;
  if (status) current[slug] = status;
  else delete current[slug];
  return writeJson(owner, "character_status", current);
}

function isRankRecord(value: unknown): value is RankRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<RankRecord>;
  return typeof r.id === "string" && r.id.length > 0 && typeof r.date === "string" && r.date.length > 0 &&
    typeof r.characterSlug === "string" && SLUG_RE.test(r.characterSlug) &&
    typeof r.characterName === "string" && (r.metric === "MR" || r.metric === "LP") &&
    typeof r.value === "number" && Number.isFinite(r.value) && r.value >= 0 &&
    typeof r.note === "string" && typeof r.createdAt === "string";
}

export function getRankHistory(owner: PersonalOwner | null): RankRecord[] {
  const raw = readJson<unknown>(owner, "rank_history", []);
  return Array.isArray(raw) ? raw.filter(isRankRecord).sort((a,b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)) : [];
}

export function saveRankRecord(owner: PersonalOwner | null, record: RankRecord): boolean {
  if (!isRankRecord(record)) return false;
  const existing = readForMutation(owner, "rank_history");
  if (!existing) return false;
  return writeJson(owner, "rank_history", [...existing.value as RankRecord[], record]);
}

export function deleteRankRecord(owner: PersonalOwner | null, id: string): boolean {
  if (typeof id !== "string" || !id) return false;
  const existing = readForMutation(owner, "rank_history");
  if (!existing) return false;
  return writeJson(owner, "rank_history", (existing.value as RankRecord[]).filter(record => record.id !== id));
}
