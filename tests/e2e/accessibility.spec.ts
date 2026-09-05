import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/learn/', name: 'learn hub' },
  { path: '/learn/permissions-sandboxing-security/', name: 'a lesson with labs' },
  { path: '/clinic/', name: 'prompt clinic' },
  { path: '/recipes/', name: 'recipe library' },
  { path: '/recipes/upgrade-dependency-safely/', name: 'a recipe' },
  { path: '/safety/', name: 'safety lab' },
  { path: '/reference/', name: 'reference' },
  { path: '/reference/glossary/', name: 'glossary' },
  { path: '/progress/', name: 'progress dashboard' },
];

for (const entry of PAGES) {
  test(`${entry.name} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(entry.path);
    // Labs are lazy-loaded; give them a beat to mount before scanning.
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
}

test('interactive labs stay accessible after interaction', async ({ page }) => {
  await page.goto('/learn/explore-plan-implement-verify/');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Reveal the defects/ }).click();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test('the search dialog is accessible when open', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Search/ }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('hook');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test('the page is keyboard navigable from the skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('core content is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/learn/project-instructions-claude-md/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Project instructions with CLAUDE.md',
  );
  await expect(
    page.getByText('is markdown you write to give Claude persistent instructions'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review checklist' })).toBeVisible();

  await context.close();
});
