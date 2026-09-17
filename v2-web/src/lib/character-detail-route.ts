const PILOT_CHARACTER_SLUGS = new Set(["ryu", "jp"]);

/**
 * Exposes the Ryu / JP shared template on ordinary URLs in RC Preview only.
 * Production keeps its current release boundary until device re-QA is approved.
 */
export function isCharacterDetailV2Route(slug: string) {
  return process.env.VERCEL_ENV === "preview" && PILOT_CHARACTER_SLUGS.has(slug);
}
