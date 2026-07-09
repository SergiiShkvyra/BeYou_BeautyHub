import { Page, Route } from '@playwright/test';

export const SECTION_IDS = ['home', 'services', 'about', 'gallery', 'contact'] as const;

export const PHONE_DISPLAY = '(571)-276-7014';
export const EMAIL = 'info@beyoubeautyhub.com';

/** Navigate to the site and wait until the header is rendered. */
export async function gotoHome(page: Page) {
  await page.goto('/');
  await page.locator('header').waitFor();
}

export interface CapturedEmail {
  body: Record<string, unknown> | null;
}

/**
 * Intercept every request to the EmailJS API so tests never send a real email.
 * Returns a capture object whose `body` is filled with the request payload
 * once the form is submitted.
 */
export async function mockEmailJS(
  page: Page,
  opts: { status?: number } = {},
): Promise<CapturedEmail> {
  const captured: CapturedEmail = { body: null };
  await page.route('**/api.emailjs.com/**', async (route: Route) => {
    captured.body = route.request().postDataJSON();
    if (opts.status && opts.status >= 400) {
      await route.fulfill({ status: opts.status, body: 'Mocked failure' });
    } else {
      await route.fulfill({ status: 200, body: 'OK' });
    }
  });
  return captured;
}

/**
 * Replace window.open before the page loads so clicking "Open in Google Maps"
 * etc. records the URL instead of opening a real tab to an external site.
 */
export async function stubWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __openedUrls: string[] }).__openedUrls = [];
    window.open = ((url: string) => {
      (window as unknown as { __openedUrls: string[] }).__openedUrls.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

export async function getOpenedUrls(page: Page): Promise<string[]> {
  return page.evaluate(
    () => (window as unknown as { __openedUrls: string[] }).__openedUrls ?? [],
  );
}

/** Instantly scroll the window and give the header's rAF-throttled scroll handler a beat. */
export async function scrollWindowTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(100);
}
