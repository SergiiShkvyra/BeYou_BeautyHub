import { test, expect, Page } from './fixtures';
import { gotoHome, isNarrow } from './helpers';

// Gallery: a spinning 3D carousel (RoundCarousel) whose front card opens a
// full-screen zoomed ring (GalleryZoom). The zoom is a role=dialog with a
// "N / 8" counter, so position is asserted through that counter.

const IMAGE_COUNT = 8;

const opener = (page: Page) =>
  page.locator('#gallery').getByRole('button', { name: 'Open the gallery image in full screen' });
const zoom = (page: Page) => page.getByRole('dialog', { name: 'Gallery, zoomed in' });
const counter = (page: Page) => zoom(page).getByText(new RegExp(`^\\d+ / ${IMAGE_COUNT}$`));

async function readIndex(page: Page): Promise<number> {
  const text = (await counter(page).textContent()) ?? '';
  return Number(text.split('/')[0].trim());
}

/** Open via keyboard — deterministic regardless of where the ring has spun to. */
async function openZoom(page: Page) {
  await gotoHome(page);
  await opener(page).scrollIntoViewIfNeeded();
  await opener(page).focus();
  await page.keyboard.press('Enter');
  await expect(zoom(page)).toBeVisible();
  await expect(counter(page)).toBeVisible();
}

/** Expected 1-based index after stepping `by` from `from`, wrapping around. */
const wrap = (from: number, by: number) =>
  ((from - 1 + by + IMAGE_COUNT) % IMAGE_COUNT) + 1;

test.describe('gallery carousel + zoom', { tag: '@extended' }, () => {
  test('carousel shows every photo', async ({ page }) => {
    await gotoHome(page);
    // Each photo is rendered on the ring (front + dimmed back face).
    const srcs = await page
      .locator('#gallery img')
      .evaluateAll((imgs) => [...new Set(imgs.map((i) => (i as HTMLImageElement).src))]);
    expect(srcs).toHaveLength(IMAGE_COUNT);
  });

  test('clicking the front card opens the zoom with a described image', async ({ page }) => {
    await gotoHome(page);
    await opener(page).scrollIntoViewIfNeeded();
    await opener(page).click();
    await expect(zoom(page)).toBeVisible();
    await expect(counter(page)).toBeVisible();
    // The front picture carries real alt text; the rest are decorative.
    const alts = await zoom(page)
      .locator('img:not([aria-hidden="true"])')
      .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).alt));
    expect(alts).toHaveLength(1);
    expect(alts[0].length).toBeGreaterThan(0);
  });

  test('page scroll is locked while zoomed and restored after', async ({ page }) => {
    await openZoom(page);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(zoom(page)).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  });

  test('arrow keys step through the pictures and wrap around', async ({ page }) => {
    await openZoom(page);
    const start = await readIndex(page);

    await page.keyboard.press('ArrowRight');
    await expect(counter(page)).toHaveText(`${wrap(start, 1)} / ${IMAGE_COUNT}`);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(counter(page)).toHaveText(`${wrap(start, -1)} / ${IMAGE_COUNT}`);

    // A full lap lands back where it started.
    for (let i = 0; i < IMAGE_COUNT; i++) await page.keyboard.press('ArrowRight');
    await expect(counter(page)).toHaveText(`${wrap(start, -1)} / ${IMAGE_COUNT}`);
  });

  test('Next / Previous buttons step through the pictures (wide screens)', async ({ page }) => {
    await openZoom(page);
    const landscapePhone = page.viewportSize()!.height <= 500;
    test.skip(isNarrow(page) || landscapePhone, 'arrows are hidden on phones by design');

    const start = await readIndex(page);
    await zoom(page).getByRole('button', { name: 'Next image' }).click();
    await expect(counter(page)).toHaveText(`${wrap(start, 1)} / ${IMAGE_COUNT}`);
    await zoom(page).getByRole('button', { name: 'Previous image' }).click();
    await expect(counter(page)).toHaveText(`${start} / ${IMAGE_COUNT}`);
  });

  test('arrow buttons are hidden on phones', async ({ page }) => {
    await openZoom(page);
    const landscapePhone = page.viewportSize()!.height <= 500;
    test.skip(!isNarrow(page) && !landscapePhone, 'only phones hide the arrows');
    await expect(zoom(page).getByRole('button', { name: 'Next image' })).toHaveCount(0);
    await expect(zoom(page).getByRole('button', { name: 'Previous image' })).toHaveCount(0);
  });

  test('X button closes the zoom', async ({ page }) => {
    await openZoom(page);
    await zoom(page).getByRole('button', { name: 'Close the zoomed gallery' }).click();
    await expect(zoom(page)).toHaveCount(0);
  });

  test('Escape closes the zoom', async ({ page }) => {
    await openZoom(page);
    await page.keyboard.press('Escape');
    await expect(zoom(page)).toHaveCount(0);
  });

  test('clicking empty space closes the zoom', async ({ page }) => {
    await openZoom(page);
    // Bottom-left corner: clear of the ring, the counter and the arrows.
    const viewport = page.viewportSize()!;
    await page.mouse.click(8, viewport.height - 8);
    await expect(zoom(page)).toHaveCount(0);
  });

  test('right-click / long-press save menu is blocked on photos', async ({ page }) => {
    await gotoHome(page);
    const fire = (sel: string) =>
      page.locator(sel).first().evaluate((el) => {
        const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
        return ev.defaultPrevented;
      });

    // Carousel: the real topmost element under the front card is the hit zone.
    await opener(page).scrollIntoViewIfNeeded();
    expect(
      await opener(page).evaluate((el) => {
        const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
        return ev.defaultPrevented;
      }),
      'carousel front card',
    ).toBe(true);

    // Zoomed view: the pictures themselves.
    await opener(page).focus();
    await page.keyboard.press('Enter');
    await expect(zoom(page)).toBeVisible();
    expect(await fire('[role="dialog"] img'), 'zoomed picture').toBe(true);
  });
});
