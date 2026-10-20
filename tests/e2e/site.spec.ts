/// <reference lib="dom" />

import { expect, test } from '@playwright/test';

const songId = 'nos-1-efraims-sang';
const songTitle = '[NOS 1] Efraims sång';

test.describe('Bajbeln browser smoke tests', () => {
  test('searches for a song from the homepage', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: 'Sök efter en kuplett!' }).fill(songTitle);
    await page.getByRole('button', { name: 'Sök' }).click();

    await expect(page).toHaveURL(/\/nosaby\/\?search=/);
    await expect(page.locator(`#${songId}`)).toBeVisible();
  });

  test('expands and scrolls to a search result', async ({ page }) => {
    await page.goto('/nosaby/?search=Totalfinal');

    const songButton = page.locator('#nos-8-totalfinal');
    const songContent = songButton
      .locator('xpath=ancestor::div[contains(@class, "song-block")]')
      .locator('.content');

    await expect(songButton).toHaveClass(/active/);
    await expect(songContent).toHaveClass(/open/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test('copies a direct song link', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: 'http://127.0.0.1:4173',
    });
    await page.goto('/nosaby/');

    await page.locator(`#${songId}`).locator('xpath=following-sibling::button[1]').click();

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(`${await page.evaluate(() => window.location.href.split('#')[0])}#${songId}`);
  });

  test('navigates to a random song', async ({ page }) => {
    await page.goto('/nosaby/');

    await page.getByRole('button', { name: 'Gå till en slumpmässig kuplett' }).click();

    await expect(page).toHaveURL(/\/[^/]+\/\?search=.+/);
  });

  test('persists dark mode across reloads', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Öppna inställningar' }).click();
    await expect(page.locator('#settings-options')).toHaveClass(/show/);
    await page.locator('#dark-mode-button').click();

    await expect(page.locator('html')).toHaveClass(/dark-mode/);
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('darkMode'))).toBe('true');

    await page.reload();

    await expect(page.locator('html')).toHaveClass(/dark-mode/);
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
  });

  test('loads the homepage from the service-worker cache while offline', async ({
    context,
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();

    await context.setOffline(true);
    await page.reload();

    await expect(page).toHaveTitle('Bajbeln');
    await expect(page.getByRole('textbox', { name: 'Sök efter en kuplett!' })).toBeVisible();
  });
});
