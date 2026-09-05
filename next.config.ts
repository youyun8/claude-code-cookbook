import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static output: every page is prerendered to HTML, so the core
  // educational content reads correctly with JavaScript disabled.
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Separate language root layouts need one global static 404 document.
  experimental: { globalNotFound: true },
};

export default nextConfig;
