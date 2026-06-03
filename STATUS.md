# Hawaii Card Shows — Project Status

*Last updated: 2026-06-03*

---

## 🔥 Active Threads (next session — pick up here)

### Collectr partnership — LIVE, awaiting Tyler reply
Adam (Collectr CEO) responded asking for an API to poll shows. **We shipped the API + delivered an email draft same-day.** Tyler is sending the reply tomorrow morning Hawaii time.

- **Endpoint:** `https://hawaiicardshows.com/api/events` (Cloudflare Pages Function at [functions/api/events.js](functions/api/events.js))
- **Status:** Deployed via commit `f4a4a50`, content-type fixed to `application/json`, full validation + edge case handling in place
- **Email draft is in the previous turn of this session** — Tyler is reviewing before sending
- **Watch for:** Adam's reply with technical questions (auth? webhooks? specific fields?) or scheduling a call. He's a CEO; expect 24-72hr turnaround
- **If he asks for more fields/webhooks/auth:** that's a buying signal — say yes and build it

### Slug URLs — clean URLs are LIVE (2nd attempt)
Tyler asked for cleaner `/shows/<slug>` URLs instead of `?id=<uuid>`. First attempt (`_redirects` with status 200) broke production with redirect loops — reverted in `b65c891`. **Second attempt using Cloudflare Pages Function works correctly** — commit `866b92f`. URLs like `/shows/pokemon-rave` now resolve via [functions/shows/[slug].js](functions/shows/[slug].js).

### Emi (recent college grad) — social media collab idea
Tyler had coffee with Emi May 31 — anime fan, wants to work in TV/marketing, has social media experience, no job this summer. I drafted three deal shapes for a win-win collab. **Tyler paused this to focus on Collectr — reminder to come back to it.** Concrete proposal queued: 2-week paid trial ($300, 5 IG posts + 1 Reel + 1 newsletter section), then $150/show per-show coverage if it works. Full thinking in TaskGet #1.

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

- [ ] **Welcome email sequence to Buttondown.** Three drafts in repo: [welcome-email.html](welcome-email.html) (Day 0), [welcome-email-2.html](welcome-email-2.html) (Day 7), [welcome-email-3.html](welcome-email-3.html) (Day 21). [WELCOME-SEQUENCE.md](WELCOME-SEQUENCE.md) has setup steps. Approved May 6 but still not uploaded.
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
