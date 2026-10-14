import { test, expect, Page } from './fixtures';
import { gotoHome } from './helpers';

// Footer policy modals: each opens from its footer button and closes three
// ways — the X, the Close button at the bottom, and a click on the dimmed
// backdrop (but NOT a click inside the dialog itself).

const POLICIES = [
  { button: 'Privacy Policy', heading: 'Privacy Policy', close: 'Close Privacy Policy modal' },
  { button: 'Terms of Service', heading: 'Terms of Service', close: 'Close Terms of Service modal' },
  { button: 'Cookie Policy', heading: 'Cookie Policy', close: 'Close Cookie Policy modal' },
];

const heading = (page: Page, name: string) =>
  page.getByRole('heading', { level: 2, name, exact: true });

async function open(page: Page, button: string, title: string) {
  await page.locator('footer').getByRole('button', { name: button, exact: true }).click();
  await expect(heading(page, title)).toBeVisible();
}

test.describe('footer policy modals', { tag: '@extended' }, () => {
  for (const { button, heading: title, close } of POLICIES) {
    test(`${button}: opens with content, X closes`, async ({ page }) => {
      await gotoHome(page);
      await open(page, button, title);
      // Numbered sections are present (not an empty shell).
      await expect(page.getByRole('heading', { level: 3, name: /^1\. / })).toBeVisible();
      await page.getByRole('button', { name: close }).click();
      await expect(heading(page, title)).toHaveCount(0);
    });

    test(`${button}: bottom Close button closes`, async ({ page }) => {
      await gotoHome(page);
      await open(page, button, title);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(heading(page, title)).toHaveCount(0);
    });

    test(`${button}: backdrop click closes, click inside does not`, async ({ page }) => {
      await gotoHome(page);
      await open(page, button, title);

      await heading(page, title).click();
      await expect(heading(page, title), 'click inside keeps it open').toBeVisible();

      // Bottom-left corner of the backdrop — below the header, which sits
      // above every overlay (see CLAUDE.md).
      const viewport = page.viewportSize()!;
      await page.mouse.click(4, viewport.height - 4);
      await expect(heading(page, title)).toHaveCount(0);
    });
  }
});
