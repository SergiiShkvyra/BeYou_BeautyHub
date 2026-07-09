import { test as base } from '@playwright/test';

/**
 * Project-wide test wrapper. All specs import { test, expect } from here
 * instead of '@playwright/test'.
 *
 * PAUSE=1 (headed runs only): freezes each test right before its browser
 * closes and opens the Playwright Inspector — click Resume (▶ / F8) to let the
 * test finish and move on to the next one. In headless runs page.pause() is a
 * no-op, so the variable is harmless there.
 *
 *   $env:PAUSE = "1"; npx playwright test -g "preselected" --project=chromium --headed --workers=1
 */
export const test = base.extend({
  // (param named `run`, not Playwright's usual `use`, so eslint's React-hooks
  // rule doesn't mistake it for a hook call)
  page: async ({ page }, run, testInfo) => {
    if (process.env.PAUSE) testInfo.setTimeout(0); // don't kill the pause
    await run(page);
    if (process.env.PAUSE) await page.pause();
  },
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';
