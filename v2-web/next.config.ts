import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Baseline security headers (release prerequisite). CSP is intentionally not set here:
  // it needs a separate audit of inline scripts. HSTS omits includeSubDomains until the production domain is confirmed.
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
      ],
    }];
  },
  // Let proxy reject malformed percent encoding before Next normalizes route params.
  // Keep Next's trailing-slash handling unchanged.
  skipProxyUrlNormalize: true,
  outputFileTracingIncludes: {
    "/api/illustration-pilot/*": ["./src/data/illustration-pilot/*.webp"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/palzsoftware/SF6DNA/**",
      },
    ],
  },
};

export default nextConfig;
