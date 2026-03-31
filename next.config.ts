import type { NextConfig } from "next";

/** Allineato a `lib/asset-prefix.ts`: basePath/assetPrefix solo con `NODE_ENV === "production"`. */
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/components-accordion-workshop" : "",
  assetPrefix: isProd ? "/components-accordion-workshop/" : "",
  images: {
    minimumCacheTTL: 60,
    unoptimized: true,
  },
};

export default nextConfig;
