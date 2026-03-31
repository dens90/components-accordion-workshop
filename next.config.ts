import type { NextConfig } from "next";

// Controlliamo se siamo in produzione
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProd ? '/components-accordion-workshop' : '',
  assetPrefix: isProd ? '/components-accordion-workshop/' : '',  images: {
    minimumCacheTTL: 60,
    unoptimized: true,
  },
};

export default nextConfig;
