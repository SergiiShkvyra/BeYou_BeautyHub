import { test, expect } from '../e2e/fixtures';

// LIVE tests against the real Fresha site — verifies Fresha still honors our
// booking deep links by actually putting the right service in the cart.
//
// NOT part of the normal suite (network-dependent, tests a third-party site).
// Run deliberately with:  npm run test:links
// Read-only: loads booking pages, never completes a booking.

const SERVICES = [
  { title: 'Signature Korean Lash lift', id: '27974629' },
  { title: 'Brow Lamination + Tweezing', id: '22827507' },
  { title: 'Mapping + tweezing', id: '22827454' },
  { title: 'L&L Combo Deluxe', id: '22827944' },
  { title: 'Lash Lift + Tinting', id: '22827620' },
] as const;

const deepLink = (id: string) =>
  `https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A${id}&share=true&pId=2531140`;

const VENUE_URL =
  'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?pId=2531140';

test.describe('Fresha booking deep links (LIVE)', () => {
  // Third-party SPA over real network: give it room.
  test.setTimeout(90_000);

  for (const { title, id } of SERVICES) {
    test(`"${title}" lands in the Fresha cart preselected (sv:${id})`, async ({
      page,
    }) => {
      await page.goto(deepLink(id), { waitUntil: 'domcontentloaded' });

      // Fresha redirects to a cart URL carrying our service id in offerItems —
      // structural proof the service was accepted into the booking cart.
      await expect
        .poll(() => new URL(page.url()).searchParams.get('offerItems'), {
          message: 'Fresha should carry the service into the cart URL',
          timeout: 30_000,
        })
        .toBe(`sv:${id}`);

      // The cart page shows the selected service by name plus checkout UI.
      await expect(page.getByText(title).first()).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText(/^Total$/).first()).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.getByText('Continue').first()).toBeVisible({
        timeout: 15_000,
      });
    });
  }

  test('catch-all link opens the venue page with no preselection', async ({
    page,
  }) => {
    await page.goto(VENUE_URL, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/Be You Beauty Hub/i, { timeout: 30_000 });
    expect(new URL(page.url()).searchParams.get('offerItems')).toBeNull();
  });
});
