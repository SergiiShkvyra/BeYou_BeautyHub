import { test, expect, Page, Locator } from './fixtures';
import {
  gotoHome,
  stubWindowOpen,
  getOpenedUrls,
  getOpenedTabLocations,
  isNarrow,
  MAPS_PLACE,
  LINKS,
} from './helpers';

// Every button/link that leaves the site, checked for WHERE it goes. External
// sites are never actually loaded here (window.open is stubbed, popups are
// aborted) — tests/live/ covers "does the destination still exist".

const modal = (page: Page) => page.locator('[data-navigation-modal]');

// The 4 separate navigation-picker instances (see CLAUDE.md — deliberately
// not deduped), each with its own opener button.
const PICKERS: {
  name: string;
  opener: (page: Page) => Locator;
  skip?: (page: Page) => string | false;
}[] = [
  {
    name: 'Header (desktop)',
    opener: (page) => page.locator('header').getByRole('button', { name: /Salons by JC/ }),
    skip: (page) => isNarrow(page) && 'desktop header address is hidden below 640px',
  },
  {
    name: 'Header (mobile)',
    opener: (page) =>
      page.locator('header').getByRole('button', { name: /Open BeYou BeautyHub location/ }),
    skip: (page) => !isNarrow(page) && 'mobile header location button only renders below 640px',
  },
  {
    name: 'Contact',
    opener: (page) => page.locator('#contact').getByRole('button', { name: /Salons by JC/ }),
  },
  {
    name: 'Footer',
    opener: (page) => page.locator('footer').getByRole('button', { name: /Salons by JC/ }),
  },
];

test.describe('navigation apps — every picker opens the salon in every app', { tag: '@critical' }, () => {
  for (const picker of PICKERS) {
    for (const [app, place] of Object.entries(MAPS_PLACE)) {
      test(`${picker.name} → ${app}`, async ({ page }) => {
        await stubWindowOpen(page);
        await gotoHome(page);
        const reason = picker.skip?.(page);
        test.skip(!!reason, reason || '');

        // dispatchEvent, not click(): the fixed header's collapse/force-visible
        // loop fights Playwright's actionability retries on these buttons.
        await picker.opener(page).dispatchEvent('click');
        await expect(modal(page)).toBeVisible();
        await modal(page).getByRole('button', { name: `Open in ${app}` }).click();

        const urls = await getOpenedUrls(page);
        expect(urls, 'exactly one tab opened').toHaveLength(1);
        const url = new URL(urls[0]);
        expect(url.protocol).toBe('https:');
        expect(url.host).toBe(place.host);
        expect(decodeURIComponent(urls[0])).toContain(decodeURIComponent(place.marker));
        await expect(modal(page), 'picker closes after choosing').toHaveCount(0);
      });
    }
  }
});

test.describe('booking links (Fresha)', { tag: '@critical' }, () => {
  test('Hero "Book Appointment" opens the Fresha booking page', async ({ page }) => {
    await stubWindowOpen(page);
    await gotoHome(page);
    await page.locator('#home').getByRole('button', { name: 'Book Appointment' }).click();
    expect(await getOpenedUrls(page)).toEqual([LINKS.freshaVenueBooking]);
  });

  test('Contact "Book Online" opens the Fresha booking page', async ({ page }) => {
    await stubWindowOpen(page);
    await gotoHome(page);
    await page.locator('#contact').getByRole('button', { name: /book online/i }).click();
    expect(await getOpenedUrls(page)).toEqual([LINKS.freshaVenueBooking]);
  });

  test('Testimonials "…and counting" opens Fresha reviews in a new tab', async ({ page }) => {
    await stubWindowOpen(page);
    await gotoHome(page);
    const link = page.getByRole('link', { name: 'Read all our reviews on Fresha' });
    // The real href is kept for no-JS / middle-click / copy-link.
    await expect(link).toHaveAttribute('href', LINKS.freshaReviews);
    await link.click();

    // Opens a blank tab and THEN points it at Fresha (so phones stay in the
    // browser instead of the Fresha app) — the page itself must not navigate.
    expect(await getOpenedTabLocations(page)).toEqual([LINKS.freshaReviews]);
    expect(page.url()).not.toContain('fresha.com');
  });
});

test.describe('social links', { tag: '@critical' }, () => {
  const FOOTER_SOCIAL = [
    { name: 'Instagram', url: LINKS.instagramFooter },
    { name: 'Facebook', url: LINKS.facebook },
  ];

  for (const { name, url } of FOOTER_SOCIAL) {
    test(`Footer ${name} icon opens ${name} in a new tab`, async ({ page, context }) => {
      await gotoHome(page);
      const link = page.locator(`footer a[href="${url}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);

      // Really click it: a new tab must open at exactly that address. The
      // site is answered with a blank stand-in page (aborting would leave the
      // tab on an error URL) — the live suite checks the real page.
      await context.route(/instagram\.com|facebook\.com/, (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '<p>stub</p>' }),
      );
      const popupPromise = context.waitForEvent('page');
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe(url);
      await popup.close();
    });
  }

  test('About "Learn More About Us" opens Instagram', async ({ page }) => {
    await stubWindowOpen(page);
    await gotoHome(page);
    await page.locator('#about').getByRole('button', { name: 'Learn More About Us' }).click();
    expect(await getOpenedUrls(page)).toEqual([LINKS.instagramAbout]);
  });
});
