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
 *
 * Returns a fake tab rather than null, so code that opens a blank tab and
 * then navigates it (`window.open('about:blank').location.href = url`, as the
 * Testimonials Fresha link does) is recorded too, instead of falling back to
 * navigating the page under test away.
 */
export async function stubWindowOpen(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as {
      __openedUrls: string[];
      __openedTabs: { location: { href: string } }[];
    };
    w.__openedUrls = [];
    w.__openedTabs = [];
    window.open = ((url: string) => {
      w.__openedUrls.push(String(url));
      const tab = { opener: null, location: { href: String(url) }, close() {}, focus() {} };
      w.__openedTabs.push(tab);
      return tab;
    }) as unknown as typeof window.open;
  });
}

export async function getOpenedUrls(page: Page): Promise<string[]> {
  return page.evaluate(
    () => (window as unknown as { __openedUrls: string[] }).__openedUrls ?? [],
  );
}

/** Where each opened tab ended up (after any `tab.location.href = …`). */
export async function getOpenedTabLocations(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __openedTabs: { location: { href: string } }[] })
      .__openedTabs ?? []).map((t) => t.location.href),
  );
}

/** True on projects whose viewport hides the desktop header address (<640px). */
export function isNarrow(page: Page) {
  return page.viewportSize()!.width < 640;
}

// The salon's identity in each maps provider — what every "Open in …"
// button must point at, whichever of the 4 picker instances it lives in.
export const MAPS_PLACE = {
  'Google Maps': {
    host: 'www.google.com',
    marker: '0x89b64b00159324fd:0x8b1970ecf4fc771f',
  },
  'Apple Maps': { host: 'maps.apple.com', marker: 'place-id=I90D4B8468B267FB6' },
  Waze: { host: 'www.waze.com', marker: 'to=place.ChIJ_SSTFQBLtokRH3f89OxwGYs' },
} as const;

// External destinations, pinned on purpose: an accidental edit to any of
// these links in the components must fail a test.
export const LINKS = {
  freshaVenueBooking:
    'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-gt6tu55b',
  freshaReviews:
    'https://www.fresha.com/a/be-you-beauty-hub-arlington-3865-wilson-boulevard-sochrclt?pId=2531140&reviews=true',
  instagramFooter: 'https://www.instagram.com/beyou_beautyhub',
  instagramAbout: 'https://www.instagram.com/beyou_beautyhub/#',
  facebook: 'https://www.facebook.com/share/15Py4Ci4CV',
} as const;

/** Instantly scroll the window and give the header's rAF-throttled scroll handler a beat. */
export async function scrollWindowTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(100);
}
