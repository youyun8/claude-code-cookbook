import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/learn/',
  '/learn/context-and-session-management/',
  '/learn/skills-hooks-mcp-plugins/',
  '/clinic/',
  '/recipes/',
  '/recipes/run-non-interactive-ci-task/',
  '/safety/',
  '/reference/',
  '/reference/permissions-and-sandboxing/',
  '/reference/glossary/',
  '/progress/',
];

const VIEWPORTS = [
  { name: 'mobile 360', width: 360, height: 740 },
  { name: 'tablet 768', width: 768, height: 1024 },
  { name: 'desktop 1440', width: 1440, height: 900 },
];

for (const viewport of VIEWPORTS) {
  test(`no horizontal page scroll at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const overflowing: string[] = [];

    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      // A pixel of tolerance for sub-pixel layout rounding.
      if (scrollWidth > viewport.width + 1) {
        overflowing.push(`${path} (${scrollWidth}px in a ${viewport.width}px viewport)`);
      }
    }

    expect(overflowing).toEqual([]);
  });
}

test('long code blocks scroll inside their own container, not the page', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/reference/permissions-and-sandboxing/');
  await page.waitForLoadState('networkidle');

  const pageScroll = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageScroll).toBeLessThanOrEqual(361);

  // At least one code container is itself horizontally scrollable.
  const hasScrollableCode = await page.evaluate(() =>
    [...document.querySelectorAll('figure div, pre')].some(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  );
  expect(hasScrollableCode).toBe(true);
});

test('the course drawer works on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/learn/mental-model-and-setup/');

  await page.getByRole('button', { name: 'Open course navigation' }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer.getByRole('link', { name: /Permissions, sandboxing/ })).toBeVisible();

  await drawer.getByRole('link', { name: /Permissions, sandboxing/ }).click();
  await expect(page).toHaveURL(/permissions-sandboxing-security/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('reduced motion is respected', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');

  const duration = await page.evaluate(() => {
    const element = document.querySelector('[role="progressbar"] > div');
    return element ? getComputedStyle(element).transitionDuration : '0s';
  });
  expect(['0s', '0.00001s']).toContain(duration);

  await context.close();
});
