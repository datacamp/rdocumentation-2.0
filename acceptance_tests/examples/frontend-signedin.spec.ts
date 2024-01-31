import {
  screenshotAndAttach,
  testWithAuth,
} from '@datacamp/playwright-helpers';
import { expect } from '@playwright/test';

const test = testWithAuth({
  email: '<test-email-here>',
  password: '<test-password-here>',
});

test('mfe-demo home has a list of courses', async ({ page }, testInfo) => {
  await page.goto('https://app.datacamp-staging.com/mfe-demo/');

  await expect(page).toHaveTitle('Welcome to mfe-demo!');

  // create a locator
  const coursesList = await page.getByTestId('courses-list');
  const courseItems = await coursesList.locator('li > a');
  expect(await courseItems.count()).toBeGreaterThan(10);

  await expect(page.getByText("Hi, I'm a parcel!")).toBeVisible();

  await screenshotAndAttach('homepage', { page, testInfo });
});
