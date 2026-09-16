// Only add entries after recording permission for this exact URL and use.
const approvedPlayerImages: Readonly<Record<string, string>> = {};

export function approvedPlayerImage(slug: string, candidate: unknown): string | null {
  if (typeof candidate !== "string" || !Object.hasOwn(approvedPlayerImages, slug)) return null;
  return candidate === approvedPlayerImages[slug] ? candidate : null;
}
