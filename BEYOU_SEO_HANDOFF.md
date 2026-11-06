# BeYou Beauty Hub: website and local-search handoff

Context: audit done in a claude.ai chat on 2026-11-05 (live site, Fresha/ClassPass listings, Instagram screenshots). Goal: make the site and online presence easier to find for "best eyelash/brow salon in Ballston/Arlington" searches, keeping the "natural results" positioning. Verify anything below against the live site and code before relying on it.

Last updated: 2026-11-05. Code items 1, 2, 3, 5, 7, 8, 11, 13 and 14 are done and deployed; item 12 is done but not yet deployed (see "Done" at the bottom). Item numbers are kept from the original list so they can still be referred to by number; the lists use bullets so those numbers display correctly.

## Business facts (keep identical everywhere)
- Name: **BeYou Beauty Hub** (exactly this; no "Be You", no "BeautyHub", no "Arlington" in the name)
- Address: Salons by JC – Ballston, 3865 Wilson Blvd, Suite 100, Room 4, Arlington, VA 22203. Confirmed by the owner on 2026-11-06; the site shows it on three lines: "Salons by JC – Ballston" / "3865 Wilson Blvd, Suite 100, Room 4" / "Arlington, VA 22203". Fresha says "Suite 4"; update it to match (see owner task 2).
- Phone: (571) 276-7014 | Email: info@beyoubeautyhub.com
- Hours: Mon-Fri 10:00-19:00, Sat 10:00-17:00
- Founder and artist: Anastasiia (now named on the website's About section)
- Experience: 4+ years (the site's figure, confirmed by the owner; the Instagram pin still says 3+ years)
- Free 15-minute consultation is offered on Fresha
- Links: Instagram https://www.instagram.com/beyou_beautyhub | Facebook https://www.facebook.com/share/15Py4Ci4CV | Fresha https://www.fresha.com/a/beyou-beauty-hub-arlington-arlington-3865-wilson-boulevard-idzdd7ex?pId=2531140&reviews=true (Fresha changed the listing's address after the rename; the old addresses redirect here)
- Google place link (checked: matches the Google Maps place the site already links to): https://www.google.com/maps?cid=10023166608714528543
- Google reviews today: 26 (5 stars). Fresha: 99 (5 stars).

## Key technical finding
The site is a client-side React/Vite app, so crawlers that don't run JavaScript (most AI bots, link-preview bots) can't see the page content. Partly addressed: `index.html` now has the title, description, link-preview tags, business structured data and a `<noscript>` text summary, and `robots.txt` and `sitemap.xml` are live. The full page content is still only rendered by JavaScript (see item 10). Navigation items are `<button>`s that scroll within one URL; there is a single page only.

## Decisions made by the owner
- Hero line is "Lash & Brow Studio — Ballston, Arlington, VA". (done)
- Anastasiia is named in About as founder and lash & brow artist; the About photo is her. (done)
- Experience stays "4+ years" on the site.
- Services section stays at 5 popular services plus a link to Fresha for the full list.
- Business name is "BeYou Beauty Hub" across all platforms.
- Phone tap opens the dialer, email tap opens the mail app, "Text us" tap opens Messages; on a computer, clicks copy instead. (done)
- Gallery file names and alt text (item 4) will be written by Anastasiia.
- Remaining work must make the site easier to find for lash and brow searches; no cosmetic changes (2026-11-05).

## How the ratings work
The number in parentheses is the expected effect on being found in search, from 1 (minimal) to 10 (largest). It rates impact, not effort. "Invisible" means the site looks the same.

## To do in code (sorted by search impact)
- **Item 10. Separate service pages with pre-rendered HTML (9/10)** — biggest win, biggest job. A single page can only rank well for a few searches. Give each main service its own address and page, for example `/brow-lamination-arlington`, `/korean-lash-lift-arlington`, `/lash-lift-and-tint-arlington`, with about 300 words each (what it is, who it suits, duration, price, aftercare, Book button, Ballston location), and build them as static HTML so every search engine and AI tool can read them without JavaScript. Include the full service menu from Fresha as text (see item 12). GitHub Pages serves static files, so this fits (for example `vite-react-ssg` or a pre-render step at build time). Pages match the existing design; no new look. **Needs Anastasiia's input** for each service's text, or approval of drafts.
- **Item 9. FAQ section (6/10)** — new visible content, not cosmetic. 6 to 8 real questions people search for: natural look, how long it lasts, same-day lift and lamination, aftercare, cancellation, parking near Ballston Metro, ending with "Still unsure? Book a free 15-minute consultation." Helps question-style searches and AI assistants. Google no longer shows FAQ dropdowns in results for most businesses (since 2023), so the value is the text itself. **Needs Anastasiia's real answers.**
- **Item 4. Gallery alt text and file names (3/10)** — invisible. Helps Google Images ("brow lamination before and after Arlington"). Existing alt texts mention "eyelash extensions" and "volume lash extensions", which aren't offered. **Waiting on Anastasiia.**

Not search-related, set aside:
- **Item 6. Contact form service list (1/10)** — duplicates, and lists lash extensions that aren't offered. A correctness fix for the form, not a search improvement. Optional, at the owner's choice.

After any content change: update `lastmod` in `public/sitemap.xml`, and add new pages to it.

## Owner tasks, not code (sorted by search impact)
For local "near me" and map results, the top two outweigh any code work.

- **Owner task 1. Google Business Profile (10/10)** — decides who appears in the map results for searches like "lash lift near me". Precise categories, all services with prices, description mentioning Ballston and natural results, real before/after photos, weekly posts, answer Q&A, name/phone/address identical to the site.
- **Owner task 3. Google reviews (9/10)** — review count, recency and replies are among the strongest local-ranking factors, and Google has 26 reviews against Fresha's 99. Text the review link https://g.page/r/CR93_PTscBmLEBM/review to clients after visits (the site's Testimonials section links to it too); reply to every review; no incentives.
- **Owner task 5. Local mentions and links (6/10)** — links from local sites tell Google the business is established in Arlington. Pitch Arlington Magazine, ARLnow and Northern Virginia Magazine "best of" lists; ask Salons by JC to link to the studio.
- **Owner task 2. Fresha name and address consistency (6/10)** — Google compares business details across sites, and mismatches weaken local ranking. Rename "BeYou Beauty Hub Arlington" to "BeYou Beauty Hub"; add a description mentioning Ballston; complete the photos. Fresha pages are what search tools and AI assistants found for this business. (2026-11-06: Anastasiia removed "Arlington" from the Fresha name; keep it out, since city names in a business name break Google's rules unless they are part of the real name. Fresha lists the address as "Suite 4"; the confirmed address is "3865 Wilson Blvd, Suite 100, Room 4", which the site and structured data use. Update Fresha, and check that Google Business Profile, Apple Maps and Facebook show the same. Fresha shows 5.0 from 99 reviews.)
- **Owner task 4. Google Search Console (5/10)** — doesn't raise rankings by itself, but gets changes indexed faster and shows which searches the site appears for. Postponed; to do later. Rich Results Test already passed on 2026-11-05 (1 valid LocalBusiness + 1 Organization item). The domain's DNS is at Squarespace (formerly Google Domains; name servers `ns-cloud-d*.googledomains.com`). Steps:
    1. search.google.com/search-console → sign in (ideally the Google Business Profile account) → **Add property** → **Domain** → `beyoubeautyhub.com` → Continue → copy the `google-site-verification=...` TXT value. (If Google offers "Start verification" for Squarespace, use it and skip to step 4.)
    2. account.squarespace.com/domains → beyoubeautyhub.com → **DNS** → **DNS Settings** → **Custom records** → **Add record**: Host `@`, Type `TXT`, Data = the copied value → Save. Do not change or delete existing records (the GitHub Pages records keep the site online).
    3. Back in Search Console → **Verify** (retry after 15-60 min if needed). Keep the TXT record permanently.
    4. **Sitemaps** → enter `sitemap.xml` → Submit ("Couldn't fetch" at first is normal).
    5. Paste `https://www.beyoubeautyhub.com/` in the top search bar → **Test live URL** → **View tested page**: the Screenshot tab should show the rendered page; in the HTML tab, Ctrl+F for `1400+` and `Anastasiia`. Then **Request indexing**.
    6. Optional: bing.com/webmasters → **Import from Google Search Console** (covers Bing, DuckDuckGo, Yahoo).

    If the domain isn't in that Squarespace account, it's under a different login; find which before continuing.
- **Owner task 7. Facebook and Apple Maps names (4/10)** — Apple Maps is what iPhone users and Siri search, so a correct Apple Business Connect listing matters for those searches. Both Facebook and Apple Maps still show "BeYou BeautyHub"; rename to "BeYou Beauty Hub". After the Apple rename, the site's Apple Maps links (`name=BeYou+BeautyHub`) can be updated too.
- **Owner task 6. Instagram (3/10)** — put "Ballston" in the Name field (for example "BeYou Beauty Hub | Brow & Lash Ballston"), link the website and Google reviews in addition to Fresha, add before-and-after content, keep captions local and service-specific, confirm Call/Directions/Book buttons are on. Update the pinned post's "3+ years" to match the site's "4+ years".
- **Owner task 9. Sitemap date (1/10)** — update `lastmod` in `public/sitemap.xml` when the site content changes meaningfully (or ask for it to be done).
- **Owner task 8. Facebook link preview refresh (not search-related)** — after each deploy that changes the link preview, use Facebook's Sharing Debugger (developers.facebook.com/tools/debug) and click "Scrape Again". Its `fb:app_id` warning can be ignored. For Telegram, send the URL to @WebpageBot to refresh its cached preview.

## Done (2026-11-05)
- **Item 1. `index.html`, `robots.txt`, `sitemap.xml`:** applied and deployed; `robots.txt`, `sitemap.xml` and the new title confirmed loading on the live site. Structured data was extended with image, logo, map coordinates, price range ($25-$195), founder (Anastasiia), and Fresha and Google Maps in `sameAs`; the `<noscript>` Fresha link uses the new address. Google's Rich Results Test: 1 valid LocalBusiness + 1 Organization item.
- **Item 2. Hero and About:** hero line says "Ballston, Arlington, VA"; About opens with "I'm Anastasiia, founder and lash & brow artist of this Ballston studio" and the photo's alt text names her. Experience kept at 4+ years.
- **Item 3. Hero counters:** the real values (1400+, 4+, 5) are always in the page text for crawlers and screen readers; the count-up animation is drawn by CSS and never changes the page text. Looks identical on screen; skipped under reduced motion.
- **Item 5. Name spelling:** "BeYou BeautyHub" / "Be You Beauty Hub" changed to "BeYou Beauty Hub" in the footer heading, privacy and cookie policy text, logo alt text and button labels.
- **Item 7. Real contact links:** phone (header, Contact, footer), email (Contact, footer) and "Text us" (Contact) are real `tel:`, `mailto:` and `sms:` links. A tap opens the dialer, mail app or Messages; a computer click copies, as before. iPads are now treated as touch devices. Confirmed on a Galaxy S23+ (Android). On iPhone Safari, phone and "Text us" opened natively but the email tap copied instead; fixed (touch is now detected from the finger touch itself) and confirmed working on the iPhone. The "copied" message now shows above the header (it used to appear behind it).
- **Item 11. Link preview image:** `public/images/og-image.jpg` (1200x630, 68 KB, hero photo with the logo on the left) with `og:image` and `twitter:card` tags. Confirmed in WhatsApp, iMessage and Facebook.
- **Item 13. Search words in the main heading:** the page's single `<h1>` is now "Lash & Brow Studio — Ballston, Arlington, VA" instead of the slogan "Be natural. Be real. BeYou." Verified pixel-identical on desktop and mobile (no visible change); a smoke test guards it. Deployed.
- **Item 14. Page speed (5/10):** the main script went from 926 KB to 377 KB (265 KB to 125 KB compressed). The 3D library (three.js) is now loaded separately: on computers with a mouse only after the page has finished loading (for the glitter trail), and on phones not at all unless the visitor scrolls near the footer logo. The hero photo is served as AVIF (76 KB) or WebP (81 KB) instead of the 442 KB JPEG, and its download starts before the scripts run. The About photo of Anastasiia likewise went from 760 KB to 79 KB (AVIF) or 95 KB (WebP). Looks identical: all visual tests pass against the old screenshots, and a close-up comparison shows no visible difference. Deployed; run pagespeed.web.dev on the site to see the new score (no "before" score was recorded).

- **Item 8. Review links:** the end of the Testimonials section reads "…and counting. Your 5-star experience could be the next one we celebrate." (plain text now, not a link; its typing animation starts as soon as the line is on screen) followed by "Visited us? Leave a review on Google · Fresha". Google opens the write-a-review box via the Business Profile link https://g.page/r/CR93_PTscBmLEBM/review (checked: same Google listing as the site's Maps links); Fresha opens the Fresha reviews page through a small helper page on the site (`/fresha-reviews/`, hidden from search) so that phones stay in the browser instead of the Fresha app, which doesn't show the reviews; tested on phones: the Fresha app still opens instead of the browser (Fresha claims all its links), but no leftover blank tab is left behind on iPhone any more. Accepted by the owner as is. The wording next to the Google link is neutral on purpose (Google forbids asking only for positive reviews). Deployed.
- **Item 12. Services and address in the structured data:** the address is "3865 Wilson Blvd, Suite 100, Room 4" (confirmed by the owner), matching the visible site. The 5 services the site shows (Signature Korean Lash Lift from $115, Lash Lift + Tint from $85, Brow Lamination + Tweezing from $80, Brow Mapping + Tweezing from $40, L&L Combo Deluxe from $195) are listed with their site descriptions, plus the areas served (Ballston, Clarendon, Courthouse, Virginia Square, Arlington). No star ratings (Google ignores self-published ones). A smoke test fails if a listed service or price stops matching the Services section. When item 10 shows Fresha's full menu as text, add those services here too; never use Fresha URLs containing `cartId`. Not yet deployed at the time of writing; after deploying, re-run Google's Rich Results Test.

Also done along the way:
- All old Fresha links on the site (including old "vienna" addresses) point to the new Fresha address.
- Housekeeping: fixed a TypeScript error in `Header.tsx`; refreshed outdated visual-test screenshots and made those tests stable by hiding the fixed header during section shots.
