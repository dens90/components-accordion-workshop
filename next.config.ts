import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',

  images: {
    minimumCacheTTL: 60,
    unoptimized: true,
  },
};

export default nextConfig;
