# Hawaii Card Shows — Public API

A small, edge-cached JSON API for partners to integrate Hawaii's trading
card show calendar into their own apps and services. Built for partners
like Collectr who want to surface local meetups inside their products.

## Base URL

```
https://hawaiicardshows.com/api/
```

No authentication required. CORS-open (`Access-Control-Allow-Origin: *`),
so frontend code can hit it directly. Edge-cached for 5 minutes — poll at
any cadence without worrying about rate limits.

## Endpoints

### `GET /api/events`

Returns the list of approved upcoming events in JSON.

#### Query parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | int (1–365) | `90` | Window size from today |
| `island` | string | — | Filter to one island: `Oahu`, `Maui`, `Big Island`, `Kauai`, `Molokai`, `Lanai` |
| `type` | string | — | Filter to one event type: `one-time`, `annual`, `recurring`, `music` |

Invalid filter values return HTTP 400 with the valid options listed.

#### Response shape

```json
{
  "generated_at": "2026-06-03T21:10:00.000Z",
  "window_days": 90,
  "count": 24,
  "filters": {
    "island": "Oahu",
    "event_type": null
  },
  "events": [
    {
      "id": "6d0b7dda-e98a-450c-b35c-aadd146cda16",
      "slug": "pokemon-rave",
      "name": "Pokemon Rave",
      "organizer": "Escapism / HNL Card Fest",
      "event_type": "music",
      "recurrence": null,
      "start_date": "2026-07-17",
      "end_date": "2026-07-17",
      "start_time": "22:00",
      "end_time": null,
      "venue": "Eve Ala Moana",
      "island": "Oahu",
      "description": "An immersive audio-visual Pokemon experience…",
      "instagram": "@evealamoana, @hnlcardfest",
      "logo_url": null,
      "featured": false,
      "url": "https://hawaiicardshows.com/shows/pokemon-rave"
    }
  ]
}
```

#### Per-event field reference

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Stable identifier |
| `slug` | string | URL-safe slug; matches the path component of `url` |
| `name` | string | Display name |
| `organizer` | string | Brand or person running the event |
| `event_type` | enum | `one-time` (single date), `annual` (recurring brand with specific dates), `recurring` (weekly/monthly pattern), `music` (music event with TCG audience overlap) |
| `recurrence` | string | Free-text pattern for `recurring` types, e.g. `"Every 1st & 3rd Tuesday"`. Null otherwise. |
| `start_date` / `end_date` | ISO date | `YYYY-MM-DD`. Null for ongoing recurring events. |
| `start_time` / `end_time` | string | 24-hour `HH:MM`. Null when not specified. |
| `venue` | string | Venue name + address |
| `island` | enum | One of the 6 island values |
| `description` | string | Short blurb |
| `instagram` | string | Comma-separated IG handles |
| `logo_url` | URL | Hero image (flyer or logo). May be null. |
| `featured` | bool | True if currently promoted on the homepage's "Don't Miss These" section |
| `url` | URL | Canonical URL of the event's detail page on hawaiicardshows.com |

#### Methods supported

- `GET` — returns event list as above
- `HEAD` — returns headers only (no body), useful for cache validation
- `OPTIONS` — CORS preflight

All other methods return HTTP 405.

#### Caching

- Response includes `Cache-Control: public, max-age=300, s-maxage=300`
- Cloudflare's edge cache serves identical query-string variants from cache for up to 5 minutes
- Recommended polling cadence: every 15 minutes for production, every 5 minutes for testing

#### Error responses

All errors return JSON in the same content-type:

```json
{ "error": "Invalid island filter", "valid": ["Oahu", "Maui", "Big Island", "Kauai", "Molokai", "Lanai"] }
```

| Status | When |
|--------|------|
| 400 | Invalid `island` or `type` filter value |
| 405 | HTTP method other than GET/HEAD/OPTIONS |
| 502 | Upstream data source (Supabase) unreachable or returned non-2xx |

## Examples

```bash
# All upcoming events for the next 60 days on Oahu
curl "https://hawaiicardshows.com/api/events?days=60&island=Oahu"

# Music events only (e.g. Pokémon-themed raves)
curl "https://hawaiicardshows.com/api/events?type=music"

# Big Island events only
curl "https://hawaiicardshows.com/api/events?island=Big%20Island"

# Just check headers (e.g. last-modified for cache validation)
curl -I "https://hawaiicardshows.com/api/events"
```

## Roadmap / open questions for partners

Things we can add quickly if partners ask:

- **Webhook on new event** — fire a POST to a partner URL when a new approved event lands
- **Diff endpoint** — `GET /api/events/changed?since=<timestamp>` for efficient sync
- **Per-event detail endpoint** — `GET /api/events/:id` if partners need full payload separately
- **Past event archive** — events that have already happened (currently filtered out by the date window)
- **Authentication** — currently open, could add API keys per partner if abuse becomes a problem

Contact `tyler@hawaiicardshows.com` to propose changes or coordinate integrations.
