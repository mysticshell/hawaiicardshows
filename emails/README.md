# 📧 emails — newsletter source files

Email HTML that gets **uploaded/sent via Buttondown** — NOT served by the website. These live here
(not at repo root) because they're source, not public URLs. Safe to reorganize freely.

```
emails/
├── blasts/                 one-off campaign sends (recaps, announcements)
│   └── blast-<topic>-<month>.html
└── welcome-sequence/       the automated onboarding autoresponders
    ├── WELCOME-SEQUENCE.md  ← setup steps + Day 0/7/21 mapping
    ├── welcome-email.html   (Day 0)
    ├── welcome-email-2.html (Day 7)
    └── welcome-email-3.html (Day 21)
```

## Conventions
- **Blasts:** table-based, email-safe, inline styles. Always include UTM params on links, the Buttondown
  `{{ unsubscribe_url }}` token, and a "Note from the HCS Team" block (ask Tyler for the personal message).
- **Send timing:** the weekly digest auto-sends Mon ~9 AM HST — don't stack a blast the same day (Tue–Wed instead).
- After sending, log the campaign name + Buttondown email ID in `STATUS.md`.

> The **weekly newsletter** itself isn't here — it's generated dynamically by
> `functions/api/generate-newsletter.js` from the live event database, not hand-authored.
