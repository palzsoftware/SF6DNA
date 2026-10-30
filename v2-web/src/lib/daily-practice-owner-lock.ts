// Derived from the existing isolated Web Locks adapter. All same-key writers must cooperate.
import type { PersonalOwner } from "@/lib/personalization-storage";
import { togglePracticeItem, type PracticeSession } from "@/lib/daily-practice";
import { ownerPracticeStorageKey, readOwnedPractice, saveOwnedPractice } from "@/lib/daily-practice-owner";

export type PracticeWrite = {
  seed: PracticeSession;
  toggles: Array<{ id: string; at: string }>;
};
export type LockResult = {
  ok: boolean;
  reason: "SAVED" | "STALE_OWNER" | "NOT_READY" | "LOCK_UNAVAILABLE" | "LOCK_FAILED" | "STORAGE_REJECTED";
  session?: PracticeSession;
};

export async function savePracticeWithOwnerLock({ owner, isCurrent, write }: {
  owner: PersonalOwner;
  isCurrent: () => boolean;
  write: PracticeWrite;
}): Promise<LockResult> {
  const key = ownerPracticeStorageKey(owner);
  if (!key || !isCurrent()) return { ok: false, reason: "NOT_READY" };
  try {
    const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
    // An unlocked fallback would reintroduce the lost-update path.
    if (!locks || typeof locks.request !== "function") return { ok: false, reason: "LOCK_UNAVAILABLE" };
    return await locks.request(`sf6dna:daily15:${key}`, { mode: "exclusive" }, () => {
      if (!isCurrent() || ownerPracticeStorageKey(owner) !== key) return { ok: false, reason: "STALE_OWNER" };
      const stored = readOwnedPractice(owner);
      if (stored.invalid || stored.unavailable) return { ok: false, reason: "STORAGE_REJECTED" };
      // Re-read and replay inside the lock, including a failed write's pending operations.
      const base = stored.sessions.find(s => s.id === write.seed.id) ?? write.seed;
      const session = write.toggles.reduce((s, change) => togglePracticeItem(s, change.id, change.at), base);
      if (!isCurrent()) return { ok: false, reason: "STALE_OWNER" };
      const saved = saveOwnedPractice(owner, session);
      return { ok: saved, reason: saved ? "SAVED" : "STORAGE_REJECTED", session };
    });
  } catch {
    return { ok: false, reason: "LOCK_FAILED" };
  }
}
