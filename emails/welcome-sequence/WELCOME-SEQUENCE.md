# Welcome Email Sequence

Three drop-in emails for the new-subscriber drip. Upload to Buttondown as autoresponders.

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| 1 | [welcome-email.html](welcome-email.html) | Day 0 (immediate, on subscribe) | Welcome + set expectations |
| 2 | [welcome-email-2.html](welcome-email-2.html) | Day 7 | Surface the most recent recap + nudge engagement |
| 3 | [welcome-email-3.html](welcome-email-3.html) | Day 21 | Convert passive readers into vendors / organizers / partners |

## Buttondown setup (per email)

1. Buttondown dashboard → **Automations** → **New automation**
2. Trigger: **subscribed to the newsletter**, delay = 0 / 7 / 21 days
3. Subject lines (suggested):
   - Email 1: `Aloha — welcome to Hawaii Card Shows`
   - Email 2: `What you just missed in Hawaii cards`
   - Email 3: `Want to be more involved?`
4. Paste the HTML body from the file. Buttondown will preserve the inline styles.
5. Save as **Active**.

## UTM tracking

Every link in emails 2 + 3 is pre-tagged:
- `utm_source=newsletter`
- `utm_medium=email`
- `utm_campaign=welcome-2` (or `welcome-3`)
- `utm_content=...` (per-link: header-logo, recap-cta, submit-card, etc.)

So return-traffic shows up in GA4 as a distinct campaign — track open-to-click conversion per email.

## What needs occasional refresh

**Email 2** has a "Most recent recap" callout that's currently hardcoded to the Keep It Aloha May 2026 recap. When a newer recap publishes, swap the title/blurb/URL in the recap-card section (one block, ~10 lines). Keep this as a quarterly maintenance task — or extend the welcome generator to pull it dynamically later.

Emails 1 and 3 are evergreen — no per-send maintenance needed.

## When to add email 4 (later)

Watch the GA4 funnel. If `welcome-3` clicks-through-to-submit converts well, sequence is done. If subscribers churn within 30 days without engaging, add a Day 14 "What's coming up this month" email between #2 and #3.
