import { test, expect, Page } from './fixtures';
import { gotoHome, PHONE_DISPLAY, EMAIL } from './helpers';

// Phone/email/text are real tel:/mailto:/sms: links (SEO + native long-press
// menus). A finger tap lets the link open the dialer/mail app/Messages; a
// mouse or keyboard click is intercepted and copies to the clipboard instead.
// The copy branch is asserted on desktop projects, the tap branch on mobile.

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

test.describe('phone & email interactions (desktop)', { tag: '@critical' }, () => {
  // Playwright requires the destructuring pattern even when no fixture is used.
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      isMobileProject(testInfo.project.name),
      'Mobile projects tap instead (see the touch describe below)',
    );
  });

  test('clicking the phone number copies it and shows the toast', async ({
    page,
  }, testInfo) => {
    const dialogs = trackDialogs(page);
    await gotoHome(page);

    await page
      .locator('#contact')
      .getByRole('link', { name: PHONE_DISPLAY })
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

    await page.locator('#contact').getByRole('link', { name: EMAIL }).click();

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

    await page.getByRole('link', { name: /text us/i }).click();

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

const CONTACT_LINKS = [
  { where: 'header', name: PHONE_DISPLAY, href: 'tel:+15712767014' },
  { where: '#contact', name: PHONE_DISPLAY, href: 'tel:+15712767014' },
  { where: '#contact', name: EMAIL, href: 'mailto:' + EMAIL },
  { where: '#contact', name: /text us/i, href: 'sms:+15712767014' },
  { where: 'footer', name: PHONE_DISPLAY, href: 'tel:+15712767014' },
  { where: 'footer', name: EMAIL, href: 'mailto:' + EMAIL },
] as const;

test.describe('phone, email & text are real links', { tag: '@critical' }, () => {
  test('every contact link carries the right tel:/mailto:/sms: href', async ({ page }) => {
    await gotoHome(page);
    for (const { where, name, href } of CONTACT_LINKS) {
      await expect(
        page.locator(where).getByRole('link', { name }),
        `${where} ${String(name)}`,
      ).toHaveAttribute('href', href);
    }
  });
});

test.describe('phone, email & text on touch', { tag: '@critical' }, () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'Needs a touch device');
  });

  for (const { name, href } of CONTACT_LINKS.filter((l) => l.where === '#contact')) {
    test(`tapping ${String(name)} lets ${href.split(':')[0]}: open natively`, async ({ page }) => {
      await gotoHome(page);
      // Record whether the site's handler blocked the link, then block it
      // ourselves so the test browser never actually launches an app.
      await page.evaluate(() => {
        window.addEventListener('click', (e) => {
          (window as unknown as { __blocked?: boolean }).__blocked = e.defaultPrevented;
          e.preventDefault();
        });
      });
      const link = page.locator('#contact').getByRole('link', { name });
      await link.scrollIntoViewIfNeeded();
      await link.tap();

      await expect
        .poll(() => page.evaluate(() => (window as unknown as { __blocked?: boolean }).__blocked))
        .toBe(false);
      await expect(page.getByText(/copied to clipboard/)).toHaveCount(0);
    });
  }
});
