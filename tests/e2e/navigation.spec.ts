import { test, expect } from '@playwright/test';
import {
  step,
  tags,
  tag,
  severity,
  feature,
  story,
  attachment,
  link,
  ContentType,
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';

// Example.com page stub used across all tests
const EXAMPLE_PAGE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Example Domain</title>
</head>
<body>
  <div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents.</p>
    <p><a href="https://www.iana.org/domains/reserved">More information...</a></p>
  </div>
</body>
</html>`;

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Serve the stub without real network requests
    await page.route('https://example.com/', async (route) => {
      await route.fulfill({ contentType: 'text/html', body: EXAMPLE_PAGE_HTML });
    });
  });

  test('example.com loads and has correct heading', async ({ page }) => {
    await severity(Severity.CRITICAL);
    await feature('Navigation');
    await story('Page load');
    await tags('smoke', 'e2e');
    await link('https://example.com', 'Example Domain', 'docs');

    await step('Navigate to https://example.com', async () => {
      await page.goto('https://example.com/');
    });

    await step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Exampled Domain/);
    });

    await step('Verify h1 heading', async () => {
      await expect(page.locator('h1')).toHaveText('Example Domain');
    });

    await step('Capture screenshot', async () => {
      const screenshot = await page.screenshot({ fullPage: true });
      await attachment('Full page screenshot', screenshot, ContentType.PNG);
    });
  });

  test('example.com has UTF-8 charset', async ({ page }) => {
    await severity(Severity.NORMAL);
    await feature('Navigation');
    await story('Meta tags');

    await page.goto('https://example.com/');

    await step('Check meta charset is UTF-8', async () => {
      const charset = await page.locator('meta[charset]').getAttribute('charset');
      expect(charset?.toLowerCase()).toBe('utf-8');
    });
  });

  test('example.com has a "More information" link', async ({ page }) => {
    await severity(Severity.NORMAL);
    await feature('Navigation');
    await story('Links');

    await page.goto('https://example.com/');

    const linkLocator = page.locator('a', { hasText: 'More information' });

    await step('Verify link is visible', async () => {
      await expect(linkLocator).toBeVisible();
    });

    await step('Verify link points to iana.org', async () => {
      const href = await linkLocator.getAttribute('href');
      expect(href).toContain('iana.org');
    });
  });

  test('page is accessible — has proper landmark structure', async ({ page }) => {
    await severity(Severity.NORMAL);
    await feature('Accessibility');
    await story('Landmarks');
    await tag('a11y');

    await page.goto('https://example.com/');

    await step('Verify div wrapper is present', async () => {
      await expect(page.locator('div')).toBeVisible();
    });

    await step('Verify paragraph text is present', async () => {
      await expect(page.locator('p').first()).toBeVisible();
    });
  });
});
