import { test, expect } from '../e2e/fixtures';
import { gotoHome, stubWindowOpen, getOpenedUrls, LINKS, MAPS_PLACE } from '../e2e/helpers';

// LIVE tests against the real third-party sites — verifies every outbound
// link (Fresha, Instagram, Facebook, Google/Apple Maps, Waze) still lands on
// a page that is recognizably BeYou's. The e2e suite proves WHICH address
// each button opens; this proves that address still works.
//
// NOT part of the normal suite (network-dependent). Run deliberately with:
//   npm run test:links
// Read-only: just loads public pages.

test.describe('outbound links still land on BeYou pages (LIVE)', () => {
  test.setTimeout(90_000);

  const PAGES = [
    // Old Vienna-address slug — Fresha currently redirects it to the
    // Arlington venue; this fails if that redirect ever goes away.
    { name: 'Fresha booking (Hero / Contact)', url: LINKS.freshaVenueBooking, title: /Be You Beauty Hub/i },
    { name: 'Fresha reviews (Testimonials)', url: LINKS.freshaReviews, title: /Be You Beauty Hub/i },
    { name: 'Instagram (Footer)', url: LINKS.instagramFooter, title: /beyou_beautyhub/i },
    { name: 'Instagram (About)', url: LINKS.instagramAbout, title: /beyou_beautyhub/i },
    { name: 'Facebook (Footer)', url: LINKS.facebook, title: /BeYou ?BeautyHub/i },
  ];

  for (const { name, url, title } of PAGES) {
    test(name, async ({ page }) => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), 'HTTP status').toBeLessThan(400);
      await expect(page).toHaveTitle(title, { timeout: 30_000 });
    });
  }

  // Maps: harvest the URLs the site ACTUALLY opens from each picker (they
  // differ slightly per instance), then load each one for real.
  test('every maps link from every picker opens the salon', async ({ page, browser }) => {
    test.setTimeout(240_000);
    await stubWindowOpen(page);
    await gotoHome(page);
    const pickers = [
      page.locator('header').getByRole('button', { name: /Salons by JC/ }),
      page.locator('#contact').getByRole('button', { name: /Salons by JC/ }),
      page.locator('footer').getByRole('button', { name: /Salons by JC/ }),
    ];
    for (const opener of pickers) {
      for (const app of Object.keys(MAPS_PLACE)) {
        await opener.dispatchEvent('click');
        await page.locator('[data-navigation-modal]')
          .getByRole('button', { name: `Open in ${app}` })
          .click();
      }
    }
    const urls = [...new Set(await getOpenedUrls(page))];
    expect(urls.length).toBeGreaterThanOrEqual(3);

    const TITLES: Record<string, RegExp> = {
      'www.google.com': /BeYou Beauty Hub/i,
      'maps.apple.com': /BeYou ?BeautyHub/i,
      'www.waze.com': /BeYou Beauty Hub/i,
    };
    const live = await browser.newPage();
    for (const url of urls) {
      const host = new URL(url).host;
      const response = await live.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${host} HTTP status`).toBeLessThan(400);
      await expect(live, url).toHaveTitle(TITLES[host], { timeout: 30_000 });
    }
    await live.close();
  });
});
