import type { Metadata } from "next";

// Preserve the existing root description when a page only supplies its title.
const inheritedDescription = "Street Fighter 6の診断・キャラクター情報・プレイヤー・動画を整理して確認できるSF6上達支援サイト。";

/** Canonicals require the existing explicit production origin; never use a Preview host. */
export function publicPageMetadata(path: string, metadata: Metadata, published = true): Metadata {
  if (!published) return { ...metadata, robots: { index: false, follow: false } };
  let canonical: string | undefined;
  if (process.env.VERCEL_ENV === "production" && path.startsWith("/") && !path.startsWith("//") && !/[?#]/.test(path)) {
    try {
      const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");
      if (origin.protocol === "https:" && !origin.username && !origin.password && origin.pathname === "/" && !origin.search && !origin.hash) {
        canonical = new URL(path, origin).href;
      }
    } catch { /* Missing/invalid origin needs configuration review, not a guessed URL. */ }
  }
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  const description = typeof metadata.description === "string" ? metadata.description : inheritedDescription;
  return {
    ...metadata,
    ...(canonical ? { alternates: { ...metadata.alternates, canonical } } : {}),
    ...(title ? {
      openGraph: { type: "website", siteName: "SF6DNA", ...metadata.openGraph, title, ...(description ? { description } : {}) },
      twitter: { card: "summary_large_image", ...metadata.twitter, title, ...(description ? { description } : {}) },
    } : {}),
  };
}
