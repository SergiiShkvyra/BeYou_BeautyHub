# QA Automation — BeYou BeautyHub

Local-only, zero-cost test framework. Nothing here touches GitHub, CI, or the
live site; runs never send real emails (EmailJS is intercepted) and browsers
run as Playwright's own isolated binaries — incognito-equivalent, fully
separate from the browsers installed on this machine.

//TODO: made sure that testing framework is alligned with the website redesign

## Commands

| Command | What it does |
|---|---|
| `npm test` | Unit tests, then the full E2E/visual/a11y suite |
| `npm run test:unit` | Vitest unit tests (`src/**/*.test.ts`) |
| `npm run test:e2e` | Full Playwright suite: builds the site, serves it via `vite preview`, runs all browser projects |
| `npm run test:e2e:ui` | Playwright's interactive UI mode — best for debugging |
| `npm run test:visual:update` | Regenerate visual baselines after an INTENTIONAL design change |
| `npm run test:links` | LIVE check against the real Fresha site: each booking deep link still preselects the right service (opt-in, needs internet; never runs as part of the normal suite) |
| `npm run test:traced` | Full suite with a trace recorded for EVERY test (normally only failures get one) — see "Step-by-step screenshots" below |
| `npm run test:report` | Open the HTML report of the last run |

Run a subset:

```
npx playwright test tests/e2e/booking-form.spec.ts   # one file
npx playwright test --project=chromium               # one browser
npx playwright test -g "collapse"                    # by title
```

## Watching a test run in a visible browser

By default tests run headless (no window). To watch one test with your own eyes:

```powershell
$env:SLOWMO = "500"; npx playwright test -g "happy path" --project=chromium --headed --workers=1
```

| Piece | What it does | Without it |
|---|---|---|
| `--headed` | Shows the browser window | Browser runs invisibly |
| `$env:SLOWMO = "500"` | Pauses 500 ms between actions (wired up in `playwright.config.ts`) | Actions run at machine speed, too fast to follow |
| `-g "..."` | Picks tests whose title contains the text | Runs every test in scope |
| `--workers=1` | One test at a time | Several browser windows at once |

Tune `SLOWMO` to taste: `300` is brisk, `1000` is presentation-speed. The env
var only lasts for the current terminal; reset early with `$env:SLOWMO = ""`.
The browser closes instantly when the test finishes — the verdict is printed
in the terminal.

To make each test **pause right before its browser closes** — so you can
inspect the final state as long as you want — add `PAUSE`:

```powershell
$env:PAUSE = "1"; $env:SLOWMO = "500"; npx playwright test -g "preselected" --project=chromium --headed --workers=1
```

Each test freezes at its end with the browser open and pops up the Playwright
Inspector; click **Resume ▶** (or press F8) in the Inspector to let that test
finish and the next one start. Test timeouts are disabled while paused, so take
your time. Reset with `$env:PAUSE = ""` when done. (Harmless if left set for
headless runs — the pause is a no-op without a visible browser.)

To step through a test action-by-action instead (pause/resume with the
Playwright Inspector):

```powershell
$env:PWDEBUG = "1"; npx playwright test -g "happy path" --project=chromium --headed
```

Reset with `$env:PWDEBUG = ""` afterwards, or headless runs will keep opening
the Inspector.

## Browser projects

| Project | Simulates | Notes |
|---|---|---|
| `chromium` | Desktop Chrome | Also runs the a11y scan and clipboard-content checks |
| `firefox` | Desktop Firefox | |
| `webkit` | Desktop Safari | |
| `mobile-portrait` | Pixel 7 | Touch, mobile viewport |
| `mobile-landscape` | Pixel 7 landscape | Exercises the special landscape header-collapse rule |
| `visual` / `visual-mobile` | Chrome desktop / Pixel 7 | Screenshot comparison only |

## What's covered

**Unit** (Vitest) — `src/utils/interactions.test.ts`: scroll helper, phone click
(desktop copy / mobile dialer / failure fallback), email copy (success, failure,
old-browser fallback, toast auto-dismiss).

**E2E** (Playwright, `tests/e2e/`) — each spec runs across all 5 browser
projects:

- **smoke** — page loads, title, all sections + footer present, header stays fixed after scroll, no console errors
- **navigation** — every header/footer nav button scrolls to its section; header top-bar collapse on scroll down, re-expand on scroll up, and the phone-landscape-only "stay collapsed until the very top" rule
- **booking-form** — EmailJS mocked via network interception (no real emails): success + form clears, exact payload check (service/template IDs, template params), server failure keeps form data, required-field and email-format validation, error clears on typing
- **modals** — all three separately-implemented navigation-app pickers (Header desktop + mobile, Contact, Footer): 3 app options, Cancel, outside-click close, and that choosing an app "opens" the right URL (window.open is stubbed — no real tabs)
- **contact-interactions** — phone/email copy-to-clipboard with toast + clipboard-content check, "Text us" alert, "Book Online" opens the Fresha URL (request aborted, never actually hits Fresha)
- **services** — all 6 service cards render; each of the 5 specific cards opens its pinned Fresha deep link with the right `oiid=sv:<id>` preselection param, the catch-all card opens the venue page with no preselection, and no two cards share a URL (window.open stubbed — no real tabs)

**Live link checks** (`tests/live/`, opt-in via `npm run test:links`) — loads each
Fresha deep link on the REAL Fresha site and verifies the service actually lands
in the booking cart: the redirected URL carries `offerItems=sv:<id>`, the service
name is shown, and the cart UI (Total/Continue) renders. Read-only — never
completes a booking. Kept out of the normal suite because it depends on Fresha
being up and unchanged; run it after editing booking URLs or once in a while as
a health check.

**Visual regression** (`tests/visual/`) — baseline screenshots of the header
(expanded + collapsed), every section, and the footer, on desktop + mobile.
Guards against CSS rules silently restyling unrelated elements.

**Accessibility** (`tests/a11y/`) — axe-core WCAG A/AA scan; critical
violations fail the suite, everything else is attached to the HTML report for
triage.

## Step-by-step screenshots in the report (traces)

Playwright's equivalent of Allure's per-action screenshots is the **trace** —
and it goes further: a film strip of the whole test plus a live DOM snapshot
before/after every action, with per-step console and network output.

Failed tests always get a trace automatically. To record one for every test:

```
npm run test:traced          # whole suite
npx playwright test tests/e2e/booking-form.spec.ts --trace on   # one file
npm run test:report          # open the report...
```

...then click a test and click the **Trace** attachment at the bottom (or the
film-strip icon). Inside the trace viewer: the timeline film strip is at the
top, actions are listed on the left, and clicking any action shows the page
exactly as it was at that moment — the snapshot is a real DOM you can inspect,
not just an image.

Traces are the reason `--trace on` isn't the permanent default: they add a few
MB per test, which is noticeable across ~200 tests. Turn them on when you want
to study behavior; failures always have them regardless.

## Where test results live (and how to clean them)

Everything a run produces lives under ONE folder at the project root —
`test-results/` — which is gitignored, so none of it can end up on GitHub, and
nothing is ever written elsewhere on the machine:

| Folder | Contents | Lifecycle |
|---|---|---|
| `test-results/artifacts/` | Traces, failure screenshots, error contexts | Cleared automatically at the start of every run |
| `test-results/report/` | The HTML report | Overwritten by every run |

Safe to delete at any time (e.g. to reclaim disk after `--trace on` runs):

```powershell
Remove-Item -Recurse -Force test-results
```

Do NOT delete `tests/visual/__screenshots__/` — those are the visual-regression
baselines (test inputs, not results); deleting them means regenerating with
`npm run test:visual:update`.

## Animations and determinism

The whole suite runs with `reducedMotion: 'reduce'` (set in
`playwright.config.ts`). The site honors `prefers-reduced-motion` by skipping
all GSAP entrance/scroll animations, which makes tests deterministic: clicks
can't race a mid-reveal element move, and screenshots never catch a half-faded
state. Consequence: visual baselines show final resting states, and if you
watch a `--headed` run you won't see the fancy animations — view those in a
normal browser instead.

## Visual baselines

Baselines live in `tests/visual/__screenshots__/` and are generated on THIS
machine (font rendering is OS-specific, so don't compare baselines made on a
different OS). When a test fails on an intentional design change, review the
diff in the HTML report, then run `npm run test:visual:update`.
