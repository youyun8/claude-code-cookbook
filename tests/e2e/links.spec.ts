import { expect, test } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

/**
 * Crawls the exported HTML rather than the running app, so it catches a
 * dangling link on any page whether or not a test happens to visit it.
 */
async function htmlFiles(dir: string, acc: string[] = []): Promise<string[]> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

test('no internal link points at a page that was not exported', async () => {
  const outDir = join(process.cwd(), 'out');
  const files = await htmlFiles(outDir);
  expect(files.length).toBeGreaterThan(20);

  const exported = new Set(
    files.map((file) => {
      const rel = relative(outDir, file).replace(/\\/g, '/');
      if (rel === 'index.html') return '/';
      if (rel === '404.html') return '/404';
      return `/${rel.replace(/index\.html$/, '')}`;
    }),
  );

  const broken: string[] = [];

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const page = relative(outDir, file);
    for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
      const href = match[1];
      if (href === undefined) continue;
      // Static assets are emitted outside the page tree.
      if (href.startsWith('/_next/') || /\.[a-z0-9]{2,5}$/i.test(href)) continue;
      const normalised = href.endsWith('/') ? href : `${href}/`;
      if (!exported.has(normalised) && !exported.has(href)) {
        broken.push(`${page} → ${href}`);
      }
    }
  }

  expect(broken).toEqual([]);
});

test('every exported page has a unique title and a description', async () => {
  const outDir = join(process.cwd(), 'out');
  const files = await htmlFiles(outDir);
  const titles = new Map<string, string>();
  const missingDescription: string[] = [];

  for (const file of files) {
    const page = relative(outDir, file).replace(/\\/g, '/');
    // The static export emits the not-found page twice, at 404.html and
    // 404/index.html. It is one page, so only check it once.
    if (page === '404/index.html') continue;

    const html = await readFile(file, 'utf8');
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
    expect(title, `${page} has no title`).toBeTruthy();

    if (title) {
      const seenAt = titles.get(title);
      expect(seenAt, `duplicate title "${title}" in ${page} and ${seenAt}`).toBeUndefined();
      titles.set(title, page);
    }

    if (!/<meta name="description"/.test(html)) missingDescription.push(page);
  }

  expect(missingDescription).toEqual([]);
});

test('every external link opens safely', async () => {
  const outDir = join(process.cwd(), 'out');
  const files = await htmlFiles(outDir);
  const unsafe: string[] = [];

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)) {
      const tag = match[0];
      if (!tag.includes('rel="noopener noreferrer"') || !tag.includes('target="_blank"')) {
        unsafe.push(`${relative(outDir, file)}: ${tag.slice(0, 120)}`);
      }
    }
  }

  expect(unsafe).toEqual([]);
});
