const PILOT_CHARACTER_SLUGS = new Set([
  "ryu",
  "jp",
  "zangief",
  "chun-li",
  "dhalsim",
  "kimberly",
  "luke",
  "jamie",
  "guile",
  "juri",
  "ken",
  "blanka",
  "e-honda",
  "dee-jay",
  "manon",
  "marisa",
  "lily",
  "cammy",
  "rashid",
  "aki",
  "ed",
  "akuma",
  "m-bison",
  "terry",
  "mai",
  "elena",
  "sagat",
  "c-viper",
  "alex",
  "ingrid",
  "yasmine",
]);

/**
 * Exposes the approved staged rollout on ordinary
 * URLs in RC Preview only.
 * Production keeps its current release boundary until device re-QA is approved.
 */
export function isCharacterDetailV2Route(slug: string) {
  return process.env.VERCEL_ENV === "preview" && PILOT_CHARACTER_SLUGS.has(slug);
}
