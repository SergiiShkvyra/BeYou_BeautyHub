import { test, expect, Page } from './fixtures';
import { gotoHome } from './helpers';

// Animations, intro, cursors and the marquee strip.
//
// The rest of the suite runs with reducedMotion: 'reduce' (playwright.config)
// precisely so these effects stay out of the way; the "full motion" block
// below switches them back ON to test the effects themselves.

const isMobile = (name: string) => name.startsWith('mobile');
const introOverlay = (page: Page) => page.locator('.intro-overlay');

/** Click through the first-visit intro (1st click starts it, 2nd skips it). */
async function skipIntro(page: Page) {
  await expect(introOverlay(page)).toBeVisible();
  const { width, height } = page.viewportSize()!;
  // The skip listener only exists once the phrase animation has mounted, a
  // beat after the starting click — so keep clicking until it takes.
  await expect(async () => {
    await page.mouse.click(width / 2, height / 2);
    await expect(introOverlay(page)).toHaveCount(0, { timeout: 4_000 });
  }).toPass({ timeout: 20_000 });
}

test.describe('marquee strip', { tag: '@extended' }, () => {
  test('lists exactly the Services card titles', async ({ page }) => {
    await gotoHome(page);
    // Strip = the decorative band right after the hero; its first copy
    // holds one span per service (the ✦ separator is a nested span).
    const items = await page
      .locator('.animate-marquee > div')
      .first()
      .locator(':scope > span')
      .evaluateAll((spans) => spans.map((s) => s.firstChild?.textContent?.trim() ?? ''));

    const cardTitles = await page
      .locator('#services article h3')
      .allTextContents();
    const serviceTitles = cardTitles.map((t) => t.trim()).filter((t) => t !== 'And Many More...');

    expect(items, 'marquee names must match the Services cards (rename both!)').toEqual(
      serviceTitles,
    );
  });

  test('is hidden from screen readers and holds still under reduced motion', async ({
    page,
  }) => {
    await gotoHome(page);
    const track = page.locator('.animate-marquee');
    await expect(track.locator('xpath=..')).toHaveAttribute('aria-hidden', 'true');
    expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  });
});

test.describe('reduced motion', { tag: '@extended' }, () => {
  test('no intro overlay — the page is usable immediately', async ({ page }) => {
    await gotoHome(page);
    await expect(introOverlay(page)).toHaveCount(0);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/intro-lock/);
  });
});

test.describe('full motion', { tag: '@extended' }, () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('intro plays on its own, then reveals the page', async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto('/');
    await expect(introOverlay(page)).toBeVisible();
    // While it plays: header hidden, page scroll locked.
    await expect(page.locator('html')).toHaveClass(/intro-lock/);
    await expect(page.locator('header')).toBeHidden();

    // ~9s unskipped — give it plenty of room.
    await expect(introOverlay(page)).toHaveCount(0, { timeout: 25_000 });
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/intro-lock/);
    expect(await page.evaluate(() => window.scrollY), 'reveals the top of the page').toBe(0);
  });

  test('clicking skips the intro', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#home').getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('hero: Book Appointment starts glowing and the stats count up', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    await expect(
      page.locator('#home [data-book-btn]'),
      'glow sweep is added once the button has faded in',
    ).toHaveClass(/glow-sweep/, { timeout: 10_000 });

    // Landscape phones count only when the stats row scrolls into view.
    await page.locator('[data-hero-stats]').scrollIntoViewIfNeeded();
    const counters = page.locator('#home [data-count-to]');
    const targets = await counters.evaluateAll((els) =>
      els.map((e) => (e as HTMLElement).dataset.countTo),
    );
    expect(targets.length).toBeGreaterThan(0);
    for (let i = 0; i < targets.length; i++) {
      await expect(counters.nth(i)).toHaveText(targets[i]!, { timeout: 10_000 });
    }
  });

  test('footer heart bursts into floating hearts that clean themselves up', async ({
    page,
  }) => {
    await page.goto('/');
    await skipIntro(page);
    const heart = page.getByRole('button', { name: 'Made with love — a little surprise' });
    await heart.scrollIntoViewIfNeeded();
    await heart.click();

    const floating = page.locator('body > span[aria-hidden="true"]', { hasText: '♥' });
    await expect.poll(() => floating.count(), { message: 'hearts appear' }).toBeGreaterThan(0);
    await expect(floating, 'hearts remove themselves').toHaveCount(0, { timeout: 5_000 });
  });

  test('footer logo spins when clicked', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);
    // Two copies (desktop column / mobile), only one shown per breakpoint.
    // Both are loading="lazy" (zero-size until near the viewport), so bring
    // the footer into view before asking which one is visible.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const logo = page.locator('footer [data-footer-logo]').locator('visible=true').first();
    await expect(logo).toBeVisible();
    await logo.scrollIntoViewIfNeeded();
    // Let the first-view spin finish so the click is what's being tested.
    await expect
      .poll(() => logo.evaluate((el) => el.style.transform), { timeout: 8_000 })
      .toBe('');
    await logo.click();
    await expect
      .poll(() => logo.evaluate((el) => el.style.transform), {
        message: 'a rotation is applied while spinning',
      })
      .toContain('rotate');
  });

  test('marquee strip scrolls', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);
    const track = page.locator('.animate-marquee');
    expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('marquee');
    const x = () =>
      track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    const before = await x();
    await page.waitForTimeout(500);
    expect(await x(), 'track has moved left').toBeLessThan(before);
  });
});

test.describe('cursors', { tag: '@extended' }, () => {
  const sparkle = (page: Page) => page.locator('svg.lucide-sparkle').locator('..');
  const opacity = (page: Page) => sparkle(page).evaluate((el) => el.style.opacity);

  test('mouse: sparkle over plain content, native cursor over buttons', async ({
    page,
  }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), 'mouse-only feature');
    await gotoHome(page);
    await expect(page.locator('html')).toHaveClass(/no-native-cursor/);

    const text = page.locator('#home p').first();
    const tb = (await text.boundingBox())!;
    await page.mouse.move(tb.x + 10, tb.y + tb.height / 2);
    await page.mouse.move(tb.x + 20, tb.y + tb.height / 2);
    await expect.poll(() => opacity(page), { message: 'sparkle over text' }).toBe('1');

    const button = page.locator('#home').getByRole('button', { name: 'Book Appointment' });
    const bb = (await button.boundingBox())!;
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await expect.poll(() => opacity(page), { message: 'sparkle hides over a button' }).toBe('0');
  });

  test('mouse: glitter trail canvas wakes up on movement', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), 'mouse-only feature');
    await gotoHome(page);
    const canvas = page.locator('.pointer-events-none.fixed.inset-0 canvas');
    await expect(canvas).toHaveCount(1);
    await page.mouse.move(200, 300);
    await page.mouse.move(260, 340);
    await expect
      .poll(() => canvas.evaluate((el) => (el as HTMLElement).style.opacity))
      .toBe('1');
  });

  test('touch: no custom cursor at all', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), 'touch-only check');
    await gotoHome(page);
    await expect(page.locator('html')).not.toHaveClass(/no-native-cursor/);
    await page.locator('#home p').first().tap();
    expect(await opacity(page)).toBe('0');
  });
});
