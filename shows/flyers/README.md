# Event Flyers

Drop event flyer images in this folder. They get served at `https://hawaiicardshows.com/shows/flyers/{filename}` and load fast via Cloudflare's CDN, same as the rest of the site.

## Naming convention

Use the event slug as the filename:

- `big-island-breaks-trade-night-apr-2026.jpg`
- `ya-maui-collectibles-may-2026.jpg`
- `cerulean-gym-summer-2026.jpg`
- `6th-collector-megalopolis.jpg`

Stick with `.jpg` / `.jpeg` / `.png`. Compress to under 300 KB when possible (use [TinyPNG](https://tinypng.com) or similar).

## How they get wired to events

Event pages pull from the `photos` column on the Supabase `events` table. Once the flyer is in this folder, update the event record so `photos` includes the relative URL:

```
["/shows/flyers/{filename}.jpg"]
```

Claude will usually handle this update when you tell them you've dropped a new flyer.

## Why this folder and not Supabase?

Same reason recap photos live in the repo: deploys automatically with code, version-controlled, fast Cloudflare CDN, no separate upload step. Supabase is still the right home for user-uploaded content, shop logos, and anything that might change without a code deploy.
