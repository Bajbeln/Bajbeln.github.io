# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.ts >> Bajbeln browser smoke tests >> expands and scrolls to a search result
- Location: tests/e2e/site.spec.ts:19:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://127.0.0.1:4173/nosaby/?search=Totalfinal
Call log:
  - navigating to "http://127.0.0.1:4173/nosaby/?search=Totalfinal", waiting until "load"

```

# Test source

```ts
  1  | /// <reference lib="dom" />
  2  | 
  3  | import { expect, test } from '@playwright/test';
  4  | 
  5  | const songId = 'nos-1-efraims-sang';
  6  | const songTitle = '[NOS 1] Efraims sång';
  7  | 
  8  | test.describe('Bajbeln browser smoke tests', () => {
  9  |   test('searches for a song from the homepage', async ({ page }) => {
  10 |     await page.goto('/');
  11 | 
  12 |     await page.getByRole('textbox', { name: 'Sök efter en kuplett' }).fill(songTitle);
  13 |     await page.getByRole('button', { name: 'Sök' }).click();
  14 | 
  15 |     await expect(page).toHaveURL(/\/nosaby\/\?search=/);
  16 |     await expect(page.locator(`#${songId}`)).toBeVisible();
  17 |   });
  18 | 
  19 |   test('expands and scrolls to a search result', async ({ page }) => {
> 20 |     await page.goto('/nosaby/?search=Totalfinal');
     |                ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://127.0.0.1:4173/nosaby/?search=Totalfinal
  21 | 
  22 |     const songButton = page.locator('#nos-8-totalfinal');
  23 |     const songContent = songButton
  24 |       .locator('xpath=ancestor::div[contains(@class, "song-block")]')
  25 |       .locator('.content');
  26 | 
  27 |     await expect(songButton).toHaveClass(/active/);
  28 |     await expect(songContent).toHaveClass(/open/);
  29 |     await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  30 |   });
  31 | 
  32 |   test('copies a direct song link', async ({ context, page }) => {
  33 |     await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
  34 |       origin: 'http://127.0.0.1:4173',
  35 |     });
  36 |     await page.goto('/nosaby/');
  37 | 
  38 |     await page.locator(`#${songId}`).locator('xpath=following-sibling::button[1]').click();
  39 | 
  40 |     await expect
  41 |       .poll(() => page.evaluate(() => navigator.clipboard.readText()))
  42 |       .toBe(`${await page.evaluate(() => window.location.href.split('#')[0])}#${songId}`);
  43 |   });
  44 | 
  45 |   test('navigates to a random song', async ({ page }) => {
  46 |     await page.goto('/nosaby/');
  47 | 
  48 |     await page.getByRole('button', { name: 'Gå till en slumpmässig kuplett' }).click();
  49 | 
  50 |     await expect(page).toHaveURL(/\/[^/]+\/\?search=.+/);
  51 |   });
  52 | 
  53 |   test('persists dark mode across reloads', async ({ page }) => {
  54 |     await page.goto('/');
  55 | 
  56 |     await page.getByRole('button', { name: 'Öppna inställningar' }).click();
  57 |     await expect(page.locator('#settings-options')).toHaveClass(/show/);
  58 |     await page.locator('#dark-mode-button').click();
  59 | 
  60 |     await expect(page.locator('html')).toHaveClass(/dark-mode/);
  61 |     await expect(page.locator('body')).toHaveClass(/dark-mode/);
  62 |     await expect.poll(() => page.evaluate(() => localStorage.getItem('darkMode'))).toBe('true');
  63 | 
  64 |     await page.reload();
  65 | 
  66 |     await expect(page.locator('html')).toHaveClass(/dark-mode/);
  67 |     await expect(page.locator('body')).toHaveClass(/dark-mode/);
  68 |   });
  69 | 
  70 |   test('loads the homepage from the service-worker cache while offline', async ({
  71 |     context,
  72 |     page,
  73 |   }) => {
  74 |     await page.goto('/');
  75 |     await page.evaluate(async () => {
  76 |       await navigator.serviceWorker.ready;
  77 |     });
  78 |     await page.reload();
  79 | 
  80 |     await context.setOffline(true);
  81 |     await page.reload();
  82 | 
  83 |     await expect(page).toHaveTitle('Bajbeln');
  84 |     await expect(page.getByRole('textbox', { name: 'Sök efter en kuplett' })).toBeVisible();
  85 |   });
  86 | });
  87 | 
```