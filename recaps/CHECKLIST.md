# Recap Pre-Publish Checklist

Aim to publish within **3-5 days** after the show, while energy is still high and social sharing is at peak. Save this file — open it every time you do a recap.

---

## 📸 Before You Start — Gather the Materials

- [ ] 6-10 good photos from the show (crowd shots, vendor tables, standout cards, keiki moments)
- [ ] Attendance number (ask the organizer if you weren't counting)
- [ ] Vendor count
- [ ] 2-3 standout moments or stories worth calling out
- [ ] Instagram handles of organizer, sponsors, and featured vendors
- [ ] Final admission price (sometimes changes day-of)

## 🖼️ Photo Prep

- [ ] Resize photos to 1200px wide max (keeps page fast)
- [ ] Compress to <200KB each (use tinypng.com or similar)
- [ ] Upload to Supabase storage → `page-images/` bucket
- [ ] Name them `{{slug}}-photo-1.jpg` through `-photo-N.jpg` so the template tokens work

## 📝 Writing the Recap

- [ ] Copy `recaps/_TEMPLATE.html` → `recaps/{{slug}}.html` (e.g. `keep-it-aloha-july-2026.html`)
- [ ] Replace all `{{TOKEN}}` placeholders (see token list at top of template)
- [ ] Delete the big HTML comment block at the top of the template
- [ ] Lead paragraph hooks the reader — what made this show notable?
- [ ] Include at least 2 `<h2>` subheadings to break up the body
- [ ] Use the `highlight-box` for sponsor callouts (or delete if none)
- [ ] Link to the related show page (`/shows/show.html?id=...`)
- [ ] Link to featured shop pages (`/shops/...`) for every shop mentioned
- [ ] Link to the organizer's Instagram

## 🔍 SEO & Schema

- [ ] `<title>` tag: `{SHOW NAME} Recap — {DATE} | {HEADLINE}` (under 70 chars ideal)
- [ ] `meta description`: 150-160 chars, mentions show, date, venue, standout fact
- [ ] `meta keywords`: show name variants, venue, city, Pokemon/sports/TCG, recap
- [ ] `canonical` URL set to the final published URL
- [ ] Schema.org `Article` `datePublished` set to today (ISO format: `2026-MM-DD`)
- [ ] Schema.org `Event` `startDate` / `endDate` set to actual show date(s)
- [ ] OG tags all filled (title, description, URL)

## 🔗 Internal Linking (important for SEO)

- [ ] Add the new recap URL to `/sitemap.xml` (under `<!-- Recap pages -->`)
- [ ] Cross-link from the related show detail page (if it has a permanent page)
- [ ] Cross-link from featured shop pages that appeared at the show
- [ ] Link from next week's newsletter

## ✅ Final Review (do these in preview before pushing)

- [ ] Load the page in preview — no broken images, no placeholder text left
- [ ] Click every internal link — none 404
- [ ] Mobile width (375px) looks clean — no overflow
- [ ] Photo lightbox opens and closes properly
- [ ] Paste the URL into [Google Rich Results Test](https://search.google.com/test/rich-results) — Article + Event schemas validate
- [ ] Preview the OG card in [OpenGraph.xyz](https://www.opengraph.xyz) — looks good for social shares

## 🚀 Publish & Promote

- [ ] `git add recaps/{{slug}}.html sitemap.xml`
- [ ] `git commit -m "Add recap: {Show Name} ({Date})"`
- [ ] `git push origin main` — Cloudflare deploys in 1-3 min
- [ ] Verify the live URL loads: `https://hawaiicardshows.com/recaps/{{slug}}.html`
- [ ] Post the recap link to Instagram story with @ mentions for organizer/sponsors
- [ ] Include in the next weekly newsletter
- [ ] Reply to/thank the organizer on their recap post

---

**Rule of thumb:** one recap per meaningful show. Recurring trade nights don't need one every time — do a quarterly round-up for those. Major one-time shows, annual events, and new shows always get their own recap.
