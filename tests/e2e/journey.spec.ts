import { expect, test } from '@playwright/test';

/**
 * The end-to-end happy path from the brief:
 * start the course, finish a lesson, answer a quiz, save progress, reload,
 * and resume where you left off.
 */
test('a learner can start, complete a lesson, and resume after a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('delegate coding work');

  await page.getByRole('link', { name: 'Start the learning path' }).first().click();
  await expect(page).toHaveURL(/\/learn\/mental-model-and-setup\//);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mental model and setup');

  // Answer the knowledge check. The first option of each question is not the
  // correct one, so pick by its known text.
  await page.getByRole('radio', { name: /It executes actions and reads the results/ }).check();
  await page.getByRole('radio', { name: /It makes .*git diff.* a usable review tool/ }).check();
  await page.getByRole('radio', { name: /A read-only exploration whose citations/ }).check();

  const submit = page.getByRole('button', { name: 'Submit answers' });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByText('3 of 3 correct.', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Mark this lesson complete' }).click();
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();

  // Reload: progress must survive.
  await page.reload();
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();

  // The dashboard reflects the same state.
  await page.goto('/progress/');
  await expect(page.getByText('1 of 10 lessons complete').first()).toBeVisible();
  await expect(page.getByText('Knowledge check: 3/3')).toBeVisible();

  // And the home page now offers to resume rather than to start.
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Continue where you left off' }).first(),
  ).toBeVisible();

  // Resuming goes to the next unfinished lesson, not the completed one.
  await page.getByRole('link', { name: 'Continue where you left off' }).first().click();
  await expect(page).toHaveURL(/\/learn\/prompting-for-engineering-work\//);
});

test('progress can be exported and reset', async ({ page }) => {
  await page.goto('/learn/mental-model-and-setup/');
  await page.getByRole('button', { name: 'Mark this lesson complete' }).click();

  await page.goto('/progress/');
  await expect(page.getByText('1 of 10 lessons complete').first()).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('claude-code-cookbook-progress.json');

  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Yes, delete everything' }).click();
  await expect(page.getByText('All progress cleared.')).toBeVisible();
  await expect(page.getByText('0 of 10 lessons complete').first()).toBeVisible();
});

test('a malformed import is rejected without destroying existing progress', async ({ page }) => {
  await page.goto('/learn/mental-model-and-setup/');
  await page.getByRole('button', { name: 'Mark this lesson complete' }).click();

  await page.goto('/progress/');
  await page.getByLabel('Choose a progress JSON file to import').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ this is not valid json'),
  });

  await expect(page.getByText(/could not be read as Claude Code Cookbook progress/)).toBeVisible();
  await expect(page.getByText('1 of 10 lessons complete').first()).toBeVisible();
});

test('theme choice persists across navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reading preferences' }).click();
  await page.getByRole('radio', { name: 'Dark' }).click({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.goto('/recipes/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('search finds content across sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Search/ }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('prompt injection');

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('link').first()).toBeVisible();
  await dialog.getByRole('link').first().click();
  await expect(page).not.toHaveURL('/');
});

test('the prompt clinic scores and improves a weak prompt', async ({ page }) => {
  await page.goto('/clinic/');
  const scorePanel = page.getByRole('region', { name: 'Structure check' });
  await expect(scorePanel.getByText('■ Thin')).toBeVisible();

  await page.getByRole('button', { name: 'Show the first suggestion' }).click();
  await expect(page.getByText('✕ Before')).toBeVisible();
  await expect(page.getByText(/After — fill in the angle brackets/)).toBeVisible();

  // Loading a strong example moves the band without any network call.
  await page.getByRole('button', { name: /Strong — bug/ }).click();
  await expect(scorePanel.getByText('● Strong')).toBeVisible();
});

test('recipe variables render into the copyable prompt', async ({ page }) => {
  await page.goto('/recipes/fix-reproducible-bug/');
  const field = page.getByLabel('Non-goal');
  await field.fill('touch the payment gateway');
  await expect(page.getByText('Do not touch the payment gateway.')).toBeVisible();
});

test('the 404 page offers a way back', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'That page does not exist' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Learning path', exact: true })).toBeVisible();
});
