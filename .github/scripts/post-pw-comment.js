'use strict';

const fs = require('fs');

/**
 * Posts (or updates) a Playwright test summary comment on a pull request.
 * Called from actions/github-script — receives github, context, core from the action.
 *
 * Required env vars (set in the workflow step):
 *   PW_REPORT_URL  — public URL of the deployed Playwright HTML report
 *   PW_RESULTS_PATH — path to the JSON reporter output (default: test-results/pw-results.json)
 */
module.exports = async ({ github, context }) => {
  const url         = process.env.PW_REPORT_URL;
  const resultsPath = process.env.PW_RESULTS_PATH ?? 'test-results/pw-results.json';
  const prNumber    = context.issue.number;

  // ── Read stats ────────────────────────────────────────────────────────────
  const stats = fs.existsSync(resultsPath)
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')).stats
    : null;

  const passed  = stats?.expected   ?? '—';
  const failed  = stats?.unexpected ?? '—';
  const skipped = stats?.skipped    ?? '—';
  const flaky   = stats?.flaky      ?? '—';

  const ms       = stats?.duration ?? 0;
  const duration = ms >= 60_000
    ? `${Math.floor(ms / 60_000)}m ${((ms % 60_000) / 1000).toFixed(0)}s`
    : ms >= 1_000
    ? `${(ms / 1000).toFixed(1)}s`
    : `${Math.round(ms)}ms`;

  const overall = (stats?.unexpected ?? 1) > 0 ? '❌' : '✅';

  // ── Build comment body ────────────────────────────────────────────────────
  const MARKER = '<!-- pw-report-summary -->';

  const body = [
    MARKER,
    '## 🎭 Playwright Report Summary',
    '',
    '| | Name | Duration | Stats | Flaky | Report |',
    '|---|---|---|---|---|---|',
    `| ${overall} | Playwright Tests – Pull request #${prNumber} | ${duration} | ✅ ${passed} ❌ ${failed} ⏭️ ${skipped} | ${flaky} | [View →](${url}) |`,
  ].join('\n');

  // ── Post or update comment ────────────────────────────────────────────────
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo:  context.repo.repo,
    issue_number: prNumber,
  });

  const existing = comments.find(c => c.body.includes(MARKER));

  if (existing) {
    await github.rest.issues.updateComment({
      owner:      context.repo.owner,
      repo:       context.repo.repo,
      comment_id: existing.id,
      body,
    });
  } else {
    await github.rest.issues.createComment({
      owner:        context.repo.owner,
      repo:         context.repo.repo,
      issue_number: prNumber,
      body,
    });
  }
};
