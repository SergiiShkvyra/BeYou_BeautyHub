# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
## Self-update protocol

Before finishing any task, review what happened in this session. If I corrected you, or if hit a bug because of a wrong assumption, append a new rule to the "## Learned Rules" section at the bottom of this file. Each rule should be one sentence, written in the same tone as the existing rule. Do this without me asking - every session, every time.

---

## Project overview

BeYou BeautyHub is a static marketing/booking site for a lash & brow beauty studio, built with Vite + React + TypeScript + Tailwind CSS. It is a single-page site (no router) that auto-deploys to GitHub Pages at www.beyoubeautyhub.com (see `CNAME`).

## Commands

- `npm run dev` — start the Vite dev server (port 5173, fixed via `vite.config.ts`)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint (flat config in `eslint.config.js`, TypeScript + react-hooks + react-refresh rules)

There is no test runner configured in this repo (no test script, no test files).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. There is no staging environment — merging to `main` ships to production.

## Architecture

- `src/App.tsx` composes the entire page as a fixed sequence of section components, each an `id`-anchored `<section>` for anchor-link navigation: `Header → Hero → Services → About → Gallery → Testimonials → Contact → Footer`. There is no router and no shared state/context — each component in `src/components/` is self-contained with its own local state.
- `src/components/Header.tsx` is fixed-position and computes its own height in `App.tsx` (via `useEffect` + `document.body.style.paddingTop`) so content isn't hidden underneath it. It contains an aggressive `setInterval`/event-listener-based "force visibility" workaround to fight mobile browser rendering quirks — this is intentional, not dead code, even though it looks unusual.
- Navigation between sections uses `element.scrollIntoView()` by DOM id (e.g. `scrollToSection('services')`), not React Router.
- `src/utils/interactions.ts` centralizes `scrollToSection`, `handlePhoneClick`, and `copyEmailToClipboard` — call these instead of re-inlining them; they were previously copy-pasted verbatim across Header/Contact/Footer/Hero.
- The location/navigation-app picker modal (Google/Apple/Waze) is still duplicated separately in `Header.tsx` (desktop + mobile), `Contact.tsx`, and `Footer.tsx` via raw `document.createElement`/`innerHTML` — deliberately NOT deduped, because each instance already renders with different padding/gap/hover colors, so unifying them would change the UI. Match the established raw-DOM pattern if you touch one, but don't merge them.
- `Contact.tsx` submits the booking form client-side via EmailJS (`@emailjs/browser`), with service/template/public keys inlined directly in the component.
- `supabase/functions/send-contact-email/index.ts` is a Deno-based Supabase Edge Function that sends contact-form emails via the Resend API. It currently appears unused by the frontend (which calls EmailJS directly) — check before assuming it's live.
- Static assets (gallery photos, testimonial headshots, logo) live under `public/images/...` and are referenced by absolute path (e.g. `/images/gallery/...`).
- Brand colors (`olive` #505e47, `warm` #dbd6b2) and the `flash` keyframe animation are defined as Tailwind theme extensions in `tailwind.config.js` — use these tokens (`text-olive`, `bg-warm`, etc.) rather than hardcoding hex values in new styles.
- `tailwind.config.js` sets `important: true` globally, so Tailwind utility classes always win over inline/other CSS specificity — keep this in mind when debugging styling conflicts.
- `index.css`'s "ULTIMATE NUCLEAR OPTION" header-visibility rule block matches `header` unconditionally (first selector), so every other selector in that list is redundant for styling the header itself — do NOT add bare class selectors there (e.g. a plain `.bg-warm`) to "also match the header," because it will silently hijack (`position: fixed; width: 100vw; z-index: 2147483647`) any *other* element anywhere in the app that reuses that same Tailwind utility class.
- `src/components/Header.tsx`'s nav bar (Home/Services/About/Gallery/Contact) collapses independently of the top contact-bar/logo row on scroll: it lives in its own wrapper outside the collapsible container so it stays pinned at the top once the section above hides. The collapse/expand is driven by `isTopSectionCollapsed` state (scroll-direction threshold in the scroll handler) animating `max-height`/`opacity`, not `transform` — this project's CSS doesn't currently block `transform`, but height/opacity was chosen to be robust either way.
- `html, body` in `index.css` use `min-height: 100%` (not `height: 100%`) — this is required for `window.scrollY`/`scroll` events to fire at all; with a hard `height: 100%`, `body` becomes its own internally-scrolling box and the window never reports scroll position, silently breaking any feature (existing or new) that depends on scroll position/direction.

## Learned Rules

- Before running any local command (`npm run build`/`lint`/`dev`) during a cleanup task, state up front that it's local-only and doesn't push/deploy — this user tracks GitHub Pages auto-deploy-on-push-to-main closely and will stop you to check.
- When flagging a bug found in unfamiliar code, trace the actual async control flow (setTimeout callbacks, event listeners registered inside a try/catch) before describing its effect — an initial read can look like it breaks a visible feature when it actually just leaks a listener/logs a console error, and getting this wrong requires a correction.
- When two code blocks look like copy-pasted duplicates, diff them byte-for-byte before merging — this codebase's four "identical-looking" navigation-modal blocks actually differ in padding/gap/colors, so a blind merge would have changed the UI despite the surface-level similarity.
- When a Tailwind-styled element's `getBoundingClientRect()` reports an impossible size (e.g. every sibling reporting the exact same full-viewport width/position), suspect a bare class selector elsewhere in the CSS hijacking that class name — bisect by testing the element's className in isolated increments (strip to bare minimum, add classes back one group at a time) rather than guessing from the Tailwind classes alone; that's what surfaced the `.bg-warm` nuclear-selector collision in this codebase.
- Don't assume a plain-language color name like `bg-warm`/`bg-olive` is safe to reuse on a new element just because it's a normal Tailwind utility — in this specific codebase, grep `index.css` for that literal class string first, since at least one existing rule targets it as a bare selector for unrelated (header-specific) reasons.
- When asserting scroll positions in tests, remember `index.css` sets `scroll-padding-top: 180px !important`, so `scrollIntoView` deliberately rests every section 180px below the viewport top — a "section top ≈ 0" assertion will always fail.
- The header's force-visible code pins the header at z-index 2147483647, ABOVE the navigation modals (z-index 99999) — clicks near the top of the viewport hit the header even when a "full-screen" overlay is open, so in tests click overlays near the bottom of the viewport.
- The header top-bar collapse animates `max-height`/`opacity` with `overflow: hidden`, so Playwright still reports the clipped children as visible — assert the collapsible wrapper's bounding-box height, not child-element visibility.
- The header's mobile location button reads "Arlington, VA" on screen but its `aria-label` ("Open BeYou BeautyHub location…") overrides that as the accessible name — locate it by aria-label, not visible text.
- There is now a local-only QA framework (Playwright E2E/visual/a11y + Vitest unit; see `tests/README.md` and the `test:*` npm scripts); it never pushes or deploys, EmailJS is network-intercepted so tests never send real emails, and visual baselines in `tests/visual/__screenshots__/` are machine-specific.
