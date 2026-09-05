import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';
import { LESSONS } from '@/data/curriculum';
import { RECIPES } from '@/data/recipes';
import { REFERENCE } from '@/content/reference/entries';
import { CONTENT_LAST_REVIEWED } from '@/data/sources';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewed = new Date(CONTENT_LAST_REVIEWED);

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/learn/', priority: 0.9 },
    { path: '/clinic/', priority: 0.8 },
    { path: '/recipes/', priority: 0.8 },
    { path: '/safety/', priority: 0.7 },
    { path: '/reference/', priority: 0.7 },
    { path: '/reference/glossary/', priority: 0.6 },
    { path: '/progress/', priority: 0.4 },
  ];

  const pages = [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route.path}`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: route.priority,
    })),
    ...LESSONS.map((lesson) => ({
      url: `${SITE.url}/learn/${lesson.slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...RECIPES.map((recipe) => ({
      url: `${SITE.url}/recipes/${recipe.slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...REFERENCE.map((entry) => ({
      url: `${SITE.url}/reference/${entry.slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
  return pages.flatMap((page) => {
    const path = page.url.slice(SITE.url.length);
    const languages = { en: page.url, 'zh-TW': `${SITE.url}/zh-TW${path}` };
    return [
      { ...page, alternates: { languages } },
      { ...page, url: languages['zh-TW'], alternates: { languages } },
    ];
  });
}
