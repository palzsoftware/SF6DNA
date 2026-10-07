import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
