import test, { expect } from '@playwright/test';

test.use({
  baseURL: 'https://www.datacamp-staging.com',
});

test('API responds correctly', async ({ request }) => {
  const resp = await request.get('/api/users/signed_in.json');
  const data = await resp.json();
  expect(resp.status()).toBe(401);
  expect(data).toEqual({
    error:
      'Oops! You are not signed in yet. Please sign yourself in before continuing.',
  });
});
