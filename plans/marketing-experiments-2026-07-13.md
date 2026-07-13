# Marketing Experiments — Banked for Later (drafted 2026-07-13)

**Status: DRAFTED, NOT DEPLOYED.** Tyler reviewed and liked both but paused deploying (busy work week,
can't monitor). Working tree was reverted so the live site is unchanged. Revisit when there's bandwidth
to ship + watch the numbers.

**Exact code changes are saved in `plans/marketing-experiments-2026-07-13.patch`** — re-apply with
`git apply plans/marketing-experiments-2026-07-13.patch` (or hand-edit from the specs below if the patch
has gone stale against `index.html` / `functions/api/generate-newsletter.js`).

**Why these exist:** the Jul 13 report flagged two soft spots — (1) on-site conversion rate slipping
(~0.49%), and (2) weekly newsletter opens diluting from ~66% (June) to ~53% (July) as the list grew +52%.
These two changes target exactly those.

---

## Experiment A — Homepage signup copy (conversion)

**Surfaces:** inline `.newsletter` module (`index.html` ~L192) + exit-intent popup (`~L669`). Mobile
sticky bar left as-is (space-constrained). Button label kept as "Subscribe" (the reset JS is shared with
the mobile bar, so changing it needs care — see optional micro-test below).

**Inline module — before → after:**
- H2: `Never Miss a Show` → `Every Hawaii Card Show — In One Weekly Email`
- P: `Get show announcements and community updates delivered to your inbox.`
  → `Join 180+ collectors who get the rundown of every show across the islands — plus recaps and early drops. Free, one email a week.`

**Popup — before → after:**
- H2: `Never Miss a Show` → `Never Miss a Hawaii Card Show`
- P: same weak line → `Join 180+ collectors getting the weekly rundown of every show across the islands — plus recaps and early drops. Free.`

**Rationale (3 conversion fundamentals the old copy lacked):**
1. **Social proof** — "180+ collectors" (was 189 subs on 2026-07-13; update the number before shipping).
2. **Frequency clarity** — "one email a week" kills the #1 objection (fear of spam).
3. **Specific value prop** — "every show across the islands, recaps, early drops" vs vague "community updates."

**Optional micro-test not yet made:** change button "Subscribe" → "Join Free" ("free" lifts clicks).
Skipped only because the reset JS (`doSubscribe`, `index.html` ~L712–730) hardcodes "Subscribe" and is
shared with the mobile bar ("Go"); do it carefully across all reset paths if pursuing.

**Verification done:** rendered live in local preview, copy confirmed, layout clean at 1280px.

---

## Experiment B — Weekly subject-line generator (open rate)

**File:** `functions/api/generate-newsletter.js`, `buildSubject()`.

**Problem:** old generator rotated two count-led templates (`N card shows in Hawaii this week 🃏` /
`Your week in Hawaii cards: N 🗓️`). Predictable = lower opens. Also truncated headliner at 34 chars,
mangling real show names mid-word.

**Change:** lead with the **headliner show name** (more curiosity-driving than a raw count), add benefit/
curiosity framings, keep one count-led option for variety, and widen the name limit 34 → 46 so real names
fit. Full replacement function:

```js
function buildSubject({ totalCount, oneTime, recurring, startStr }) {
  if (totalCount === 0) return 'Quiet week for Hawaii card shows — one to plan ahead for';
  const n = totalCount;
  const shows = n === 1 ? 'show' : 'shows';
  const raw = (oneTime[0] && oneTime[0].name) || (recurring[0] && recurring[0].name) || '';
  const headliner = raw ? truncate(raw, 46) : '';
  // rotate by day-of-month so back-to-back sends don't repeat the same phrasing
  const seed = parseInt(String(startStr).slice(-2), 10) || 0;
  const options = [];
  // Lead with the headliner — a specific show name is more curiosity-driving than a raw count.
  if (headliner && n > 1) {
    options.push(`${headliner} — and ${n - 1} more shows this week`);
    options.push(`Where to be this week: ${headliner} 🃏`);
    options.push(`${headliner} leads a big week of Hawaii shows`);
  } else if (headliner) {
    options.push(`This week's one to hit: ${headliner}`);
    options.push(`Your show this week — ${headliner} 🃏`);
  }
  // Benefit/curiosity framings that don't open on a number (keeps the rotation fresh).
  options.push(`Your Hawaii card weekend, sorted 🗓️`);
  options.push(`Here's where the cards are this week in Hawaii`);
  // Keep one count-led option in the mix as a fallback / variety.
  options.push(`${n} card ${shows} in Hawaii this week 🃏`);
  return options[seed % options.length];
}
```

**Sample output (5-show week, Pearlridge headliner), rotating by send date:**
- `Where to be this week: Pearlridge Sports Cards & Collectibles Show 🃏`
- `Pearlridge Sports Cards & Collectibles Show leads a big week of Hawaii shows`
- `Your Hawaii card weekend, sorted 🗓️`
- `Here's where the cards are this week in Hawaii`

**Verification done:** logic unit-tested with node across 0/1/5/6-show weeks and multiple send dates; names
fit cleanly at the 46-char limit; front-loads the specific show (what shows in mobile inbox preview).

---

## Experiment C — Re-engagement email (NOT drafted into code; concept only)

Subject-line tweaks slow dilution but won't revive the ~dormant subs. Proposed win-back send to subscribers
who haven't opened the last ~4 emails (needs a Buttondown segment on last-opened):

> **Subject:** Still into Hawaii card shows? 👀
> Hey — you signed up for the Hawaii Card Shows weekly a while back, but it's been a minute since we've seen
> you open one. No hard feelings if the hobby's cooled off. But if you're still collecting, there's a *lot*
> happening right now — [KIA drew 4,000+ this month], and the summer show calendar is stacked. **One tap keeps
> you on the list:** [Show me what's coming →]. If we don't hear from you, we'll quietly stop emailing so we're
> not cluttering your inbox.

Double duty: reactivates the interested + cleanly sunsets the gone (which *raises* open rate by trimming dead
weight). Requires a Buttondown segment (last-opened filter) to target.

---

## To ship later (checklist)
1. `git apply plans/marketing-experiments-2026-07-13.patch` (or re-edit from specs above).
2. Refresh the "180+" social-proof number to the current sub count.
3. Deploy; then watch: visitor→sub rate (Exp A) and weekly open rate (Exp B) over 2–3 sends.
4. If pursuing Exp C, build the Buttondown last-opened segment first.
