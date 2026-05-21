import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Allure Action Tests',
  output: './allure-report',
  historyPath: './allure-history.jsonl',
});
