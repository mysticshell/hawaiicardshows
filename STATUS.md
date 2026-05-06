# Hawaii Card Shows — Project Status

*Last updated: 2026-05-04*

---

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

### Phase 3 — Content pages (sprint, ~1-2 hrs total)
- [ ] faq.html
- [ ] hawaii-card-shows-guide.html
- [ ] card-shows-oahu.html
- [ ] pokemon-card-shops-hawaii.html
- [ ] host-a-show.html
- [ ] 404.html

### Phase 4 — Functional pages (sprint, ~2-3 hrs)
- [ ] shows/index.html
- [ ] shops/index.html
- [ ] recaps/index.html

### Phase 5 — Detail pages (sprint, ~4-6 hrs)
- [ ] shows/show.html (dynamic — covers every event in DB)
- [ ] shows/paradise-card-show.html (static permalink)
- [ ] shows/toylynx-trade-night.html (static permalink)
- [ ] 24 shop pages: shops/{aloha-card-shop, 808-showcase, big-island-breaks, box-jellyz, best-of-the-best, iwingames, space-62, da-planet, paulas-sports-cards, other-realms, evolving-realms, from-the-heart, dragons-lair, windward-collectibles, armchair-adventurer, toylynx, tcg-tavern, tcg-hawaii, 4-pillars, gam3-escape, slow-your-roll, maui-sports-cards, yocards, bubbahs-toy-box, crows-nest, hi-collector}.html
- [ ] 4 recap pages + recaps/_TEMPLATE.html
  - **Apply Option B hero pattern across all recaps** — full-bleed photo banner at top, headline + meta below, 2-stat side-by-side bar. Pattern is dialed in on `recaps/keep-it-aloha-may-2026.html` (currently draft/noindex). Use that as the reference when porting to Paradise, Moiliili, GetNutz, and the template.

### Phase 6 — Email templates (~1-2 hrs)
- [ ] welcome-email.html (Buttondown autoresponder)
- [ ] functions/api/generate-newsletter.js (newsletter HTML)
- [ ] Once email rebrand done: upload welcome-email.html to Buttondown as autoresponder + test newsletter generator end-to-end

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

## Recently Completed

- [x] **Show-series static pages — pattern established** (2026-05-04). New routing model: events whose `name` matches a key in `HCS_SERIES_URLS` (in [index.html](index.html) and [shows/show.html](shows/show.html)) route to a hand-built static page; the page hydrates upcoming/past slots from Supabase via name match. Homepage carousel/calendar/agenda link the right destination automatically. Dynamic `/shows/show.html?id=...` redirects to the series page when an event matches. SEO consolidates on the static URL via canonical. Two pages shipped today:
  - [shows/keep-it-aloha.html](shows/keep-it-aloha.html) — full-bleed hero photo, dynamic next-show + upcoming + past-with-recap-pill
  - [shows/bayview-night-market.html](shows/bayview-night-market.html) — purple PKMN gradient hero (no landscape photo yet), dynamic 1st & 3rd Tuesday calculator, "From the Floor" portrait photo block
- [x] **Next series candidates** (in priority order, drawn from GA traffic): TCG Tavern Trade Day (51 IG clicks/30d), Sports Cards & Collectibles Show (Lance), Hilo Collectible Show, Space 62 Trade Night, Paradise Card Show (currently a static page but no dynamic upcoming/past — would benefit from the new pattern). Each one is ~30-45 min once the photo + copy are gathered.
- [x] **GA4 monthly analytics report — May 2026** (2026-05-04). 4,116 sessions / 2,144 active users in the past 30 days, vs 217 in prior 30. Real growth: ~85 → ~250 daily sessions. 72% organic search, 79% Hawaii audience, 80% mobile. Show detail pages drove 2,216 views and 379 outbound clicks (mostly organizer Instagrams — we're a real vendor discovery engine). Top series by traffic: Keep It Aloha, TCG Tavern Trade Day, Sports Cards & Collectibles, Bayview Night Market, Hilo Collectible Show.
- [x] **Newsletter funnel measurement** (2026-05-06) — `form_submit` event now fires from all three subscribe entry points with custom params `form_id` (newsletter-inline / newsletter-popup / newsletter-bar), `form_destination`, and `duplicate`. Build a GA4 explore by `form_id` after ~7 days of data to compare conversion by surface.
- [x] **noindex `/preview.html`** (2026-05-06) — was carrying both noindex AND index meta tags from a head-block copy. Removed the conflicting `index, follow` so the noindex is unambiguous. Search Console should drop the page on next crawl.
- [x] Keep It Aloha #1 recap published — Kamaka approved 2026-05-04. Live with hero banner (Option B: show-floor.JPG full-bleed), 70+ vendors / 5,000+ attendees stat split, full gallery, and links to the next two shows (June 5 placeholder + July 4-5).
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
