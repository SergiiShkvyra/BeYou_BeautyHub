import { test, expect } from './fixtures';
import { gotoHome, stubWindowOpen, getOpenedUrls } from './helpers';

// Each service card deep-links to Fresha with an `oiid=sv:<id>` parameter that
// preselects that service in the booking cart; the catch-all card links to the
// venue page with no service id. The expected URLs are pinned here on purpose —
// an accidental edit to a booking link in Services.tsx must fail this test.

const FRESHA_BOOKING = 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services';

const SERVICE_CARDS = [
  { title: 'Signature Korean Lash lift', serviceId: '27974629' },
  { title: 'Brow Lamination + Tweezing', serviceId: '22827507' },
  { title: 'Mapping + tweezing', serviceId: '22827454' },
  { title: 'L&L Combo Deluxe', serviceId: '22827944' },
  { title: 'Lash Lift + Tinting', serviceId: '22827620' },
] as const;

const CATCH_ALL = {
  title: 'And Many More...',
  url: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?pId=2531140',
} as const;

test.describe('Services section — Fresha booking links', () => {
  test('renders all 6 service cards with a booking button each', async ({ page }) => {
    await gotoHome(page);
    const section = page.locator('#services');
    for (const { title } of [...SERVICE_CARDS, CATCH_ALL]) {
      await expect(
        section.getByRole('heading', { name: title, exact: true }),
      ).toBeVisible();
    }
    await expect(
      section.getByRole('button', { name: /book appointment/i }),
    ).toHaveCount(6);
  });

  for (const { title, serviceId } of SERVICE_CARDS) {
    test(`"${title}" books with service sv:${serviceId} preselected`, async ({
      page,
    }) => {
      await stubWindowOpen(page);
      await gotoHome(page);

      // Scope to the card: the article that contains this card's heading.
      const card = page
        .locator('#services article')
        .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
      await card.getByRole('button', { name: /book appointment/i }).click();

      const urls = await getOpenedUrls(page);
      expect(urls).toHaveLength(1);
      const url = new URL(urls[0]);
      expect(url.origin + url.pathname).toBe(FRESHA_BOOKING);
      // oiid=sv:<id> is Fresha's "preselect this service in the cart" param.
      expect(url.searchParams.get('oiid')).toBe(`sv:${serviceId}`);
      expect(url.searchParams.get('pId')).toBe('2531140');
    });
  }

  test(`"${CATCH_ALL.title}" opens the general venue page with no preselection`, async ({
    page,
  }) => {
    await stubWindowOpen(page);
    await gotoHome(page);

    const card = page
      .locator('#services article')
      .filter({
        has: page.getByRole('heading', { name: CATCH_ALL.title, exact: true }),
      });
    await card.getByRole('button', { name: /book appointment/i }).click();

    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(1);
    expect(urls[0]).toBe(CATCH_ALL.url);
    expect(urls[0]).not.toContain('oiid');
  });

  test('every card links to a distinct service', async ({ page }) => {
    await stubWindowOpen(page);
    await gotoHome(page);

    const buttons = page
      .locator('#services')
      .getByRole('button', { name: /book appointment/i });
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }

    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(6);
    expect(new Set(urls).size, 'no two cards may share a booking URL').toBe(6);
  });
});
