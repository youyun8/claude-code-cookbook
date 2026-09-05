/** Site-level constants used for metadata, canonical URLs and the sitemap. */
export const SITE = {
  name: 'Claude Code Academy',
  tagline: 'From first prompt to reliable engineering workflow.',
  description:
    'An interactive course that teaches developers to use Claude Code correctly, safely, and efficiently — prompting, context, permissions, verification, and automation.',
  /** Override at build time with NEXT_PUBLIC_SITE_URL when deploying. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claude-code-academy.example',
} as const;
