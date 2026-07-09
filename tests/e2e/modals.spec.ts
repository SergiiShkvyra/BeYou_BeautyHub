import { test, expect, Page } from './fixtures';
import { gotoHome, stubWindowOpen, getOpenedUrls } from './helpers';

// The navigation-app picker modal is deliberately implemented three separate
// times (Header, Contact, Footer) with slightly different styling — each
// instance gets its own coverage.

const modal = (page: Page) => page.locator('[data-navigation-modal]');

async function expectModalContents(page: Page) {
  await expect(modal(page)).toBeVisible();
  await expect(modal(page).getByText('Choose Navigation App')).toBeVisible();
  for (const app of ['Google Maps', 'Apple Maps', 'Waze']) {
    await expect(
      modal(page).getByRole('button', { name: new RegExp(`Open in ${app}`) }),
    ).toBeVisible();
  }
  await expect(modal(page).getByRole('button', { name: 'Cancel' })).toBeVisible();
}

test.describe('navigation-app picker modals', () => {
  test('Contact section: opens, lists all 3 apps, Cancel closes', async ({ page }) => {
    await gotoHome(page);
    await page
      .locator('#contact')
      .getByRole('button', { name: /Salons by JC/ })
      .click();

    await expectModalContents(page);
    await modal(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(modal(page)).toHaveCount(0);
  });

  test('Contact section: clicking the overlay outside the dialog closes it', async ({
    page,
  }) => {
    await gotoHome(page);
    await page
      .locator('#contact')
      .getByRole('button', { name: /Salons by JC/ })
      .click();
    await expect(modal(page)).toBeVisible();

    // Click the overlay near the bottom-left, away from the centered dialog
    // AND below the header (whose force-visible logic pins it above the
    // overlay's z-index, which would swallow a click near the top).
    const viewport = page.viewportSize()!;
    await page.mouse.click(10, viewport.height - 10);
    await expect(modal(page)).toHaveCount(0);
  });

  test('Contact section: choosing Google Maps opens the maps URL in a new tab', async ({
    page,
  }) => {
    await stubWindowOpen(page);
    await gotoHome(page);
    await page
      .locator('#contact')
      .getByRole('button', { name: /Salons by JC/ })
      .click();

    await modal(page).getByRole('button', { name: /Open in Google Maps/ }).click();

    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain('google.com/maps');
    await expect(modal(page)).toHaveCount(0);
  });

  test('Footer: opens, lists all 3 apps, Cancel closes', async ({ page }) => {
    await gotoHome(page);
    await page
      .locator('footer')
      .getByRole('button', { name: /Salons by JC/ })
      .click();

    await expectModalContents(page);
    await modal(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(modal(page)).toHaveCount(0);
  });

  test('Header (desktop ≥640px): address button opens the modal', async ({ page }) => {
    await gotoHome(page);
    test.skip(
      page.viewportSize()!.width < 640,
      'Desktop header address button is hidden below the sm breakpoint',
    );

    await page
      .locator('header')
      .getByRole('button', { name: /Salons by JC/ })
      .click();

    await expectModalContents(page);
    await modal(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(modal(page)).toHaveCount(0);
  });

  test('Header (mobile <640px): "Arlington, VA" button opens the modal', async ({
    page,
  }) => {
    await gotoHome(page);
    test.skip(
      page.viewportSize()!.width >= 640,
      'Mobile header location button only renders below the sm breakpoint',
    );

    // The button's aria-label overrides its visible "Arlington, VA" text as
    // the accessible name.
    await page
      .locator('header')
      .getByRole('button', { name: /Open BeYou BeautyHub location/ })
      .click();

    await expectModalContents(page);
    await modal(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(modal(page)).toHaveCount(0);
  });
});
