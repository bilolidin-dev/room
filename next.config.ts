import type { NextConfig } from "next";

/**
 * Static export: the whole presentation is a set of static files that can be
 * hosted anywhere (Vercel, Netlify, any CDN). Images are pre-optimized by
 * `npm run images`, so Next's runtime image optimizer is not needed.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
