import { screenshotAndAttach } from '@datacamp/playwright-helpers';
import { expect, test } from '@playwright/test';

test('Pricing page has the right content', async ({ page }, testInfo) => {
  await page.goto('https://www.datacamp-staging.com/pricing');

  await expect(page).toHaveTitle(
    'Plans and Pricing - Choose a Package | DataCamp',
  );

  await expect(
    page.getByText('Learn the data skills you need to advance your career.'),
  ).toBeVisible();

  await screenshotAndAttach('pricing', { page, testInfo });
});
