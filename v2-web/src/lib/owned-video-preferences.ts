import type { PersonalOwner } from "@/lib/personalization-storage";

export type VideoPreferenceKind = "favorite" | "watched";
export type VideoOwnerScope = { owner: PersonalOwner; version: number; isCurrent: () => boolean };
export const VIDEO_PREFERENCE_CHANGED = "sf6dna:video-preferences-changed:v3";
type Failure = { ok: false; reason: "OWNER_NOT_READY" | "STORAGE_UNAVAILABLE" | "INVALID_DATA" | "INVALID_VIDEO_ID" | "WRITE_FAILED" };
export type OwnedVideoPreferenceRead = Failure | { ok: true; favorites: Set<string>; watched: Set<string> };
export type OwnedVideoPreferenceWrite = Failure | { ok: true; selected: boolean };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VIDEO_ID = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;

/** Video-only key space; do not widen the shared PersonalDataKind union. */
export function ownedVideoPreferenceKey(owner: PersonalOwner | null, kind: VideoPreferenceKind): string | null {
  if (kind !== "favorite" && kind !== "watched") return null;
  const suffix = kind === "favorite" ? "favorite_videos" : "watched_videos";
  if (owner === "guest") return `sf6dna_v3_guest_${suffix}`;
  const id = typeof owner === "string" && owner.startsWith("uid:") ? owner.slice(4) : null;
  return id && UUID.test(id) ? `sf6dna_v3_user_${id.toLowerCase()}_${suffix}` : null;
}

export function videoOwnerScopeIsCurrent(scope: VideoOwnerScope | null): scope is VideoOwnerScope {
  if (!scope || !ownedVideoPreferenceKey(scope.owner, "favorite") || !Number.isSafeInteger(scope.version) || scope.version < 0) return false;
  try { return scope.isCurrent() === true; } catch { return false; }
}

function local(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

function readSet(storage: Storage, key: string): { ok: true; values: Set<string> } | Failure {
  let raw: string | null;
  try { raw = storage.getItem(key); }
  catch { return { ok: false, reason: "STORAGE_UNAVAILABLE" }; }
  if (raw === null) return { ok: true, values: new Set() };
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every(item => typeof item === "string" && VIDEO_ID.test(item))) {
      return { ok: false, reason: "INVALID_DATA" };
    }
    return { ok: true, values: new Set(value) };
  } catch { return { ok: false, reason: "INVALID_DATA" }; }
}

/** Legacy unscoped keys are neither read nor migrated nor deleted. */
export function readOwnedVideoPreferences(scope: VideoOwnerScope | null): OwnedVideoPreferenceRead {
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  const storage = local();
  if (!storage) return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  const favorites = readSet(storage, ownedVideoPreferenceKey(scope.owner, "favorite")!);
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  if (!favorites.ok) return favorites;
  const watched = readSet(storage, ownedVideoPreferenceKey(scope.owner, "watched")!);
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  if (!watched.ok) return watched;
  return { ok: true, favorites: favorites.values, watched: watched.values };
}

export function toggleOwnedVideoPreference(scope: VideoOwnerScope | null, kind: VideoPreferenceKind, videoId: string): OwnedVideoPreferenceWrite {
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  if (typeof videoId !== "string" || !VIDEO_ID.test(videoId) || (kind !== "favorite" && kind !== "watched")) return { ok: false, reason: "INVALID_VIDEO_ID" };
  const current = readOwnedVideoPreferences(scope);
  if (!current.ok) return current;
  const values = new Set(kind === "favorite" ? current.favorites : current.watched);
  if (values.has(videoId)) values.delete(videoId); else values.add(videoId);
  const encoded = JSON.stringify([...values]);
  const storage = local();
  if (!storage) return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  try { storage.setItem(ownedVideoPreferenceKey(scope.owner, kind)!, encoded); }
  catch { return { ok: false, reason: "WRITE_FAILED" }; }
  // A stale response must never repaint the next Owner's UI.
  if (!videoOwnerScopeIsCurrent(scope)) return { ok: false, reason: "OWNER_NOT_READY" };
  try { window.dispatchEvent(new Event(VIDEO_PREFERENCE_CHANGED)); } catch { /* The caller also refreshes its own state. */ }
  return { ok: true, selected: values.has(videoId) };
}
