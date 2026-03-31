import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/components-accordion-workshop', // Aggiungi questo
  assetPrefix: '/components-accordion-workshop', // E questo
  images: {
    minimumCacheTTL: 60,
    unoptimized: true,
  },
};

export default nextConfig;
