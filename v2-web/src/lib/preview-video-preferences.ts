import type { OwnedVideoPreferenceRead, OwnedVideoPreferenceWrite, VideoPreferenceKind } from "@/lib/owned-video-preferences";

/** Preview-only browser storage; never uses signed-in or guest production keys. */
export const PREVIEW_VIDEO_PREFERENCE_CHANGED = "sf6dna:ryu-preview-video-preferences:v1";
export const previewVideoPreferenceKey = (kind: VideoPreferenceKind) => `sf6dna_ryu_preview_${kind}_videos_v1`;
const VIDEO_ID = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}
function readSet(store: Storage, kind: VideoPreferenceKind): Set<string> | null {
  let raw: string | null;
  try { raw = store.getItem(previewVideoPreferenceKey(kind)); } catch { return null; }
  if (raw === null) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(item => typeof item === "string" && VIDEO_ID.test(item))
      ? new Set<string>(parsed) : null;
  } catch { return null; }
}
export function readPreviewVideoPreferences(): OwnedVideoPreferenceRead {
  const store = storage();
  if (!store) return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  const favorites = readSet(store, "favorite");
  const watched = readSet(store, "watched");
  if (!favorites || !watched) return { ok: false, reason: "INVALID_DATA" };
  return { ok: true, favorites, watched };
}
export function togglePreviewVideoPreference(kind: VideoPreferenceKind, videoId: string): OwnedVideoPreferenceWrite {
  if (!VIDEO_ID.test(videoId)) return { ok: false, reason: "INVALID_VIDEO_ID" };
  const existing = readPreviewVideoPreferences();
  if (!existing.ok) return existing;
  const values = new Set(kind === "favorite" ? existing.favorites : existing.watched);
  if (values.has(videoId)) values.delete(videoId); else values.add(videoId);
  const store = storage();
  if (!store) return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  try { store.setItem(previewVideoPreferenceKey(kind), JSON.stringify([...values])); }
  catch { return { ok: false, reason: "WRITE_FAILED" }; }
  try { window.dispatchEvent(new Event(PREVIEW_VIDEO_PREFERENCE_CHANGED)); }
  catch { /* refresh() on caller still updates this view */ }
  return { ok: true, selected: values.has(videoId) };
}
