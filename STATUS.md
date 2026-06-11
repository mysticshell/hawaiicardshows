# Hawaii Card Shows — Project Status

*Last updated: 2026-06-09 pm (KIA #2 recap photos + "West Side Card Show" rename shipped; recaps live as hidden review drafts)*

---

## 🔥 Active Threads (next session — pick up here)

### ✅ SHIPPED — Full Calendar page + `series` taxonomy + clickable calendar (2026-06-09)
Done and pushed/deployed. Four related pieces:
1. **Dedicated [/calendar/](calendar/index.html) page** — mobile auto-agenda, desktop grid+agenda toggle, pulls approved Supabase events, goes as far out as shows are booked. "Full Calendar" CTAs on home hero + shows page (under Featured, above All Shows) + a **Calendar nav/footer link added site-wide across all 54 public pages**.
2. **Scrapped the misleading "Annual Events" home section** — `annual` had become a junk drawer. Shows still surface on the Full Calendar by date. Revisit later as a tight "Flagship" section if wanted.
3. **New `series` event_type** for the irregular-cadence middle ground (Keep It Aloha, Paradise, Card District, Mini Pokemon Market, etc.). `event_type` is **free text — no migration needed**. Made `series` first-class in code (home schema/stats, shows-page filter + purple badge) BEFORE re-tagging so nothing regressed. **Re-tagged 43 rows** via service key → live distribution: series 40 / recurring 8 / one-time 15 / annual 2 (Pop Con + Aloha Card Show Blaisdell only) / music 1. Rollback snapshot: `.agents/retag-rollback-20260609.json` (gitignored). Submit form + both admin (`missingno.html`) dropdowns gained a Series option so new submissions round-trip. Full rationale in auto-memory `project_event_type_taxonomy.md`.
4. **Clickable day popup on the calendar grid** — clicking any day with shows opens a modal listing every show that day (incl. ones hidden behind "+N more"), each linking to its show page. Closes on X/backdrop/Esc. Both /calendar/ and home inline calendar. Agenda rows were already links.

**Small follow-up (low priority, self-resolving):** ~a few of the 15 `one-time` rows may actually be series we couldn't confirm (Moiliili, Spotlight, Kauai Collectors Con, Ya Maui). Bump to `series` when a 2nd date is booked. Related backlog item still open: "Add to Calendar" (iCal/Google) buttons on show pages.

### ▶️ RECAPS — KIA #2 PUBLISHED; West Side in organizer review (updated 2026-06-09 pm)
- **KIA #2 — ✅ PUBLISHED & LIVE** https://hawaiicardshows.com/recaps/keep-it-aloha-june-2026 (indexable; in
  recap-map.js → homepage "Latest From Hawaii" + recaps index + KIA show page; in sitemap). 70+ vendors /
  1,500+ attendees (single Friday night vs May's 5,000 over two days), 8 photos, full sponsor mahalo, Kamaka's
  reel, Tyler's "night out with friends" voice. **KIA recap newsletter drafted** at
  emails/blasts/blast-recap-keep-it-aloha-june-2026.html (HCS Team note in; "1,500+ on a Friday night" hook) —
  **send Tue–Wed**, NOT Monday. **Big-week carousel + stories refreshed**: "Oahu's biggest week" + real numbers.
- **West Side Card Show III** (flagship) — https://hawaiicardshows.com/recaps/west-side-show-iii-june-2026 —
  review pass done (new lead "hobbyists, side hustlers, or card show owners"; Darkrai SAR + keiki free packs;
  gimme-gimmes; Paul's year-ago origin; 2 community reels). **Branded fallback hero in place** (swap for a real
  photo later). Still needs: vendor/attendance counts (TBC), MC's @handle, real photos. Tyler gathering Paul's feedback.

**RENAME shipped + verified live:** "West Side Show" → "West Side Card Show" everywhere — DB events III/IV,
series page display + `SERIES_NAME_PATTERN`, `HCS_SERIES_URLS` routing (index.html + shows/show.html), recap,
draft blast, big-week social slides. **URL slug `/shows/west-side-show` kept** (display-only rename; changing
the slug would break links/SEO/API). Also fixed @rocketrelics→@rocket_relics on the series page.

**Still NEEDED — West Side only:** vendor/attendance counts + the MC's @handle (real photos optional — branded
fallback hero is live). Publish steps (mirror what KIA did): flip `robots`→`index, follow`, register in
recap-map.js + sitemap.xml, remove the review banner + top DRAFT comment.

### 📬 NEWSLETTER ENGAGEMENT PLAN (CMO — Claude owns this metric)
Baseline (the one fully-owned channel): ~110 subs · opens **48–55%** · clicks sliding **12%→~5%** (dilution) ·
only **~0.9%** of visitors convert (71 form_submits / 7,650 sessions / 30d). Prioritized levers:
1. **Activate the welcome sequence** — Day 0/7/21 drafts in `emails/welcome-sequence/` were NEVER uploaded to
   Buttondown. New subs get silence until the next digest = worst-moment churn. **#1 ROI, free, already written.**
2. **Convert existing traffic** — 0.9%→1.8% ≈ doubles signups with zero new audience. Sharpen the recap-page
   inline signup copy for recap-readers; ship the **100-sub giveaway** (needs a prize); A/B popup/bar (we have
   per-surface `form_id` attribution).
3. **Sharpen sends** — curiosity/benefit subject lines (the "Max Holloway" blast beat generic weekly subjects);
   ONE clear CTA per send (reverse the click slide); recaps = a high-open 2nd weekly touchpoint; segment by island.
Targets: **150 subs + opens ≥45%** next month; visitor→sub **0.9%→1.5%**.

**✅ SHIPPED (2026-06-09):**
- **Auto-catchy weekly subject lines** — `buildSubject()` in `functions/api/generate-newsletter.js` now builds
  the subject from the week's data (show count + headliner, rotates by date so weeks don't repeat). Replaces
  the flat "Hawaii Card Shows — {dates}". Verified live via `?preview=1` (e.g. "Your week in Hawaii cards: 5 shows 🗓️").
- **Consistent weekly CTA** — "📅 See the Full Calendar" button in the intro → `/calendar/` (UTM `intro-calendar-cta`).
- **KIA #2 recap newsletter** staged as a Buttondown DRAFT (`em_1abvfv7tzj8sgb39xvb73rayjv`, subject
  "1,500+ collectors. One Friday night.") — Tyler to review + schedule Tue–Wed.
**⬜ NEXT:** welcome sequence (Tyler reviewing the 3 drafts, then ~30-min Buttondown upload); sharpen recap-page
inline signup copy for recap-readers; 100-sub giveaway (needs Tyler's prize pick — CMO rec: vendor-sponsored).
Segmentation = back pocket (Tyler's call).

**✅ RESOLVED (2026-06-09): hero image is now a REQUIRED recap-template element.**
Every recap leads with a `.recap-hero-banner` that is ALSO the og/twitter image (`/recaps/images/{slug}-hero.jpg`).
- KIA #2 = real-photo hero. West Side = **branded fallback** built (`recaps/_hero-src/west-side-show-iii-june-2026.html`
  → `-hero.jpg`, 1600×840, gradient + "Max Holloway's Vendor Debut") — swap for a real photo when Tyler has one.
- Codified in `recaps/_TEMPLATE.html` (hero block + og:image/twitter:image now standard, keyed to `{{SLUG}}-hero.jpg`)
  and `recaps/RECAP-KIT.md` (hero render + branded-fallback recipe). West Side photo gallery commented out
  until real photos exist (no broken images on the review page).

### ▶️ THEN: refresh carousels with Tyler's voice
Current slides in [recaps/social/](recaps/social/) were intentionally plain (no Tyler input yet). After the
recaps lock, pull the real moments/voice into the graphics. Render flow: edit `src/*.html`, run
`print/render-slides.sh <drop>/src <WxH> <drop>`. Still-open: giveaway prize (CMO rec: vendor-sponsored) +
deadline; "Send Us Your Moments" voice (team vs signed founder note).


### Collectr partnership — LIVE, awaiting Tyler reply
Adam (Collectr CEO) responded asking for an API to poll shows. **We shipped the API + finalized the email reply same-day.** Tyler is sending the reply (was reviewing the final copy-paste version).

- **Endpoint:** `https://hawaiicardshows.com/api/events` (Cloudflare Pages Function at [functions/api/events.js](functions/api/events.js))
- **Latest good commit: `64016f3`** — API verified HEALTHY (returns proper JSON, `application/json` content-type, HEAD/GET/OPTIONS supported, filter validation, 502s genericized, no upstream leakage). Docs at [functions/api/README.md](functions/api/README.md) include the stability contract.
- **⚠️ Incident this session (resolved):** commit `5d0fb26` added an explicit Supabase field list for defense-in-depth but included `custom_url`, a column that **does not exist** in the events table. Supabase rejected the query → API returned 502 (Tyler caught it in the browser). Fixed in `64016f3` by removing `custom_url` from the select list. **Lesson: the events table has NO `custom_url` column** — the `urlFor()` helper checks `e.custom_url` defensively but never select it from Supabase. If you ever want per-event URL overrides, add the column in Supabase first.
- **Final email** was delivered as plain-text copy-paste (endpoint + filters + curl example + GitHub README link + a paragraph inviting Adam's feedback on the most-useful shape, since the site is still iterating). Sent from `tyler@hawaiicardshows.com`.
- **Watch for:** Adam's reply with technical questions (auth? webhooks? specific fields?) or scheduling a call. He's a CEO; expect 24-72hr turnaround.
- **If he asks for more fields/webhooks/auth:** that's a buying signal — say yes and build it. Roadmap options already documented in the README (webhook on new event, diff endpoint, per-event detail endpoint, past-event archive, API keys, extra fields like vendor_count/pricing).

### ⚠️ API stability rule — read before changing event data structure

We have a live public API at `/api/events` that Collectr (and any future partner) will integrate against. The README spells out an **additive-only contract**: new fields and new enum values are safe to add, but renaming/removing existing fields breaks integrations.

**Before doing any of these, check API impact:**
- Renaming columns in the Supabase `events` table
- Renaming `event_type` values (currently: `one-time`, `series`, `annual`, `recurring`, `music`). `series` added 2026-06-09 — additive, API-safe per the contract below.
- Renaming `island` values (currently: `Oahu`, `Maui`, `Big Island`, `Kauai`, `Molokai`, `Lanai`)
- Changing the `url` field format / canonical URL pattern for shows
- Removing fields from the API response shape in `functions/api/events.js`

**Safe to change freely (no API impact):**
- Website design, layout, brand, colors, copy
- Event content (descriptions, dates, venues, instagram handles, etc.)
- Adding new pages, recap pages, shop pages, or static content
- Adding NEW event_type or island values (e.g. `tournament`) — but the client code at the partner should handle unknowns
- Cloudflare config, redirects, slug routing

If a breaking change is genuinely needed: email Adam (and any future partners) **30+ days in advance** with the rationale + migration path. Add URL versioning (`/api/v1/`) before the change ships.

### Slug URLs — clean URLs are LIVE (2nd attempt)
Tyler asked for cleaner `/shows/<slug>` URLs instead of `?id=<uuid>`. First attempt (`_redirects` with status 200) broke production with redirect loops — reverted in `b65c891`. **Second attempt using Cloudflare Pages Function works correctly** — commit `866b92f`. URLs like `/shows/pokemon-rave` now resolve via [functions/shows/[slug].js](functions/shows/[slug].js).

### Google Search Console — NOW CONNECTED (2026-06-XX)
The GA4 service account (`analytics-viewer@hawaii-card-shows.iam.gserviceaccount.com`) now has Search Console access too. Two setup steps were done: (1) enabled the Search Console API in the `hawaii-card-shows` Cloud project, (2) Tyler added the service account as a user in the GSC property.

- **Script:** `.agents/scripts/gsc_report.py` (local-only, gitignored like ga4_report.py). Usage:
  - `python3 .agents/scripts/gsc_report.py` → top 25 queries, last 28 days
  - `python3 .agents/scripts/gsc_report.py "west side"` → queries containing a term
  - `python3 .agents/scripts/gsc_report.py --page west-side-show` → all queries for one page
- **Site property:** `sc-domain:hawaiicardshows.com` (domain property). If a query 403s, the URL-prefix form may be needed — override via `GSC_SITE_URL` in .agents/.env.
- **What GSC gives that GA4 can't:** the actual search QUERY strings + impressions + average rank position. GA4 only shows "organic search sessions." Use GSC for "what are people typing to find us / what do we rank for."
- **Data caveat:** ~2-3 day lag, ~16 month retention, data starts from property verification.

### Emi (recent college grad) — social media collab idea
Tyler had coffee with Emi May 31 — anime fan, wants to work in TV/marketing, has social media experience, no job this summer. I drafted three deal shapes for a win-win collab. **Tyler paused this to focus on Collectr — reminder to come back to it.** Concrete proposal queued: 2-week paid trial ($300, 5 IG posts + 1 Reel + 1 newsletter section), then $150/show per-show coverage if it works. Full thinking in TaskGet #1.

### 🗓️ MONDAY (2026-06-08) priority — back-to-back recap weekend

Tyler attended both KIA #2 (Fri 6/5) AND West Side Cardshow III (Sat-Sun 6/6-6/7 with Max Holloway as headline vendor). Monday's session should knock out both recaps + cross-channel promo while it's still fresh.

**Lead the Monday session with:**
"Welcome back from the weekend. We've got KIA #2 + West Side Cardshow III to recap. What numbers + photos + standout moments did you come back with?"

**Concrete Monday plan:**
1. **KIA #2 recap** — same template as KIA #1 (`recaps/keep-it-aloha-may-2026.html` as reference, copy `recaps/_TEMPLATE.html` per `recaps/CHECKLIST.md`). Tyler bringing: photos (drop in `/recaps/images/keep-it-aloha-june-2026-*.{jpg,JPG}`), vendor count, attendance estimate, standout moments, sponsor mentions.
2. **West Side Cardshow III recap** — the bigger story given Max Holloway. **Frame as a flagship piece** (Hawaii Card Shows' first recap featuring a UFC champion vending). Real backlink + press potential. Same photo conventions: `/recaps/images/west-side-show-iii-june-2026-*.{jpg,JPG}`.
3. **Saruko walkthroughs** for both shows — add entries to [`/community/walkthroughs.js`](community/walkthroughs.js) once Saruko sends links. ONE entry per recap_slug, no HTML editing needed (auto-renders).
4. **Email blast** — combine both recaps + tease the August 9 Get Nutz In Paradise at Kroc Center + Aug 21-23 Collectors Hale (Maui). Subject angle: "What you missed (and what's next)."
5. **IG carousel + Stories** — all IG assets now live in `recaps/social/` (one folder per post; see `recaps/social/README.md`). Render with `print/render-slides.sh <drop>/src <WxH> <drop>`.

### ⏰ STILL ON HOLD (carried over) — surface alongside the recap work

These were June 3's "tonight/tomorrow" items and haven't been done yet. Surface them again Monday as the second priority block after the recaps.

1. **Upload welcome email sequence to Buttondown** (~30 min). Drafts ready in [emails/welcome-sequence/](emails/welcome-sequence/): welcome-email.html (Day 0), -2 (Day 7), -3 (Day 21). Setup steps in [emails/welcome-sequence/WELCOME-SEQUENCE.md](emails/welcome-sequence/WELCOME-SEQUENCE.md). Days since approval are compounding into lost engagement.
2. **Execute Backlink Playbook Phase 1** (~1 hour). [BACKLINK-PLAYBOOK.md](BACKLINK-PLAYBOOK.md) has the copy-paste DM script. Send to Kamaka (@kamakarips), Javin (@paradisecards_), PKMN Collective, Maui Sports Cards, GetNutz, ToyLynx, Bubbah's Toy Box, Aloha Card Shop. Each ask: add their series-page URL to their Linktree. Expected 4-5 backlinks within 48 hours.

## 📊 Where the site is right now (June 3 snapshot)

- **6,616 sessions / 3,533 users** in last 30d (**+66% MoM**, second consecutive doubling month)
- **2,464 unique Hawaii collectors** — discovery layer thesis is validated
- **34 QR card scans** total (TCG Tavern at Evolving Realms is the runaway at 18 scans)
- **46 newsletter signups in 30d** (was 25 prior — funnel doubled)
- **May 30-31 weekend hit 662 sessions/day** — best day in site history, driven by Hawaii Shows event
- **August 9 weekend (Get Nutz In Paradise + HNL x Fandom) is the next big spike target**

## 🗓️ Personal email infrastructure (June 1 setup)

Tyler now has `tyler@hawaiicardshows.com` for personal outreach (founder-to-founder), forwarding to his Gmail with Send-As configured via Google Workspace. Used for the Collectr conversation.

Aliases set up: `tyler@`, `aloha@`, `press@`, `partnerships@` — all route to one Google Workspace seat.

## 🟡 Pending Tyler Tasks

- [ ] **Welcome email sequence to Buttondown.** Three drafts in [emails/welcome-sequence/](emails/welcome-sequence/): welcome-email.html (Day 0), -2 (Day 7), -3 (Day 21). [WELCOME-SEQUENCE.md](emails/welcome-sequence/WELCOME-SEQUENCE.md) has setup steps. Approved May 6 but still not uploaded.
- [ ] **Photos for the SEO pillar.** Need: (1) Maui or Big Island show photo (biggest credibility gap), (2) Two collectors trading, (3) Vendor table close-up, (4) Dollar bin shot.
- [ ] **Big Island Breaks outreach.** Page is built. Send to them for review + get address/hours.
- [ ] **Add Big Island Breaks to shop directory** once they approve their page.
- [ ] **Bayview landscape hero photo.** Tyler to grab a wide landscape shot at the next Tuesday meet so we can swap the gradient hero to a full-bleed banner like Keep It Aloha.

## Blocking — Needs Tyler

- [x] ~~Buttondown setup~~ — Complete. Upgraded, subscribers imported, API key in Cloudflare. Verified working 2026-04-16.

## Action Items — Claude Can Do

- [x] ~~Newsletter popup~~ — Exit-intent (desktop) + sticky bar (mobile). Shipped 2026-04-15.
- [x] ~~Big Island Breaks~~ — Updated to Pokemon-focused (sealed, singles, slabs). Shipped 2026-04-15.
- [ ] **ToyLynx recurrence update** — Was scheduled automatically in old session. Verify it went through.
- [ ] **Big Island Breaks outreach** — Page is built. Send to them for review + get address/hours.
- [ ] **Add Big Island Breaks to shop directory** — Once they approve their page.
- [ ] **Bayview landscape hero photo** — Page shipped with portrait crowd photo + flyer in a "From the Floor" block (both currently at `/recaps/images/`). Hero is a purple gradient + PKMN logo. Tyler to grab a wide landscape shot at the next Tuesday meet (May 5 or May 19) so we can swap the gradient hero to a full-bleed banner like Keep It Aloha. Per [image conventions](.claude/...) the two photos arguably belong in `/shows/flyers/` — leave for now, move only if doing a broader cleanup.

## Brand Rollout Plan (~10-15 hrs once design is locked)

Designer signed off 2026-05-05. Phase 1 + Phase 2 shipped 2026-05-05/06. Demo still lives at `/preview.html`. Rollout strategy: **Hybrid — Phase 1+2 with review (done), now sprinting Phases 3-6.**

### Phase 0 — Lock the design ✅
- [x] Initial brand assets in `/branding/` (logos, fonts loaded)
- [x] preview.html demo with floating pill nav, gradient bg, green About block, orange footer
- [x] V2 colored logos with gradient pattern in icon
- [x] Final design pass + sign-off — Tyler 2026-05-05 ("Designer has approved let's run it")

### Phase 1 — Extract shared CSS ✅ (commit be2d732, 2026-05-05)
Tokens, base body, 3-circle gradient bg, floating-pill nav, section/form/FAQ patterns, and orange footer all live in `/branding/site.css`. Each page links the shared file and keeps its page-specific styles inline.

### Phase 2 — Replace homepage ✅ (commits 6cddbad → a5a871f, 2026-05-05/06)
- [x] index.html migrated to shared CSS + new visual structure (preserves calendar JS, Supabase wiring, newsletter popup, recaps strip)
- [x] Phudu (headings) + Archivo (body), colored horizontal logo SVG in nav, orange-block footer, green About block with GetNutz crowd photo
- [x] Calendar grid + agenda views, featured events, newsletter inline form, exit-intent popup, mobile sticky bar — all verified working
- [x] Favicon updated to new branded H mark across all 48 pages (svg + png-32 + png-180 apple-touch-icon)
- [x] Newsletter popup timing tightened: desktop 8s, mobile 12s OR 40% scroll
- [x] GA4 form_submit event wired on inline + popup + bar (form_id, form_destination, duplicate)
- [x] Tyler review on live URL — approved 2026-05-06

### Phase 3 — Content pages ✅ (commits 5773150 → 671f993, 2026-05-06)
6 pages migrated: faq, hawaii-card-shows-guide, card-shows-oahu,
pokemon-card-shops-hawaii, host-a-show, 404. Also caught + fixed a
pre-existing host-a-show form bug (was hitting PGRST204 on every submit
because phone/location/capacity weren't columns on partner_inquiries —
now bundled into the message field).

### Phase 4 — Functional pages ✅ (commit 0473ba6, 2026-05-06)
shows/index, shops/index, recaps/index. Also refactored recaps/index.html
to render dynamically from recap-map.js (was a stale static list missing
2 of 4 published recaps). Future recaps now appear automatically the
moment they're added to the registry.

### Phase 5 — Detail pages ✅ (commits 9d38ce5 → f8ef1ff, 2026-05-06)
33 pages: shows/show.html (dynamic), shows/paradise-card-show.html,
shows/toylynx-trade-night.html, 26 shop pages, 4 recap pages +
recaps/_TEMPLATE.html. Per-shop accent palettes preserved (TCG Tavern's
purple, etc). Option B hero pattern (.recap-hero-banner, .stats-bar)
promoted to /branding/site.css so future recaps inherit it without
inline CSS. Applied to Keep It Aloha, GetNutz, Paradise, Moiliili
(Moiliili has no banner since no photos uploaded yet).

### Phase 6 — Email templates ✅ (commit 09f2e9a, 2026-05-06)
welcome-email.html (Buttondown autoresponder) and
functions/api/generate-newsletter.js (weekly newsletter HTML) both on
the new brand. Logo PNG (logo-horizontal-white.png) added at /branding/
since email clients can't render SVG. Phudu/Archivo with Arial fallback
via @import + inline stacks. Bonus fix: welcome-email.html had a broken
`{unsubscribe_url}` (single braces) — corrected to Buttondown's Liquid
`{{ unsubscribe_url }}` syntax.

- [ ] **Tyler:** upload welcome-email.html to Buttondown as autoresponder + send a `?preview=1` test newsletter to verify Gmail / Apple Mail / Outlook all render correctly before the next Mon 9 AM HST send

## Other items still on hold for branding

- [ ] **Set up Sunday 10 PM calendar reminder** — needs NEWSLETTER_SECRET for the URL (we have the secret now in .env)

## Waiting on Others

- [ ] **Keep It Aloha Card Show #2 (July 4-5)** — Waiting on flyer + venue from Kamaka. Event is live with TBA venue.
- [ ] **West Side Card Show (June 6-7)** — Need details from Tyler
- [ ] **2 June Maui shows** — Waiting on @juanguyscollection
- [ ] **ToyLynx new events** — Waiting on Jack
- [ ] **Pau Hana rescheduled event** — Waiting on Hamajang + Satoshi details
- [ ] **Branding SVGs + new color scheme** — Waiting on designer
- [ ] **Shop page reviews** — Ongoing feedback collection
- [ ] **Maui Sports Cards trade night cadence** — Watch for pattern. If they start trade nights on a regular schedule, convert to recurring event instead of one-offs.

## Backlog — Ready to Build

- [ ] **"West Side broke the internet" Max Holloway video** (Tyler 2026-06-08, PARKED). The scene was huge — lines out the door, vibes immaculate. Tyler's call: it'll feel more authentic from a **local-creator voice** than from him (doesn't follow UFC, isn't the "average local kid on Oahu" voice). **Play:** pitch it as a creator collab — @sarukofamcollects or another local creator narrates/stars, HCS produces/distributes. Hold until the right voice is lined up; don't force it from the brand account.
- [ ] **Per-show "Moments" archive gallery** (Tyler 2026-06-08). Natural extension of the "Send Us Your Moments" campaign + the From the Floor system. Once community clips start flowing, build a permanent moments gallery on each show's page (mirrors `walkthroughs.js` registry pattern — likely a `moments.js` keyed by show/recap slug). Turns submissions into a lasting archive, not just one-time recap features.

- [ ] **More themed landing pages** — /pokemon-card-shops-hawaii, /card-shows-oahu, /card-shows-maui as separate SEO landing pages (optional next tier)
- [ ] **Consistent recap publishing habit** — template + checklist are done (recaps/_TEMPLATE.html, recaps/CHECKLIST.md). Publish within 3-5 days of each major show.
- [ ] **Admin dashboard improvements** — Better event management in missingno.html
- [ ] **"Add to Calendar" buttons** on show pages (iCal / Google Calendar export)
- [ ] **Deep analytics dashboard** in admin panel
- [ ] **Newsletter popup** enhancements — A/B test copy, track conversion rate
- [ ] **Welcome email sequence — add tips & tricks email** (Tyler 2026-05-06). The 3-email sequence is shipped (Day 0 / 7 / 21). A great place to inject a "how to get the most out of a Hawaii card show" email — possibly between #2 and #3 (Day 14). Content idea: arrive early, what cash to bring, how to negotiate, what to bring to a trade night, etiquette, kid-friendly tips. Tyler's POV adds authenticity here.
- [ ] **"Guide to going to a card show" guide** (Tyler 2026-05-06). Create a long-form guide page (likely `/how-to-attend-a-card-show.html` or extend `/hawaii-card-shows-guide.html`) covering: what to expect, what to bring, how to vendor for the first time, how trade nights differ from card shows, kid-friendly considerations, vendor etiquette. Pure SEO play targeting "how to attend a card show" / "first time card show tips" / "card show vendor guide" queries. Reusable in the welcome email sequence (above) once written. **Note 2026-05-13:** the `/what-is-a-card-show.html` pillar and `/card-show-etiquette.html` companion now cover most of this. This backlog item can probably be closed or merged into the pillar; revisit when reviewing content gaps.

- [ ] **External backlinking workflow** (Tyler 2026-05-13). The internal linking foundation is solid (May 13 — pillar + etiquette + series pages + recaps now cross-link properly). The bigger ranking lever from here is external backlinks pointing to hawaiicardshows.com. The [Press kit page](press.html) is the foundation. Workflow to build:
  - **Tier 1 targets** (hobby press, immediate fit): Beckett, The Hobby News Daily, Cardboard Connection, Card Talk Podcast, Probably Magic, sports-card podcasts (Money Card Pod, Sports Card Investor)
  - **Tier 2 targets** (community / niche): r/sportscards mod outreach, r/PokemonTCG mod outreach, Hawaii-specific Pokemon Discord servers and Facebook groups
  - **Tier 3 targets** (Hawaii business / lifestyle press): Honolulu Magazine, Pacific Business News, Star-Advertiser business desk, Hawaii Public Radio (lifestyle segment angle), Frolic Hawaii (food/culture overlap with Bayview)
  - **Outreach template**: short pitch email, includes 3 angles (hobby-growth story, Hawaii-local story, founder story), links to press kit + a recent recap. Save as `outreach-template.md` in the repo or as a draft in Buttondown.
  - **Tracking**: simple sheet — outlet, contact, angle pitched, date sent, response, follow-up date. Even a Google Doc works for now.
  - **Cadence**: 3-5 pitches/week is plenty. Quality + relevance > volume. Each landed backlink from a relevant outlet is worth more than 50 spammy ones.
  - **Bonus play**: vendor and organizer relationships are *also* a backlink play. Ask Kamaka, Javin, PKMN Collective, Maui Sports Cards, Bubbah's Toy Box if they'd link to their series page from their Linktree / website. Free, high-relevance, easy ask.

## Recently Completed

- [x] **June 8 session: recap workflow refined + full week content package built** (2026-06-08).
  - **CMO analytics briefing** pulled live: **7,652 sessions / 4,045 users last 30d (+75% / +79% MoM)** — third straight doubling-class month. 72% organic search, 75% Hawaii, 83% mobile. West Side series page already #3 sitewide (1,126 views) off the Max Holloway promo. Newsletter **110 subscribers** (~4x in 6 weeks), opens holding **48–55%** while the list grows. New report script: [.agents/scripts/cmo_report.py](.agents/scripts/cmo_report.py) (30d-vs-prior + MoM).
  - **Workflow refined:** committed [print/render-slides.sh](print/render-slides.sh) (one-command headless-Chrome slide→PNG render — no more reconstructing from git history) + [recaps/RECAP-KIT.md](recaps/RECAP-KIT.md) (master playbook tying recap page → blast → carousel → stories into one package from one input set).
  - **Two recap pages drafted** (DRAFT banners list exactly what to fill): [recaps/west-side-show-iii-june-2026.html](recaps/west-side-show-iii-june-2026.html) (flagship — Max Holloway lede) + [recaps/keep-it-aloha-june-2026.html](recaps/keep-it-aloha-june-2026.html). Both wired for SEO/schema/links/walkthrough module; serve 200, all internal links resolve. **Gated on:** floor numbers (vendor/attendance/moments) + photos.
  - **Week email blast drafted:** [emails/blasts/blast-recap-big-weekend-june-2026.html](emails/blasts/blast-recap-big-weekend-june-2026.html) — 3-show weekend recap + Bayview (Tue Jun 16) week-ahead kickoff. UTM'd, single-focus CTAs. **Send Tue–Wed** (weekly already auto-sent Mon Jun 8). Gated on recaps going live + HCS Team note from Tyler.
  - **3-show carousel + stories rendered:** now in [recaps/social/2026-06-09-big-week-carousel/](recaps/social/2026-06-09-big-week-carousel/) (5 slides, 1080×1350) + [recaps/social/2026-06-09-big-week-stories/](recaps/social/2026-06-09-big-week-stories/) (5, 1080×1920). Cover → Bayview → KIA #2 → West Side/Max → CTA closer.

  **⏳ OPEN — to publish the recaps (then register + push):**
  1. Drop floor numbers + photos into both recaps (see DRAFT banners). Photo names listed there.
  2. Add to `recaps/recap-map.js` (newest first):
     - `{ slug:'west-side-show-iii-june-2026', title:'West Side Show III — Max Holloway Works the West Side', date:'2026-06-06', event_id:'b920cfb3-7168-46b6-b888-a7ec743f0a8e', thumbnail:'/recaps/images/west-side-show-iii-june-2026-max-holloway.jpg', url:'/recaps/west-side-show-iii-june-2026.html', blurb:'A UFC champ behind the table — Max Holloway vended his first card show.' }`
     - `{ slug:'keep-it-aloha-june-2026', title:'Keep It Aloha #2 — Festival Returns for a Friday Night', date:'2026-06-05', event_id:'13961a95-543a-4930-8de2-98ecf08322f9', thumbnail:'/recaps/images/keep-it-aloha-june-2026-floor.jpg', url:'/recaps/keep-it-aloha-june-2026.html', blurb:'Free for the public, all ages — the festival came back for a Friday night.' }`
  3. Add both URLs to `sitemap.xml` under `<!-- Recap pages -->`.
  4. Confirm Bayview blast date (next 1st/3rd Tue = **Jun 16**; Jun 9 is the 2nd Tue, no Bayview).
  5. When Saruko sends walkthroughs for these shows, add to `community/walkthroughs.js` with matching `recap_slug`.

  **PART 2 — Tyler's ideas built same session:**
  - **Chronology corrected:** Bayview ran the **first Tuesday (Jun 2)** and is the START of the big week that ended with West Side. Re-sequenced carousel + stories to **Bayview (kickoff) → KIA #2 (build) → West Side/Max (finale)**, and rewrote the blast to match (was wrongly forward-dating Bayview to Jun 16; June 16 is now framed as "what's next").
  - **'Send Us Your Moments' community campaign** ([recaps/social/2026-06-09-community-moments/](recaps/social/2026-06-09-community-moments/)): feed graphic + caption.txt (team voice, Saruko shoutout, DM/email/tag submission). Feeds the existing "From the Floor" system; future build = a per-show moments archive gallery. **Ready to post** (offer Tyler a signed-founder-note alternate if he prefers).
  - **100-subscriber giveaway** ([recaps/social/2026-06-09-giveaway-feed/](recaps/social/2026-06-09-giveaway-feed/) + [-giveaway-story/](recaps/social/2026-06-09-giveaway-story/)): feed + story graphics + mechanics/caption. **NEEDS Tyler:** pick the prize (CMO rec = vendor-sponsored for a partner activation/backlink) + set deadline. Then fill `[[ PRIZE ]]` / `[[ DATE ]]` in graphics + caption. Target: +25 net subs toward the 150 goal.
  - **📲 Reorg:** all IG assets now live in **[recaps/social/](recaps/social/)** — one folder per post, PNGs numbered in post order, `caption.txt` alongside, HTML in `src/`. Convention doc: [recaps/social/README.md](recaps/social/README.md). Render now outputs to a separate dir: `print/render-slides.sh <drop>/src <WxH> <drop>`. Old `print/<carousel|stories|…>-…/` folders migrated + removed. `print/` keeps shop counter-cards only.
  - **📧 Reorg:** email source files moved off the repo root into **[emails/](emails/)** (`emails/blasts/` + `emails/welcome-sequence/`, with a README). Doc links updated. **Root now holds only live, served pages** (path = URL on Cloudflare Pages, so content pages like `card-show-etiquette.html` / `faq.html` are NOT movable without a deliberate 301-redirect + sitemap + canonical migration — left as-is by design). Favicons stay at root per web convention.
  - **PARKED — "West Side broke the internet" Max video:** Tyler's instinct (good one) is it lands better from a local-creator voice, not him (he doesn't follow UFC / isn't the "average local kid" voice). Hold for a creator collab — natural fit for @sarukofamcollects or a partner. See Backlog.

- [x] **June 5-6 session: KIA #2 + West Side Max Holloway promo blitz** (2026-06-05/06). Shipped end-to-end coverage for the back-to-back weekend show:
  - **Email blast** sent via Buttondown API (we now have `BUTTONDOWN_API_KEY` in `.agents/.env`) — "Max Holloway is vending his first card show this weekend" + KIA #2 reminder. File at [emails/blasts/blast-max-holloway-westside-june-2026.html](emails/blasts/blast-max-holloway-westside-june-2026.html). Buttondown email ID `em_3petp682gr88ysgvg4hjv5pb7c`. Sent live to all subscribers.
  - **IG carousel + Stories** rendered via headless Chrome (now at `recaps/social/2026-06-06-max-holloway-promo-carousel/` + `-stories/` after the June 8 reorg; 4 slides each). Hot pattern for future cross-channel shipments. Pillar slide: Max Holloway "try your luck against the best" + KIA #2 "free for public, all ages welcome" (note: KIA #2 was paid for vendors, free for public).
  - **CRITICAL routing bug fixed** (commit `b1c494a`). The Cloudflare Pages Function at `functions/shows/[slug].js` was serving the dynamic `/shows/show.html` for EVERY `/shows/<slug>` URL — including ones with dedicated static series pages (KIA, Paradise, Bayview, West Side). Result: clicking a series link from the homepage stuck on "Loading Event..." forever. Fix: function now does explicit ASSETS.fetch for `/shows/<slug>.html` first; if 200, serve that. If 404, fall through to dynamic show.html. Verified working.
  - **West Side Show logo** added to hero + og:image + DB rows (commit `aab0ca6`, then centered in `0882d2e`). File: `shows/images/westside-card-show-logo.jpg`. Logo is only 150×150 — fine for hero, suboptimal for og:image (1200×630 ideal). Rocket Relics may have higher-res.
  - **"From the Floor" walkthrough module** (commits `c65aba5`, `be2c387`, `da361d6`) — community-contributed Instagram reels surface on recap pages via the [`community/walkthroughs.js`](community/walkthroughs.js) registry (mirrors `recap-map.js` pattern, Tyler's call: no DB table needed for one creator). First entry live: Saruko Fam Collects walkthrough of KIA #1. Section placed ABOVE the "Photos from the Show" heading on every recap. Auto-hidden when no entry matches.
  - **Newsletter signup form added to every page** (commit `f8bf7ea` — 44 files). Dark inline CTA above footer on every series page, dynamic show page, pillar, etiquette, About, Press, FAQ, Hawaii Guide, index pages, recaps, and all 26 shop pages. Each fires `form_submit` with a distinct `form_id` for per-page GA4 attribution.

  **Pattern to mirror for Monday's recap work:** recap photos go in `/recaps/images/`. Use copy command `cat path | pbcopy` to clipboard the blast HTML. After 5+ entries in `community/walkthroughs.js`, this pattern is now a documented Tyler workflow.

  **Pending creator-partner conversation:** When Saruko delivers next walkthrough, DM them with the visible payoff: "Here's the recap page where your video lives." Eventually pitch YouTube cross-post for inline playback (IG reels embed but don't autoplay; users have to click through to IG).

- [x] **In-session DB updates**:
  - **PKMN Collective Trade Night deleted** (event id `4e49041f-…`, commit `9afd4c8`) — separate from Bayview Night Market, which stays.
  - **West Side Show I, III, IV `logo_url`** set to the new logo URL via API (2026-06-05).
  - **June Pop Swap added** (event id `40a8bcd4-…`) — Bubbah's Toy Box, Kauai, 2026-06-13.

- [x] **Show-series static pages — pattern established** (2026-05-04). New routing model: events whose `name` matches a key in `HCS_SERIES_URLS` (in [index.html](index.html) and [shows/show.html](shows/show.html)) route to a hand-built static page; the page hydrates upcoming/past slots from Supabase via name match. Homepage carousel/calendar/agenda link the right destination automatically. Dynamic `/shows/show.html?id=...` redirects to the series page when an event matches. SEO consolidates on the static URL via canonical. Two pages shipped today:
  - [shows/keep-it-aloha.html](shows/keep-it-aloha.html) — full-bleed hero photo, dynamic next-show + upcoming + past-with-recap-pill
  - [shows/bayview-night-market.html](shows/bayview-night-market.html) — purple PKMN gradient hero (no landscape photo yet), dynamic 1st & 3rd Tuesday calculator, "From the Floor" portrait photo block
- [x] **Next series candidates** (in priority order, drawn from GA traffic): TCG Tavern Trade Day (51 IG clicks/30d), Sports Cards & Collectibles Show (Lance), Hilo Collectible Show, Space 62 Trade Night, Paradise Card Show (currently a static page but no dynamic upcoming/past — would benefit from the new pattern). Each one is ~30-45 min once the photo + copy are gathered.
- [x] **GA4 monthly analytics report — May 2026** (2026-05-04). 4,116 sessions / 2,144 active users in the past 30 days, vs 217 in prior 30. Real growth: ~85 → ~250 daily sessions. 72% organic search, 79% Hawaii audience, 80% mobile. Show detail pages drove 2,216 views and 379 outbound clicks (mostly organizer Instagrams — we're a real vendor discovery engine). Top series by traffic: Keep It Aloha, TCG Tavern Trade Day, Sports Cards & Collectibles, Bayview Night Market, Hilo Collectible Show.
- [x] **Newsletter funnel measurement** (2026-05-06) — `form_submit` event now fires from all three subscribe entry points with custom params `form_id` (newsletter-inline / newsletter-popup / newsletter-bar), `form_destination`, and `duplicate`. Build a GA4 explore by `form_id` after ~7 days of data to compare conversion by surface.
- [x] **noindex `/preview.html`** (2026-05-06) — was carrying both noindex AND index meta tags from a head-block copy. Removed the conflicting `index, follow` so the noindex is unambiguous. Search Console should drop the page on next crawl.
- [x] Keep It Aloha #1 recap published — Kamaka approved 2026-05-04. Live with hero banner (Option B: show-floor.JPG full-bleed), 50 vendors / 5,000+ attendees stat split, full gallery, and links to the next two shows (June 5 placeholder + July 4-5).
- [x] Newsletter timing incident fixed — 2026-04-27. The Apr 27 send was scheduled for May 4 (a week late) due to two bugs: (1) `getNextMonday9amHst` returning NEXT Monday when run on a Monday, and (2) GitHub Actions cron drift pushing the run from Sunday evening into Monday morning HST. Fix: rewrote date logic to target the soonest Monday 9 AM HST (today if before 9 AM Mon, else next Mon), shifted event window to start from the send date instead of generation date, and moved the cron from `0 4 * * 1` (Mon 4 UTC) to `0 22 * * 0` (Sun 22 UTC) for ~21 hours of drift buffer. Existing scheduled email on Buttondown was converted to draft so it won't auto-send.
- [x] Fixed Moiliili recap broken images with "Photos coming soon" placeholder — 2026-04-22
- [x] Recap architecture: recap-map.js registry, "Latest From Hawaii" homepage strip, auto-link recaps on show detail pages, kept Recaps out of main nav — 2026-04-22
- [x] First recap published via new template workflow: GetNutz x Paradise Show (April 19, 2026) with 6 photos in repo — 2026-04-22
- [x] AI-SEO content: /faq.html (14 Q&As), /hawaii-card-shows-guide.html (long-form anchor), /recaps/_TEMPLATE.html + CHECKLIST.md — 2026-04-21
- [x] AI-SEO foundation: llms.txt, AI crawler allowlist, FAQ schema, enriched Organization schema — 2026-04-20
- [x] Featured events section on homepage ("Don't Miss These") — 2026-04-16
- [x] RSS feed at /feed.xml — 2026-04-16
- [x] Bayview Night Market marked as featured event — 2026-04-16
- [x] Maui Sports Cards Trade Night (Apr 25) + Card Show (May 30) added — 2026-04-19
- [x] 6th Collector Megalopolis (May 23-24) added with flyer — 2026-04-18
- [x] Keep It Aloha #2 (July 4-5) added with TBA venue — 2026-04-19
- [x] Space 62 Collectibles Show (June 26-28) added to database — 2026-04-15
- [x] Newsletter exit-intent popup (desktop) + sticky bottom bar (mobile) — 2026-04-15
- [x] Big Island Breaks page updated to Pokemon-focused — 2026-04-15
- [x] Big Island Breaks show link added to shop page
- [x] Newsletter redesign: grouped by island with unique event colors
- [x] Subscribe endpoint: handle suppressed subscribers, bypass Buttondown firewall
