# allure-action-tests

Example repository: **TypeScript + Playwright + Allure 3 + allure-action PR comments + GitHub Pages**.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Test runner + browser automation |
| [allure-playwright](https://allurereport.org/docs/playwright/) v3 | Generates raw `allure-results` |
| [allure](https://github.com/allure-framework/allure3) v3 | CLI: builds HTML report — no Java required |
| [allure-framework/allure-action](https://github.com/allure-framework/allure-action) v0.7 | Posts test summary as PR comment + GitHub Check |
| GitHub Pages | Serves the Allure report after every push to `main` |

## Project layout

```
tests/
  unit/       calculator.spec.ts   — TypeScript logic
  api/        todos.spec.ts        — REST API (JSONPlaceholder)
  e2e/        navigation.spec.ts   — browser tests (Playwright + route mocking)
src/
  calculator.ts
  todo.ts
.github/workflows/
  tests.yml   — run → generate → PR comment → GitHub Pages
allurerc.mjs  — Allure 3 config (name, output dir, history)
playwright.config.ts
```

## Running locally

```bash
yarn install
yarn playwright install --with-deps chromium

# Run tests  →  allure-results/
yarn test

# Generate Allure 3 Classic report  →  allure-report/
yarn allure:generate

# Open in browser
yarn allure:open

# Live-reload from raw results (no generate step needed)
yarn allure:serve
```

## Allure features in tests

All functions imported from `allure-js-commons` (the modern API):

- `step()` — nested steps with typed return values
- `tags()` / `tag()` — one or many labels per call
- `severity()`, `feature()`, `story()`, `owner()`
- `attachment()` — JSON payloads, PNG screenshots, plain text
- `parameter()` — shows test data in the report
- `issue()`, `link()` — external links
- `description()` — rich Markdown test context

## CI / CD flow

```
push / PR
   │
   ├─ test job
   │    ├─ yarn install --frozen-lockfile
   │    ├─ playwright install chromium
   │    ├─ yarn test               (continue-on-error)
   │    ├─ allure classic allure-results   ← Allure 3, no Java
   │    ├─ allure-framework/allure-action  ← PR comment + GitHub Check
   │    ├─ upload-artifact: allure-report
   │    └─ assert test outcome
   │
   └─ publish-report (main / master push only)
        ├─ download allure-report artifact
        └─ deploy → GitHub Pages  🌐
```

## GitHub Pages setup

1. Go to **Settings → Pages → Source** and select **GitHub Actions**
2. After the first push to `main`, the report is live at:  
   `https://<org>.github.io/<repo>/`

## allurerc.mjs

```js
import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Allure Action Tests',
  output: './allure-report',      // used by allure-action to find summary.json
  historyPath: './allure-history.jsonl',
});
```
