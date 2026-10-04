import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4174';
const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'no-preference',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
  webServer: {
    // Astro can auto-background under agent shells; Playwright must own this process.
    command: 'npm run preview -- --host 127.0.0.1 --port 4174 --ignore-lock',
    url: baseURL,
    reuseExistingServer: !ci,
    timeout: 30_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 2_000 },
  },
});
