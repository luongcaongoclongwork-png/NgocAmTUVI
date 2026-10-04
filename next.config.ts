import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (about half the weight of WebP at the same look, checked at 100% on H01, H02, H09); WebP for older browsers
    formats: ["image/avif", "image/webp"],
    // 75 is the default for every image; the full-screen opening paintings use 85 so their brushwork is not smeared
    qualities: [75, 85],
  },
  experimental: {
    serverActions: {
      // Default is 1MB and applies to the raw multipart body — the admin
      // panel's cover-photo upload (up to 15MB source, see
      // src/lib/uploads.ts) would silently fail without this.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
