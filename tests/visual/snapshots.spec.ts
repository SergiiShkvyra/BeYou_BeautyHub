import { test, expect } from '../e2e/fixtures';
import { gotoHome, scrollWindowTo, SECTION_IDS } from '../e2e/helpers';

// Visual regression guards against the failure mode this codebase has already
// hit once: a CSS rule silently restyling an unrelated element (the .bg-warm
// nuclear-selector collision). Baselines live in __screenshots__/ per project;
// regenerate deliberately with `npm run test:visual:update`.
//
// Baselines are OS-specific (font rendering) — they are generated and compared
// on this machine only, which matches the local-only test strategy.

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await page.waitForLoadState('networkidle');
  });

  test('header expanded (top of page)', async ({ page }) => {
    await expect(page.locator('header')).toHaveScreenshot('header-expanded.png');
  });

  test('header collapsed (scrolled down)', async ({ page }) => {
    await scrollWindowTo(page, 800);
    // Let the 500ms max-height/opacity transition finish.
    await page.waitForTimeout(700);
    await expect(page.locator('header')).toHaveScreenshot('header-collapsed.png');
  });

  for (const id of SECTION_IDS) {
    test(`section #${id}`, async ({ page }) => {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      // Give lazy-loaded images in the section time to decode.
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await expect(section).toHaveScreenshot(`section-${id}.png`);
    });
  }

  test('footer', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    await expect(footer).toHaveScreenshot('footer.png');
  });
});
