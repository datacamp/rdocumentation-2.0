import { testWithAuth } from '@datacamp/playwright-helpers';
import { expect } from '@playwright/test';

const test = testWithAuth({
  email: '<test-email-here>',
  password: '<test-password-here>',
});
test.use({
  baseURL: 'https://mfe-demo-api.datacamp-staging.com',
});

test('Signed-in API responds correctly', async ({ request }) => {
  const resp = await request.get('/ssr/mfe-app-demo/mfe-demo');
  const data = await resp.json();
  expect(data.body).toContain('Welcome,');
  expect(data.head).toContain('<title');
  expect(data.props.dehydratedState.queries.length).toBeGreaterThan(0);
});
