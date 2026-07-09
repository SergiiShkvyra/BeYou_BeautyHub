import { test, expect, Page } from './fixtures';
import { gotoHome, PHONE_DISPLAY, EMAIL } from './helpers';

// Phone/email interactions branch on the user agent: mobile navigates to
// tel:/sms:, desktop copies to the clipboard. The desktop branch is what we
// can meaningfully assert in an automated browser, so mobile projects skip.

function isMobileProject(name: string) {
  return name.startsWith('mobile');
}

/** Collect alert() dialogs (the code's clipboard fallback) and auto-accept them. */
function trackDialogs(page: Page) {
  const messages: string[] = [];
  page.on('dialog', (dialog) => {
    messages.push(dialog.message());
    dialog.accept().catch(() => {});
  });
  return messages;
}

test.describe('phone & email interactions (desktop)', () => {
  // Playwright requires the destructuring pattern even when no fixture is used.
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      isMobileProject(testInfo.project.name),
      'Mobile UA branches into tel:/sms: navigation instead of clipboard',
    );
  });

  test('clicking the phone number copies it and shows the toast', async ({
    page,
  }, testInfo) => {
    const dialogs = trackDialogs(page);
    await gotoHome(page);

    await page
      .locator('#contact')
      .getByRole('button', { name: PHONE_DISPLAY })
      .click();

    // Success shows a toast; if the clipboard API is unavailable the code
    // falls back to an alert — either proves the handler ran.
    const toast = page.getByText('Phone number copied to clipboard!');
    await expect
      .poll(async () => (await toast.count()) > 0 || dialogs.length > 0, {
        message: 'toast or fallback alert should appear',
      })
      .toBe(true);

    if (testInfo.project.name === 'chromium') {
      // Only chromium supports granting clipboard-read to verify the content.
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toBe(PHONE_DISPLAY);
    }
  });

  test('clicking the email address copies it and shows the toast', async ({
    page,
  }, testInfo) => {
    await gotoHome(page);

    await page.locator('#contact').getByRole('button', { name: EMAIL }).click();

    await expect(
      page.getByText(/Email address copied to clipboard!|Email: info@/),
    ).toBeVisible();

    if (testInfo.project.name === 'chromium') {
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toBe(EMAIL);
    }
  });

  test('"Text us" copies the number and explains via alert', async ({ page }) => {
    const dialogs = trackDialogs(page);
    await gotoHome(page);

    await page.getByRole('button', { name: /text us/i }).click();

    await expect
      .poll(() => dialogs.length, { message: 'alert with texting instructions' })
      .toBeGreaterThan(0);
    expect(dialogs[0]).toContain(PHONE_DISPLAY);
  });

  test('"Book Online" opens the Fresha booking page in a new tab', async ({
    page,
    context,
  }) => {
    await gotoHome(page);

    const popupPromise = context.waitForEvent('page');
    // Abort the external request in the popup — we only assert the URL.
    await context.route('**/fresha.com/**', (route) => route.abort());
    await page.getByRole('button', { name: /book online/i }).click();

    const popup = await popupPromise;
    expect(popup.url()).toContain('fresha.com');
    await popup.close();
  });
});
