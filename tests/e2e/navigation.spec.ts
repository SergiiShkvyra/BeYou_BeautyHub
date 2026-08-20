import { test, expect, Page } from './fixtures';
import { gotoHome, scrollWindowTo } from './helpers';

const NAV_ITEMS = [
  { label: 'Home', section: 'home' },
  { label: 'Services', section: 'services' },
  { label: 'About', section: 'about' },
  { label: 'Gallery', section: 'gallery' },
  { label: 'Contact', section: 'contact' },
];

/**
 * Poll until the section's top has smooth-scrolled into the top region of the
 * viewport. Polling the position itself (rather than "scrollY stopped moving")
 * avoids a race where scrollY is still stable in the frames right after the
 * click, before the smooth scroll begins.
 *
 * index.css sets `scroll-padding-top: 140px` so scrollIntoView deliberately
 * rests each section 140px down, clear of the fixed header — hence the bound.
 */
const SCROLL_PADDING_TOP = 140;

async function expectSectionAtTop(page: Page, section: string) {
  // Two-sided bound: when scrolling UP to a section it starts above the
  // viewport (negative top), so "top small enough" alone would pass mid-scroll.
  await expect
    .poll(
      async () => {
        const top = await page
          .locator(`#${section}`)
          .evaluate((el) => el.getBoundingClientRect().top);
        return top >= -10 && top <= SCROLL_PADDING_TOP + 10;
      },
      { message: `#${section} should rest at the top of the viewport`, timeout: 10_000 },
    )
    .toBe(true);
}

test.describe('header navigation', () => {
  for (const { label, section } of NAV_ITEMS) {
    test(`nav button "${label}" scrolls to #${section}`, async ({ page }) => {
      await gotoHome(page);
      // Start away from the target so the scroll is observable.
      if (section === 'home') await scrollWindowTo(page, 2000);

      await page.locator('header nav').getByRole('button', { name: label }).click();
      await expectSectionAtTop(page, section);

      const rect = await page
        .locator(`#${section}`)
        .evaluate((el) => el.getBoundingClientRect());
      const viewport = page.viewportSize()!;
      expect(rect.bottom, `#${section} still occupies the viewport`).toBeGreaterThan(
        Math.min(300, viewport.height * 0.5),
      );
    });
  }

  test('footer quick link scrolls back up to its section', async ({ page }) => {
    await gotoHome(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    await page.locator('footer').getByRole('button', { name: 'Services', exact: true }).click();
    await expectSectionAtTop(page, 'services');
  });
});

test.describe('header collapse on scroll', () => {
  // The collapse animates max-height on the wrapper div, so the wrapper's
  // rendered height is the ground truth. (Its children keep a non-zero
  // bounding box even when clipped, so element "visibility" can't be used.)
  const collapsibleWrapper = (page: Page) =>
    page.locator('header > div.overflow-hidden').first();

  async function expectCollapsed(page: Page) {
    await expect
      .poll(async () => (await collapsibleWrapper(page).boundingBox())?.height ?? 0, {
        message: 'top bar should collapse to zero height',
      })
      .toBeLessThan(1);
  }

  async function expectExpanded(page: Page) {
    await expect
      .poll(async () => (await collapsibleWrapper(page).boundingBox())?.height ?? 0, {
        message: 'top bar should expand back',
      })
      .toBeGreaterThan(20);
  }

  test('top bar collapses when scrolling down and returns at the very top', async ({
    page,
  }) => {
    await gotoHome(page);
    await expectExpanded(page);

    await scrollWindowTo(page, 600);
    await expectCollapsed(page);

    await scrollWindowTo(page, 0);
    await expectExpanded(page);
  });

  test('scrolling up mid-page re-expands the top bar (except phone landscape)', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-landscape',
      'Phone landscape intentionally only re-expands at the very top',
    );
    await gotoHome(page);
    await scrollWindowTo(page, 800);
    await expectCollapsed(page);

    await scrollWindowTo(page, 400);
    await expectExpanded(page);
  });

  test('phone landscape: stays collapsed on scroll-up until the very top', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-landscape',
      'Only applies to phone landscape orientation',
    );
    await gotoHome(page);
    await scrollWindowTo(page, 800);
    await expectCollapsed(page);

    // Scrolling up mid-page must NOT re-expand in landscape.
    await scrollWindowTo(page, 400);
    await page.waitForTimeout(800);
    await expectCollapsed(page);

    // Only the very top re-expands.
    await scrollWindowTo(page, 0);
    await expectExpanded(page);
  });

  test('nav bar stays clickable while the top bar is collapsed', async ({ page }) => {
    await gotoHome(page);
    await scrollWindowTo(page, 600);
    await expectCollapsed(page);
    await expect(
      page.locator('header nav').getByRole('button', { name: 'Services' }),
    ).toBeVisible();
  });
});
