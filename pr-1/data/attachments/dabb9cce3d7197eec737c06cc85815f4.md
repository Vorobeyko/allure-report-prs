# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/navigation.spec.ts >> Navigation >> example.com loads and has correct heading
- Location: tests/e2e/navigation.spec.ts:39:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Exampled Domain/
Received string:  "Example Domain"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "Example Domain"

```

```yaml
- heading "Example Domain" [level=1]
- paragraph: This domain is for use in illustrative examples in documents.
- paragraph:
  - link "More information...":
    - /url: https://www.iana.org/domains/reserved
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import {
  3   |   step,
  4   |   tags,
  5   |   tag,
  6   |   severity,
  7   |   feature,
  8   |   story,
  9   |   attachment,
  10  |   link,
  11  |   ContentType,
  12  | } from 'allure-js-commons';
  13  | import { Severity } from 'allure-js-commons';
  14  | 
  15  | // Example.com page stub used across all tests
  16  | const EXAMPLE_PAGE_HTML = `<!DOCTYPE html>
  17  | <html>
  18  | <head>
  19  |   <meta charset="UTF-8">
  20  |   <title>Example Domain</title>
  21  | </head>
  22  | <body>
  23  |   <div>
  24  |     <h1>Example Domain</h1>
  25  |     <p>This domain is for use in illustrative examples in documents.</p>
  26  |     <p><a href="https://www.iana.org/domains/reserved">More information...</a></p>
  27  |   </div>
  28  | </body>
  29  | </html>`;
  30  | 
  31  | test.describe('Navigation', () => {
  32  |   test.beforeEach(async ({ page }) => {
  33  |     // Serve the stub without real network requests
  34  |     await page.route('https://example.com/', async (route) => {
  35  |       await route.fulfill({ contentType: 'text/html', body: EXAMPLE_PAGE_HTML });
  36  |     });
  37  |   });
  38  | 
  39  |   test('example.com loads and has correct heading', async ({ page }) => {
  40  |     await severity(Severity.CRITICAL);
  41  |     await feature('Navigation');
  42  |     await story('Page load');
  43  |     await tags('smoke', 'e2e');
  44  |     await link('https://example.com', 'Example Domain', 'docs');
  45  | 
  46  |     await step('Navigate to https://example.com', async () => {
  47  |       await page.goto('https://example.com/');
  48  |     });
  49  | 
  50  |     await step('Verify page title', async () => {
> 51  |       await expect(page).toHaveTitle(/Exampled Domain/);
      |                          ^ Error: expect(page).toHaveTitle(expected) failed
  52  |     });
  53  | 
  54  |     await step('Verify h1 heading', async () => {
  55  |       await expect(page.locator('h1')).toHaveText('Example Domain');
  56  |     });
  57  | 
  58  |     await step('Capture screenshot', async () => {
  59  |       const screenshot = await page.screenshot({ fullPage: true });
  60  |       await attachment('Full page screenshot', screenshot, ContentType.PNG);
  61  |     });
  62  |   });
  63  | 
  64  |   test('example.com has UTF-8 charset', async ({ page }) => {
  65  |     await severity(Severity.NORMAL);
  66  |     await feature('Navigation');
  67  |     await story('Meta tags');
  68  | 
  69  |     await page.goto('https://example.com/');
  70  | 
  71  |     await step('Check meta charset is UTF-8', async () => {
  72  |       const charset = await page.locator('meta[charset]').getAttribute('charset');
  73  |       expect(charset?.toLowerCase()).toBe('utf-8');
  74  |     });
  75  |   });
  76  | 
  77  |   test('example.com has a "More information" link', async ({ page }) => {
  78  |     await severity(Severity.NORMAL);
  79  |     await feature('Navigation');
  80  |     await story('Links');
  81  | 
  82  |     await page.goto('https://example.com/');
  83  | 
  84  |     const linkLocator = page.locator('a', { hasText: 'More information' });
  85  | 
  86  |     await step('Verify link is visible', async () => {
  87  |       await expect(linkLocator).toBeVisible();
  88  |     });
  89  | 
  90  |     await step('Verify link points to iana.org', async () => {
  91  |       const href = await linkLocator.getAttribute('href');
  92  |       expect(href).toContain('iana.org');
  93  |     });
  94  |   });
  95  | 
  96  |   test('page is accessible — has proper landmark structure', async ({ page }) => {
  97  |     await severity(Severity.NORMAL);
  98  |     await feature('Accessibility');
  99  |     await story('Landmarks');
  100 |     await tag('a11y');
  101 | 
  102 |     await page.goto('https://example.com/');
  103 | 
  104 |     await step('Verify div wrapper is present', async () => {
  105 |       await expect(page.locator('div')).toBeVisible();
  106 |     });
  107 | 
  108 |     await step('Verify paragraph text is present', async () => {
  109 |       await expect(page.locator('p').first()).toBeVisible();
  110 |     });
  111 |   });
  112 | });
  113 | 
```