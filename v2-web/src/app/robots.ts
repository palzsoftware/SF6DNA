import type { MetadataRoute } from "next";

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  return vercelUrl ? `https://${vercelUrl}` : null;
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const isVercelPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");

  if (isVercelPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/auth", "/favorites", "/my-characters", "/rank-tracker", "/diagnosis/history"],
    },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl ?? undefined,
  };
}
