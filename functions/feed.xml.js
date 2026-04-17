const SUPABASE_URL = 'https://bcdgqqncycsdwnmrmuan.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZGdxcW5jeWNzZHdubXJtdWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTU4MzgsImV4cCI6MjA5MDEzMTgzOH0.UXTTv99cBYcll_uw-g50tA4yG9jpbVIdt3xrDc_rTKs';

function esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00-10:00');
  return d.toUTCString();
}

export async function onRequestGet() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events?status=eq.approved&or=(end_date.gte.${today},and(end_date.is.null,start_date.gte.${today}))&order=start_date.asc&limit=50`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const events = await res.json();

    const items = events.map(ev => {
      const link = ev.custom_url
        ? `https://hawaiicardshows.com${ev.custom_url}`
        : `https://hawaiicardshows.com/shows/show.html?id=${ev.id}`;
      const desc = ev.description || `${ev.name} at ${ev.venue || 'TBD'}`;
      const dateRange = ev.end_date && ev.end_date !== ev.start_date
        ? `${ev.start_date} to ${ev.end_date}`
        : ev.start_date || '';
      const timeRange = ev.start_time
        ? ` | ${ev.start_time}${ev.end_time ? ' - ' + ev.end_time : ''}`
        : '';
      const location = ev.venue ? ` | ${ev.venue}` : '';
      const island = ev.island ? ` (${ev.island})` : '';

      return `    <item>
      <title>${esc(ev.name)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(ev.id)}</guid>
      <description>${esc(desc + location + island)}</description>
      <category>${esc(ev.island || 'Hawaii')}</category>
      <pubDate>${fmtDate(ev.start_date || today)}</pubDate>
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hawaii Card Shows</title>
    <link>https://hawaiicardshows.com</link>
    <description>Upcoming trading card shows, trade nights, and collectibles events across the Hawaiian Islands.</description>
    <language>en-us</language>
    <atom:link href="https://hawaiicardshows.com/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return new Response('<?xml version="1.0"?><rss version="2.0"><channel><title>Error</title></channel></rss>', {
      status: 500,
      headers: { 'Content-Type': 'application/rss+xml' },
    });
  }
}
