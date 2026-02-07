import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../../', // Important for monorepo!
  webpack: (config) => {
    // pdfjs-dist optional node dependency — not available in browser
    config.resolve.alias.canvas = false;
    // pdfjs-dist/build/pdf.mjs embeds its own webpack runtime (__webpack_require__)
    // which conflicts with Next.js webpack — use the minified build instead
    config.resolve.alias['pdfjs-dist$'] = 'pdfjs-dist/build/pdf.min.mjs';
    return config;
  },
};

export default nextConfig;
