import { defineConfig, devices } from '@playwright/test';

/**
 * QA automation config for BeYou BeautyHub.
 *
 * - Tests run against the PRODUCTION build (vite build + vite preview), not the
 *   dev server, so what's tested is what GitHub Pages actually serves.
 * - Playwright launches its own downloaded browser binaries in fresh, isolated
 *   contexts (incognito-equivalent): no cookies, history, extensions, or any
 *   connection to the browsers installed on this machine.
 * - Everything is local-only: no CI, no cloud services, no cost.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  // Everything a run produces lives under ONE gitignored folder:
  //   test-results/artifacts/ — traces, failure screenshots, error contexts
  //                             (cleared automatically at the start of each run)
  //   test-results/report/    — the HTML report (overwritten each run)
  // The report must be a SIBLING of outputDir, not inside it — Playwright
  // clears outputDir on run start and rejects a report folder that clashes.
  outputDir: './test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './test-results/report' }],
  ],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Slow every browser action down for human-watchable headed runs:
    //   $env:SLOWMO = "500"; npx playwright test ... --headed
    // (value = pause in ms between actions; unset = full speed)
    launchOptions: {
      slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
    },
  },
  snapshotPathTemplate:
    '{testDir}/visual/__screenshots__/{projectName}/{arg}{ext}',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
      testIgnore: [/visual/, /live/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: [/visual/, /a11y/, /live/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [/visual/, /a11y/, /live/],
    },
    {
      name: 'mobile-portrait',
      use: { ...devices['Pixel 7'] },
      testIgnore: [/visual/, /a11y/, /live/],
    },
    // Phone-landscape is a dedicated project because the header has special
    // collapse behavior under (max-height: 500px) and (orientation: landscape).
    {
      name: 'mobile-landscape',
      use: { ...devices['Pixel 7 landscape'] },
      testIgnore: [/visual/, /a11y/, /live/],
    },
    // Opt-in only (npm run test:links): hits the real Fresha site to verify
    // the booking deep links still preselect the right service. The project
    // only exists when LIVE_LINKS is set, so default runs never touch it.
    ...(process.env.LIVE_LINKS
      ? [
          {
            name: 'live-links',
            use: { ...devices['Desktop Chrome'] },
            testMatch: /live/,
            retries: 1,
          },
        ]
      : []),
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual/,
    },
    {
      name: 'visual-mobile',
      use: { ...devices['Pixel 7'] },
      testMatch: /visual/,
    },
  ],

  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
