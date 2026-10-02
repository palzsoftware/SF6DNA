// Derivative pilot assets remain unavailable outside Vercel Preview.
export const illustrationPilot = {
  jp: { name: "JP", file: "jp.webp" },
  ryu: { name: "リュウ", file: "ryu.webp" },
  luke: { name: "ルーク", file: "luke.webp" },
} as const;
export function getPilotIllustration(slug: string, environment = process.env.VERCEL_ENV) {
  if (environment !== "preview" || !Object.hasOwn(illustrationPilot, slug)) return null;
  const asset = illustrationPilot[slug as keyof typeof illustrationPilot];
  return { ...asset, url: `/api/illustration-pilot/${slug}`, rightsStatus: "UNVERIFIED_FOR_PRODUCTION" as const };
}
