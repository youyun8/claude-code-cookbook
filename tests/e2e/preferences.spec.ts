import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('preferences persist and language switching preserves route and progress', async ({
  page,
}) => {
  await page.goto('/learn/mental-model-and-setup/');
  await page.getByRole('button', { name: 'Mark this lesson complete' }).click();
  await page.getByRole('button', { name: 'Reading preferences' }).click();
  await page.getByLabel('Font size', { exact: true }).selectOption('larger');
  await page.getByLabel('Reading width', { exact: true }).selectOption('compact');
  await page.getByRole('radio', { name: 'Dark', exact: true }).check({ force: true });
  await page.getByLabel('Language', { exact: true }).selectOption('zh-TW');
  await expect(page).toHaveURL('/zh-TW/learn/mental-model-and-setup/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('基本觀念與安裝設定');
  await expect(page.getByRole('button', { name: '已完成', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-font-size', 'larger');
  await expect(page.locator('html')).toHaveAttribute('data-reading-width', 'compact');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '閱讀偏好設定' }).click();
  await expect(page.getByLabel('語言', { exact: true })).toHaveValue('zh-TW');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
  await page.getByLabel('語言', { exact: true }).selectOption('en');
  await expect(page).toHaveURL('/learn/mental-model-and-setup/');
  await expect(page.getByRole('button', { name: 'Completed', exact: true })).toBeVisible();
});

test('Chinese search navigates to Chinese content', async ({ page }) => {
  await page.goto('/zh-TW/');
  await page.getByRole('button', { name: /搜尋/ }).click();
  await page.getByRole('searchbox').fill('權限');
  const first = page.getByRole('dialog').getByRole('link').first();
  await expect(first).toHaveAttribute('href', /^\/zh-TW\//);
  await first.click();
  await expect(page).toHaveURL(/\/zh-TW\//);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
});

test('Chinese reading works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/zh-TW/learn/permissions-sandboxing-security/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.getByRole('heading', { name: '權限、沙箱與安全', exact: true })).toBeVisible();
  await expect(page.getByText('分清楚不同層的控制', { exact: true }).first()).toBeVisible();
  await context.close();
});

test('saved Chinese preference restores on the home page', async ({ page }) => {
  await page.goto('/zh-TW/');
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('claude-code-cookbook:progress:v1') ?? '{}').language,
      ),
    )
    .toBe('zh-TW');
  await page.goto('/');
  await expect(page).toHaveURL('/zh-TW/');
});

test('mobile preferences and largest font do not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/zh-TW/recipes/');
  await page.getByRole('button', { name: '閱讀偏好設定' }).click();
  await page.getByLabel('字體大小', { exact: true }).selectOption('larger');
  await page.getByLabel('閱讀寬度', { exact: true }).selectOption('wide');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '完成', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('preferences remain usable when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Reading preferences' }).click();
  await page.getByLabel('Font size', { exact: true }).selectOption('large');
  await expect(page.locator('html')).toHaveAttribute('data-font-size', 'large');
  await page.getByLabel('Language', { exact: true }).selectOption('zh-TW');
  await expect(page).toHaveURL('/zh-TW/');
});
