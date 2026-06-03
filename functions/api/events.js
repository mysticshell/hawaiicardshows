// Public events API — returns approved events as JSON for partner integrations.
//
// GET /api/events
//   ?days=N      Window size in days from today (default 90, max 365)
//   ?island=X    Filter by island (Oahu, Maui, Big Island, Kauai)
//   ?type=X      Filter by event_type (one-time, annual, recurring, music)
//
// Edge-cached for 5 minutes so polling doesn't hammer Supabase. Use a
// conditional GET (If-None-Match / If-Modified-Since) if you want
// efficient long-poll behavior — Cloudflare honors both at the edge.
//
// Schema for each event in the `events` array:
//   id              UUID
//   slug            URL-safe slugified name (use for /shows/<slug>)
//   name            Display name
//   organizer       Organizer / brand name
//   event_type      "one-time" | "annual" | "recurring" | "music"
//   recurrence      Recurrence pattern (e.g. "Every 1st & 3rd Tuesday"),
//                   null for non-recurring
//   start_date      ISO date "YYYY-MM-DD" or null for ongoing/recurring
//   end_date        ISO date or null
//   start_time      "HH:MM" 24h or null
//   end_time        "HH:MM" 24h or null
//   venue           Venue name + address
//   island          One of: Oahu, Maui, Big Island, Kauai, Molokai, Lanai
//   description     Short event description
//   instagram       IG handles, comma-separated
//   logo_url        Hero image URL (event flyer or organizer logo)
//   featured        Boolean — true if curated/promoted on the homepage
//   url             Canonical URL on hawaiicardshows.com
//
// Example:
//   curl "https://hawaiicardshows.com/api/events?days=60&island=Oahu"

const SUPABASE_URL = 'https://bcdgqqncycsdwnmrmuan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZGdxcW5jeWNzZHdubXJtdWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTU4MzgsImV4cCI6MjA5MDEzMTgzOH0.UXTTv99cBYcll_uw-g50tA4yG9jpbVIdt3xrDc_rTKs';

function slugify(s) {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[‘’'ʻ]/g, '')
    .replace(/[&+]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Series-page overrides — these events have hand-built static pages
const SERIES_URLS = {
  'keep it aloha card show': '/shows/keep-it-aloha',
  'keep it aloha card show — 2nd edition': '/shows/keep-it-aloha',
  'bayview night market': '/shows/bayview-night-market',
  'paradise card show': '/shows/paradise-card-show',
  'west side show': '/shows/west-side-show',
  'west side show iii': '/shows/west-side-show',
  'west side show iv': '/shows/west-side-show',
  'toylynx trade night': '/shows/toylynx-trade-night',
};

function urlFor(e) {
  if (e.custom_url) return e.custom_url;
  const series = SERIES_URLS[(e.name || '').toLowerCase().trim()];
  if (series) return series;
  const slug = slugify(e.name);
  return slug ? `/shows/${slug}` : `/shows/show.html?id=${e.id}`;
}

// Build a Headers object with all the standard headers we want on every response.
// Using `new Headers()` explicitly (rather than spreading into a plain object) so
// Cloudflare Workers honors them and doesn't override Content-Type via inference.
function buildHeaders({ json = true, cacheSeconds = 300 } = {}) {
  const h = new Headers();
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type');
  h.set('Vary', 'Accept-Encoding');
  if (json) h.set('Content-Type', 'application/json; charset=utf-8');
  if (cacheSeconds > 0) h.set('Cache-Control', `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`);
  return h;
}

function jsonResponse(body, status = 200, cacheSeconds = 300, { headOnly = false } = {}) {
  return new Response(headOnly ? null : JSON.stringify(body, null, 2), {
    status,
    headers: buildHeaders({ json: true, cacheSeconds }),
  });
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // CORS preflight + method guard
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: buildHeaders({ json: false, cacheSeconds: 0 }) });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return jsonResponse({ error: 'Method not allowed', allowed: ['GET', 'HEAD', 'OPTIONS'] }, 405, 0);
  }
  // HEAD: per the HTTP spec, return identical headers to GET but with no body.
  // Letting it flow through to GET handling, we'll drop the body at the end.
  const isHead = request.method === 'HEAD';

  // Param parsing with defensive defaults
  const daysRaw = parseInt(url.searchParams.get('days') || '90', 10);
  const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(365, daysRaw)) : 90;
  const islandFilter = url.searchParams.get('island') || null;
  const typeFilter = url.searchParams.get('type') || null;

  // Validate enum filters so we don't silently return everything when a typo is passed
  const VALID_ISLANDS = ['Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai'];
  const VALID_TYPES = ['one-time', 'annual', 'recurring', 'music'];
  if (islandFilter && !VALID_ISLANDS.includes(islandFilter)) {
    return jsonResponse({ error: 'Invalid island filter', valid: VALID_ISLANDS }, 400, 0);
  }
  if (typeFilter && !VALID_TYPES.includes(typeFilter)) {
    return jsonResponse({ error: 'Invalid type filter', valid: VALID_TYPES }, 400, 0);
  }

  // Date math: today through today+days, in Hawaii time (UTC-10, no DST)
  const nowHst = new Date(Date.now() - 10 * 3600 * 1000);
  const today = nowHst.toISOString().slice(0, 10);
  const cutoff = new Date(nowHst.getTime() + days * 86400 * 1000).toISOString().slice(0, 10);

  // Fetch from Supabase. Use an explicit field list (not select=*) so that if
  // we ever add private columns to the events table (organizer_email, internal
  // notes, etc.), they don't auto-leak through this public endpoint.
  const fields = 'id,name,organizer,event_type,recurrence,venue,island,description,start_date,end_date,start_time,end_time,instagram,logo_url,featured,custom_url';
  const sbUrl = `${SUPABASE_URL}/rest/v1/events?status=eq.approved&select=${fields}&order=start_date.asc.nullsfirst`;
  let res;
  try {
    res = await fetch(sbUrl, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
  } catch (err) {
    // Don't leak stack traces / upstream URLs in the response body.
    console.error('events API upstream fetch failed:', err);
    return jsonResponse({ error: 'Upstream data source unavailable' }, 502, 0);
  }
  if (!res.ok) {
    console.error('events API upstream non-2xx:', res.status);
    return jsonResponse({ error: 'Upstream data source returned non-2xx' }, 502, 0);
  }
  const raw = await res.json();

  // Window filter: keep recurring (no start_date) + any dated event whose range overlaps the window
  const windowed = raw.filter(e => {
    if (e.event_type === 'recurring') return true;
    if (!e.start_date) return true;
    const endDate = e.end_date || e.start_date;
    return endDate >= today && e.start_date <= cutoff;
  });

  // Optional filters
  const filtered = windowed.filter(e => {
    if (islandFilter && e.island !== islandFilter) return false;
    if (typeFilter && e.event_type !== typeFilter) return false;
    return true;
  });

  // Shape the response — strip internal columns, add computed fields
  const events = filtered.map(e => ({
    id: e.id,
    slug: slugify(e.name),
    name: e.name,
    organizer: e.organizer,
    event_type: e.event_type,
    recurrence: e.recurrence,
    start_date: e.start_date,
    end_date: e.end_date,
    start_time: e.start_time,
    end_time: e.end_time,
    venue: e.venue,
    island: e.island,
    description: e.description,
    instagram: e.instagram,
    logo_url: e.logo_url,
    featured: !!e.featured,
    url: `https://hawaiicardshows.com${urlFor(e)}`,
  }));

  return jsonResponse({
    generated_at: new Date().toISOString(),
    window_days: days,
    count: events.length,
    filters: {
      island: islandFilter,
      event_type: typeFilter,
    },
    events,
  }, 200, 300, { headOnly: isHead });
}
