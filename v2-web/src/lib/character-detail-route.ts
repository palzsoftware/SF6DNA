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
 * URLs in RC Preview; Production additionally needs a trusted registry grant.
 * This selects the template only. The resolver independently checks public eligibility.
 */
export function isCharacterDetailV2Route(slug: string, releaseApproved = false) {
  return (process.env.VERCEL_ENV === "preview" || (process.env.VERCEL_ENV === "production" && releaseApproved)) && PILOT_CHARACTER_SLUGS.has(slug);
}
