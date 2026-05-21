import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        suiteTitle: true,
        resultsDir: 'allure-results',
        environmentInfo: {
          os_platform: process.platform,
          node_version: process.version,
        },
        links: {
          issue: {
            nameTemplate: 'Issue #%s',
            urlTemplate: 'https://github.com/your-org/your-repo/issues/%s',
          },
          tms: {
            nameTemplate: 'TMS #%s',
            urlTemplate: 'https://your-tms.example.com/tests/%s',
          },
        },
        categories: [
          {
            name: 'Ignored tests',
            matchedStatuses: ['skipped'],
          },
          {
            name: 'Infrastructure problems',
            messageRegex: '.*(ECONNREFUSED|ETIMEDOUT|Connection refused|timeout).*',
            matchedStatuses: ['broken'],
          },
          {
            name: 'Product defects',
            matchedStatuses: ['failed'],
          },
          {
            name: 'Test defects',
            matchedStatuses: ['broken'],
          },
        ],
      },
    ],
  ],

  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 'on' → trace attached for every browser test in the Allure report.
        // Switch to 'retain-on-failure' in large suites to save space.
        trace: 'on',
        video: 'retain-on-failure',
      },
      testMatch: ['**/e2e/**/*.spec.ts'],
    },
    {
      name: 'unit',
      testMatch: ['**/unit/**/*.spec.ts', '**/api/**/*.spec.ts'],
    },
  ],
});
