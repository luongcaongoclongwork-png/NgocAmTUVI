import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
