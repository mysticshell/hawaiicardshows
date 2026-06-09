# 📦 Recap Kit — One Show, Four Channels

The master playbook. A show happened → this turns it into a full content package:
**recap page → email blast → IG carousel → IG stories**, all from one set of inputs.

`CHECKLIST.md` is the page-level detail checklist. **This file is the index** — start here.

> **Cadence rule:** publish the recap page within **3–5 days** while energy is high.
> The blast and social can follow within the same window.

---

## Step 0 — Collect the inputs (only Tyler can do this)

Everything downstream is blocked on these. Gather them once, reuse across all four channels.

**The 5 questions** (full version in `CHECKLIST.md`):
1. The ONE thing that made this show noteworthy (the lede).
2. The numbers — vendor count, attendance, admission, edition #, hours.
3. 2–3 standout moments/stories.
4. Sponsors/partners + IG handles.
5. The ONE action you want readers to take next.

**Plus:**
- 4–8 photos → `/recaps/images/` (see naming below)
- Organizer + sponsor IG handles
- Any direct quotes

📸 **Photo naming:** `{slug}-{descriptor}.jpg` — e.g. `west-side-show-iii-june-2026-max-holloway.jpg`.
Resize to ≤1200px wide, compress <300KB. Repo-hosted (ships with deploy, caches on Cloudflare).

🆔 **Event ID lookup** (needed for `recap-map.js`):
```bash
SUPABASE_URL=$(grep '^SUPABASE_URL=' .agents/.env | cut -d= -f2- | tr -d '"')
KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .agents/.env | cut -d= -f2- | tr -d '"')
curl -s "$SUPABASE_URL/rest/v1/events?name=ilike.*YOUR_SHOW*&select=id,name,start_date,venue" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" | python3 -m json.tool
```

---

## Channel 1 — Recap page (the hub)

The canonical, SEO-permanent asset. Everything else links back to it.

1. `cp recaps/_TEMPLATE.html recaps/{slug}.html` — fill the `{{TOKENS}}`, delete the comment block.
2. Run the **SEO & Schema** + **Final Review** sections of `CHECKLIST.md`.
3. **Register it** (this is what makes it appear sitewide — easy to forget):
   - `recaps/recap-map.js` → add an entry (slug, title, date, `event_id`, thumbnail, url, blurb).
     This auto-populates the homepage "Latest From Hawaii" strip + the matching show detail page.
   - `sitemap.xml` → add the URL under `<!-- Recap pages -->`.
4. **From the Floor** (community video): if @sarukofamcollects (or any creator) sent a walkthrough,
   add an entry to `community/walkthroughs.js` with `recap_slug` = this slug. Auto-renders, no HTML edit.
5. **Internal links** (highest SEO leverage): link the **series page** (`/shows/{series-slug}`) in the
   lead paragraph AND the bottom CTA. Link every shop mentioned to its `/shops/...` page.

---

## Channel 2 — Email blast

Model file: a prior `emails/blasts/blast-recap-*.html` (table-based, email-safe, inline styles).
Header → hero photo → headline → stats strip → **HCS Team note** → hook + CTA → "Coming Up" cards → footer.

- **Voice:** "Note from the HCS Team" / "we" — community-built, not a personal brand. **Always ask Tyler
  for a personal message** before sending (it goes in the orange callout block).
- **One focused CTA.** Click rates dilute as the list grows — don't bury the primary action.
- **UTMs on every link:** `?utm_source=newsletter&utm_medium=email&utm_campaign={campaign}&utm_content={spot}`.
- **Unsubscribe:** Buttondown Liquid `{{ unsubscribe_url }}` (double braces — single braces silently break).

⚠️ **Send-timing rule (CMO):** the weekly digest auto-sends **Monday ~9 AM HST**. Do **not** stack a
recap/promo blast on the same day — it splits opens and fatigues the list. Hold extra blasts for **Tue–Wed**.
Verify what already went out this week before scheduling:
```bash
KEY=$(grep '^BUTTONDOWN_API_KEY=' .agents/.env | cut -d= -f2- | tr -d '"')
curl -s -H "Authorization: Token $KEY" "https://api.buttondown.email/v1/emails" \
  | python3 -c "import sys,json;[print((e.get('publish_date') or '')[:10], e.get('status'),'-',e.get('subject')) for e in json.load(sys.stdin)['results'][:6]]"
```

Send via Buttondown API (draft first, review, then send). Drop the campaign + Buttondown email ID in STATUS.

---

## Channel 3 + 4 — IG carousel + Stories

All Instagram assets live in **`recaps/social/`** — see [recaps/social/README.md](social/README.md) for the
posting convention. **One folder = one IG post.** Postable PNGs (numbered in post order) + `caption.txt`
sit at the top level; HTML build files go in a `src/` subfolder so they don't clutter what Tyler posts.

```
recaps/social/<YYYY-MM-DD>-<slug>-<format>/
  01-cover.png  02-….png  …      ← numbered in POST ORDER
  caption.txt                     ← exact text to paste (run notes below a divider)
  src/  01-cover.html  …          ← build files; ignored when posting
```

- `format` = `carousel` (multi-image feed) · `stories` · `feed` (single) · `story` (single).
- Each slide sets `html, body { width/height }` to the canvas. Brand tokens: Phudu (headings) +
  Archivo (body), Ocean `#1a6b5a` / Lava `#d4582a` / Night `#1a1a1a`. Copy a prior slide as a starting point.
- A clean arc: **cover → show A → show B → … → closer/CTA**. Order the story chronologically if it's a recap.

**Render (one command — outputs numbered PNGs next to `caption.txt`):**
```bash
DROP=recaps/social/2026-06-09-big-week-carousel
print/render-slides.sh "$DROP/src" 1080x1350 "$DROP"          # carousel/feed (default size)
print/render-slides.sh "$DROP/src" 1080x1920 "$DROP"          # stories
```
Re-run after any edit; it overwrites only the matching PNG. PNGs upload straight to IG.
(Shop counter-cards are a different thing and still live in `print/`.)

---

## Definition of done

- [ ] Recap page live, registered in `recap-map.js` + `sitemap.xml`, all internal links resolve
- [ ] Blast drafted, UTM'd, HCS-Team note from Tyler, scheduled Tue–Wed (not stacked on the Monday weekly)
- [ ] Carousel + stories rendered to PNG, on brand, ready to post
- [ ] STATUS.md updated: campaign name, Buttondown email ID, what shipped
- [ ] (If applicable) creator DM'd the live recap URL where their "From the Floor" video lives

---

## Why this order

The recap page is the **hub** — it's the permanent, indexable asset every other channel points to, so it
ships first. The blast and social are **spokes** that drive traffic to it within the same 3–5 day window
while attention is peak. Building them from one shared input set keeps the numbers, photos, and voice
consistent across channels — and means one show's worth of effort produces four touchpoints.
