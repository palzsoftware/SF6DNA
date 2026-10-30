/** Per-owner browser-only Daily15 history. Never accesses the v2 shared key. */
import type { PersonalOwner } from "@/lib/personalization-storage";
import { PRACTICE_LIMIT, validSession, type PracticeSession } from "@/lib/daily-practice";

const MAX_STORAGE_CHARS = 1_500_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

type StoragePort = Pick<Storage, "getItem" | "setItem">;
export type OwnedPracticeHistory = { sessions: PracticeSession[]; unavailable: boolean; invalid: boolean };
const empty = (unavailable = false, invalid = false): OwnedPracticeHistory => ({ sessions: [], unavailable, invalid });

export function ownerPracticeStorageKey(owner: PersonalOwner | null): string | null {
  if (owner === "guest") return "sf6dna_v3_guest_daily15_v1";
  const uuid = owner?.startsWith("uid:") ? owner.slice(4).toLowerCase() : null;
  return uuid && UUID_RE.test(uuid) ? `sf6dna_v3_user_${uuid}_daily15_v1` : null;
}

/** Auth unknown/error is *not* guest. It fails closed and does not touch storage. */
export function readOwnedPractice(owner: PersonalOwner | null, storage?: StoragePort): OwnedPracticeHistory {
  const key = ownerPracticeStorageKey(owner);
  if (!key) return empty(true);
  try {
    const port = storage ?? window.localStorage;
    const raw = port.getItem(key);
    if (raw === null) return empty();
    if (raw.length > MAX_STORAGE_CHARS) return empty(false, true);
    const data: unknown = JSON.parse(raw);
    if (!record(data) || data.version !== 1 || !Array.isArray(data.sessions)) return empty(false, true);
    const seen = new Set<string>();
    const sessions = data.sessions.filter(validSession)
      .sort((a: PracticeSession, b: PracticeSession) => b.updatedAt.localeCompare(a.updatedAt))
      .filter((session: PracticeSession) => {
        if (seen.has(session.id)) return false;
        seen.add(session.id);
        return true;
      }).slice(0, PRACTICE_LIMIT);
    return { sessions, unavailable: false, invalid: sessions.length !== data.sessions.length };
  } catch (error) {
    return error instanceof SyntaxError ? empty(false, true) : empty(true);
  }
}

/** Writes only the current validated owner's key; never migrates/deletes old shared records. */
export function saveOwnedPractice(owner: PersonalOwner | null, session: PracticeSession, storage?: StoragePort): boolean {
  const key = ownerPracticeStorageKey(owner);
  if (!key || !validSession(session)) return false;
  try {
    const port = storage ?? window.localStorage;
    const existing = readOwnedPractice(owner, port);
    // Unknown format, corrupt data and storage exceptions must not be overwritten.
    if (existing.invalid || existing.unavailable) return false;
    const sessions = [session, ...existing.sessions.filter(item => item.id !== session.id)]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, PRACTICE_LIMIT);
    while (JSON.stringify({ version: 1, sessions }).length > MAX_STORAGE_CHARS && sessions.length > 1) sessions.pop();
    const payload = JSON.stringify({ version: 1, sessions });
    if (payload.length > MAX_STORAGE_CHARS) return false;
    port.setItem(key, payload);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("sf6dna-practice-change"));
    return true;
  } catch { return false; }
}
