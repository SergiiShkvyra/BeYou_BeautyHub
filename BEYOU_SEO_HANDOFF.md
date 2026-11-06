# BeYou Beauty Hub: website and local-search handoff

Context: audit done in a claude.ai chat on 2026-11-05 (live site, Fresha/ClassPass listings, Instagram screenshots). Goal: make the site and online presence easier to find for "best eyelash/brow salon in Ballston/Arlington" searches, keeping the "natural results" positioning. Verify anything below against the live site and code before relying on it.

Last updated: 2026-11-05, after code items 1, 2, 3, 5, 7 and 11 were completed and deployed (see "Done" at the bottom). Item numbers are kept from the original list so they can still be referred to by number.

## Business facts (keep identical everywhere)
- Name: **BeYou Beauty Hub** (exactly this; no "Be You", no "BeautyHub", no "Arlington" in the name)
- Address: Salons by JC, 3865 Wilson Blvd, Room 4, Arlington, VA 22203 (Ballston)
- Phone: (571) 276-7014 | Email: info@beyoubeautyhub.com
- Hours: Mon-Fri 10:00-19:00, Sat 10:00-17:00
- Founder and artist: Anastasiia (now named on the website's About section)
- Experience: 4+ years (the site's figure, confirmed by the owner; the Instagram pin still says 3+ years)
- Free 15-minute consultation is offered on Fresha
- Links: Instagram https://www.instagram.com/beyou_beautyhub | Facebook https://www.facebook.com/share/15Py4Ci4CV | Fresha https://www.fresha.com/a/beyou-beauty-hub-arlington-arlington-3865-wilson-boulevard-idzdd7ex?pId=2531140&reviews=true (Fresha changed the listing's address after the rename; the old addresses redirect here)
- Google place link (checked: matches the Google Maps place the site already links to): https://www.google.com/maps?cid=10023166608714528543
- Google reviews today: 26 (5 stars). Fresha: about 98 (5 stars).

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

## To do in code (priority order)
4. Gallery images `IMG_01` to `IMG_08` have no alt text: rename files descriptively and add accurate alt text. Existing alt texts mention "eyelash extensions" and "volume lash extensions", which don't match current services. **Waiting on Anastasiia** for the names and descriptions.
6. Contact form: "Lash Lift + Tint" and "Lash Lift & Tint" are duplicates; add "Korean Lash Lift" and "Brow Mapping"; remove "Volume" and "Hybrid Lash Extensions" unless the studio really offers them (Fresha/ClassPass show only lifts and brows).
8. Add a Google Maps "Get directions" link to the Google listing, plus a "Read reviews / leave a review" link (see item 3 below under Owner tasks).
9. Add an FAQ section (6 to 8 real questions: natural look, how long it lasts, same-day lift and lamination, aftercare, cancellation, parking near Ballston Metro) ending with "Still unsure? Book a free 15-minute consultation."
10. Pre-rendering so full page content is in the HTML. Plan: static generation (for example `vite-react-ssg` with React Router) and separate pages: `/`, `/brow-lamination-ballston`, `/korean-lash-lift-arlington`, `/about`. Needs a look at `package.json`, the router setup and the hosting provider (GitHub Pages) before choosing the approach. Each service page: about 300 words (what it is, who it suits, duration, price, aftercare, Book button, Ballston location).

## Owner tasks (not code)
1. Google Business Profile: precise categories, all services with prices, description mentioning Ballston and natural results, real before/after photos, weekly posts, answer Q&A, name/phone/address identical to the site.
2. Fresha: rename "Be You Beauty Hub Arlington" to "BeYou Beauty Hub"; description mentioning Ballston; complete photos. These pages are what search tools and AI assistants found for this business. (The listing's web address has changed to a "beyou-beauty-hub-…" one, so a rename has started; check that "Arlington" is gone from the displayed name.)
3. Reviews: get the short "ask for reviews" link from Google Business Profile (looks like `g.page/r/.../review`) and text it to clients after visits; reply to every review; no incentives.
4. Set up Google Search Console (postponed; to do later). Rich Results Test already passed on 2026-11-05 (1 valid LocalBusiness + 1 Organization item). The domain's DNS is at Squarespace (formerly Google Domains; name servers `ns-cloud-d*.googledomains.com`). Steps:
   1. search.google.com/search-console → sign in (ideally the Google Business Profile account) → **Add property** → **Domain** → `beyoubeautyhub.com` → Continue → copy the `google-site-verification=...` TXT value. (If Google offers "Start verification" for Squarespace, use it and skip to step 4.)
   2. account.squarespace.com/domains → beyoubeautyhub.com → **DNS** → **DNS Settings** → **Custom records** → **Add record**: Host `@`, Type `TXT`, Data = the copied value → Save. Do not change or delete existing records (the GitHub Pages records keep the site online).
   3. Back in Search Console → **Verify** (retry after 15-60 min if needed). Keep the TXT record permanently.
   4. **Sitemaps** → enter `sitemap.xml` → Submit ("Couldn't fetch" at first is normal).
   5. Paste `https://www.beyoubeautyhub.com/` in the top search bar → **Test live URL** → **View tested page**: the Screenshot tab should show the rendered page; in the HTML tab, Ctrl+F for `1400+` and `Anastasiia`. Then **Request indexing**.
   6. Optional: bing.com/webmasters → **Import from Google Search Console** (covers Bing, DuckDuckGo, Yahoo).
   If the domain isn't in that Squarespace account, it's under a different login; find which before continuing.
5. Local mentions: pitch Arlington Magazine, ARLnow and Northern Virginia Magazine "best of" lists; ask Salons by JC to link to the studio.
6. Instagram: put "Ballston" in the Name field (for example "BeYou Beauty Hub | Brow & Lash Ballston"), link the website and Google reviews in addition to Fresha, add before-and-after content, keep captions local and service-specific, confirm Call/Directions/Book buttons are on. Update the pinned post's "3+ years" to match the site's "4+ years".
7. Facebook page and Apple Maps (Apple Business Connect) still show the name as "BeYou BeautyHub"; rename to "BeYou Beauty Hub". After the Apple rename, the site's Apple Maps links (`name=BeYou+BeautyHub`) can be updated too.
8. After each deploy that changes the link preview, use Facebook's Sharing Debugger (developers.facebook.com/tools/debug) and click "Scrape Again". Its `fb:app_id` warning can be ignored.
9. Update `lastmod` in `public/sitemap.xml` when the site content changes meaningfully (or ask for it to be done).

## Done (2026-11-05)
1. **`index.html`, `robots.txt`, `sitemap.xml`:** applied and deployed; `robots.txt`, `sitemap.xml` and the new title confirmed loading on the live site. Structured data was extended with image, logo, map coordinates, price range ($25-$195), founder (Anastasiia), and Fresha and Google Maps in `sameAs`; the `<noscript>` Fresha link uses the new address.
2. **Hero and About:** hero line says "Ballston, Arlington, VA"; About opens with "I'm Anastasiia, founder and lash & brow artist of this Ballston studio" and the photo's alt text names her. Experience kept at 4+ years.
3. **Hero counters:** the real values (1400+, 4+, 5) are always in the page text for crawlers and screen readers; the count-up animation is drawn by CSS and never changes the page text. Looks identical on screen; skipped under reduced motion.
5. **Name spelling:** "BeYou BeautyHub" / "Be You Beauty Hub" changed to "BeYou Beauty Hub" in the footer heading, privacy and cookie policy text, logo alt text and button labels.
7. **Real contact links:** phone (header, Contact, footer), email (Contact, footer) and "Text us" (Contact) are real `tel:`, `mailto:` and `sms:` links. A tap opens the dialer, mail app or Messages; a computer click copies, as before. iPads are now treated as touch devices. Deployed; confirmed working on a Galaxy S23+ (Android). iPhone/iPad not yet tested.
11. **Link preview image:** `public/images/og-image.jpg` (1200x630, 68 KB, hero photo with the logo on the left) with `og:image` and `twitter:card` tags.

Also done along the way:
- All old Fresha links on the site (including old "vienna" addresses) point to the new Fresha address.
- Housekeeping: fixed a TypeScript error in `Header.tsx`; refreshed outdated visual-test screenshots and made those tests stable by hiding the fixed header during section shots.
