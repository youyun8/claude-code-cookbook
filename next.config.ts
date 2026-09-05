import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static output: every page is prerendered to HTML, so the core
  // educational content reads correctly with JavaScript disabled.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
