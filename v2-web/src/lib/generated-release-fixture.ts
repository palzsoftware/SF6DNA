import type { DevicePreviewBundle } from "@/lib/device-preview";

/** Server-only dynamic import: the draft snapshot is never a public DB fallback. */
export async function getGeneratedReleaseFixture(characterId: string, slug: string): Promise<DevicePreviewBundle | null> {
  if (process.env.VERCEL_ENV !== "preview" || slug === "jp" || slug === "ryu" || slug === "alex" || slug === "yasmine") return null;
  const { default: snapshot } = await import("@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
  const entry = snapshot.characters[slug as keyof typeof snapshot.characters];
  if (!entry || entry.characterId !== characterId) return null;
  return { guideSections: [], moves: entry.moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
}
