import { test, expect } from '../e2e/fixtures';
import AxeBuilder from '@axe-core/playwright';
import { gotoHome } from '../e2e/helpers';

// Accessibility scan (WCAG 2.0/2.1 A + AA) via axe-core.
// Policy: CRITICAL violations fail the suite; serious/moderate/minor are
// attached to the HTML report as a findings list to fix over time.

test.describe('accessibility (axe-core)', () => {
  test('page has no critical WCAG A/AA violations', async ({ page }, testInfo) => {
    await gotoHome(page);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Full findings go to the report for triage.
    await testInfo.attach('axe-violations.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const summary = results.violations.map(
      (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`,
    );
    if (summary.length) console.log('axe findings:\n' + summary.join('\n'));

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(
      critical.map((v) => `${v.id}: ${v.help}`),
      'critical accessibility violations',
    ).toEqual([]);
  });
});
