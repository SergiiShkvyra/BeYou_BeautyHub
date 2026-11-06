import { test, expect } from './fixtures';
import { gotoHome, SECTION_IDS } from './helpers';

test.describe('smoke', { tag: '@smoke' }, () => {
  test('page loads with the expected title', async ({ page }) => {
    await gotoHome(page);
    await expect(page).toHaveTitle(/BeYou Beauty Hub/i);
  });

  test('the single <h1> names the services and location (SEO)', async ({ page }) => {
    await gotoHome(page);
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(/Lash & Brow Studio.*Ballston, Arlington, VA/);
  });

  test('structured-data services match the visible Services section (SEO)', async ({ page }) => {
    // Google requires JSON-LD to describe visible content: every service and
    // "From $" price in index.html's hasOfferCatalog must be shown as text.
    await gotoHome(page);
    const offers = await page.evaluate(() => {
      const raw = document.querySelector('script[type="application/ld+json"]')!.textContent!;
      const data = JSON.parse(raw);
      return data.hasOfferCatalog.itemListElement.map(
        (o: { itemOffered: { name: string }; priceSpecification: { minPrice: number } }) => ({
          name: o.itemOffered.name,
          price: o.priceSpecification.minPrice,
        }),
      );
    });
    expect(offers.length).toBeGreaterThan(0);
    const services = page.locator('#services');
    for (const { name, price } of offers) {
      const card = services.locator('div').filter({ hasText: name }).filter({ hasText: `From $${price}` });
      await expect(card.first(), `${name} — From $${price}`).toBeAttached();
    }
  });

  test('all anchor sections and the footer are present', async ({ page }) => {
    await gotoHome(page);
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`), `section #${id}`).toBeVisible();
    }
    await expect(page.locator('footer')).toBeVisible();
  });

  test('header is visible on load and stays fixed after scrolling to the bottom', async ({
    page,
  }) => {
    await gotoHome(page);
    const header = page.locator('header');
    await expect(header).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box, 'header bounding box').not.toBeNull();
    expect(box!.y, 'header pinned to top of viewport').toBe(0);
  });

  test('no console errors or page crashes on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

    await gotoHome(page);
    await page.waitForLoadState('networkidle');

    // Ignore noise that is not a product defect (e.g. favicon fetch hiccups).
    const relevant = errors.filter((e) => !/favicon/i.test(e));
    expect(relevant, `console errors:\n${relevant.join('\n')}`).toEqual([]);
  });
});
