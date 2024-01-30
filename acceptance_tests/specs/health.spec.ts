import {
  checkApiHealth,
  getInternalServiceUrl,
} from '@datacamp/playwright-helpers';
import test, { expect } from '@playwright/test';

test('API is healthy', async ({ playwright }) => {
  const healthy = await checkApiHealth(
    getInternalServiceUrl('rdocumentaion'),
    playwright,
    {
      healthEndpoint: '/api/local_health',
    },
  );
  expect(healthy).toBe(true);
});

test('Frontend is healthy', async ({ request }) => {
  const resp = await request.get('https://www.rdocumentation.org/');
  expect(resp.status()).toBe(200);
});
