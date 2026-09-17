export const VIDEO_FAVORITES_KEY = "sf6dna:favorite-videos:v1";
export const VIDEO_WATCHED_KEY = "sf6dna:watched-videos:v1";

export function readVideoPreference(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

export function toggleVideoPreference(key: string, videoId: string): boolean {
  const values = readVideoPreference(key);
  if (values.has(videoId)) values.delete(videoId);
  else values.add(videoId);
  window.localStorage.setItem(key, JSON.stringify([...values]));
  return values.has(videoId);
}
