// Weekly newsletter generator for Hawaii Card Shows.
// Queries Supabase for upcoming events and creates an email in Buttondown.
//
// Default behavior: creates a DRAFT email for manual review.
// With confirm=1 and send_at: creates a SCHEDULED email to send at send_at.
//
// Query params:
//   secret   (required)  — must match NEWSLETTER_SECRET env var
//   days     (optional)  — window size, default 7, max 30
//   preview  (optional)  — ?preview=1 returns rendered HTML instead of creating draft
//   dry      (optional)  — ?dry=1 returns JSON summary without hitting Buttondown
//   title    (optional)  — override the post title / subject
//   confirm  (optional)  — ?confirm=1 publishes as "scheduled" (auto-send) instead of draft
//   send_at  (optional)  — ISO 8601 timestamp for Buttondown to schedule delivery
//                          (only used with confirm=1; defaults to "next Monday 9 AM HST" if omitted)

const BRAND = {
  green: '#1a6b5a',
  orange: '#d4582a',
  cream: '#f5f0e8',
  sand: '#e8e0d0',
  ink: '#1a1a1a',
  text: '#444444',
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  // --- Auth ---
  const secret = url.searchParams.get('secret');
  if (!env.NEWSLETTER_SECRET || secret !== env.NEWSLETTER_SECRET) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const days = Math.max(1, Math.min(30, Number(url.searchParams.get('days')) || 7));
    const preview = url.searchParams.get('preview') === '1';
    const dry = url.searchParams.get('dry') === '1';
    const confirm = url.searchParams.get('confirm') === '1';
    const sendAtParam = url.searchParams.get('send_at');

    // --- Fetch events ---
    const events = await fetchEvents(env);

    // --- Expand window ---
    const { oneTime, recurring } = expandWindow(events, days);

    // --- Build subject + week label ---
    const startStr = getHawaiiDateStr(0);
    const endStr = getHawaiiDateStr(days - 1);
    const weekLabel = `${formatHawaiiDate(startStr, { month: 'short', day: 'numeric' })} – ${formatHawaiiDate(endStr, { month: 'short', day: 'numeric' })}`;
    const totalCount = oneTime.length + recurring.length;
    const subject = url.searchParams.get('title') || `Hawaii Card Shows — ${weekLabel}`;
    const previewText = totalCount === 0
      ? 'Quiet week coming up — check back for updates.'
      : `${totalCount} show${totalCount === 1 ? '' : 's'} this week in Hawaii.`;

    // --- Build HTML ---
    const html = buildEmail({ subject, previewText, weekLabel, totalCount, oneTime, recurring });

    // --- Preview mode ---
    if (preview) {
      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // --- Dry-run mode ---
    if (dry) {
      return json({
        ok: true,
        dry: true,
        weekLabel,
        counts: { oneTime: oneTime.length, recurring: recurring.length, total: totalCount },
        htmlBytes: html.length,
      });
    }

    // --- Safety: if confirm=1 requested but no events, fall back to draft ---
    // Don't auto-send an empty newsletter.
    const safeConfirm = confirm && totalCount > 0;
    const fellBackToDraft = confirm && !safeConfirm;

    // --- Resolve send_at: explicit param, or default to next Monday 9 AM HST ---
    let sendAt = null;
    if (safeConfirm) {
      sendAt = sendAtParam || getNextMonday9amHst();
    }

    // --- Create Buttondown email (draft or scheduled) ---
    const { postId, editUrl, status } = await createButtondownEmail(env, {
      title: subject,
      subject,
      previewText,
      html,
      confirmed: safeConfirm,
      sendAt,
    });

    return json({
      ok: true,
      postId,
      editUrl,
      status,
      weekLabel,
      counts: { oneTime: oneTime.length, recurring: recurring.length, total: totalCount },
      htmlBytes: html.length,
      scheduled: safeConfirm ? sendAt : null,
      fellBackToDraft: fellBackToDraft || undefined,
      reason: fellBackToDraft ? 'No events in window — did not auto-send' : undefined,
    });
  } catch (err) {
    console.error('generate-newsletter error:', err);
    return json({ error: err.message || 'Server error' }, 500);
  }
}

// Compute next Monday 9:00 AM HST as a UTC ISO 8601 string.
// Hawaii doesn't observe DST, so UTC-10 is always correct.
// 9 AM HST = 19:00 UTC.
function getNextMonday9amHst() {
  const nowHst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
  const day = nowHst.getDay(); // 0=Sun..6=Sat
  // Days until next Monday (if today is Monday, target next Monday, not today)
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7;
  const target = new Date(nowHst);
  target.setDate(nowHst.getDate() + daysUntilMonday);
  target.setHours(9, 0, 0, 0);
  // Convert to UTC: HST is UTC-10, so add 10 hours
  const utcHour = 19; // 9 AM HST = 19:00 UTC
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}T${utcHour}:00:00Z`;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

async function fetchEvents(env) {
  const supabaseUrl = env.SUPABASE_URL || 'https://bcdgqqncycsdwnmrmuan.supabase.co';
  const supabaseKey = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZGdxcW5jeWNzZHdubXJtdWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTU4MzgsImV4cCI6MjA5MDEzMTgzOH0.UXTTv99cBYcll_uw-g50tA4yG9jpbVIdt3xrDc_rTKs';
  const url = `${supabaseUrl}/rest/v1/events?status=eq.approved&order=start_date.asc&select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// DATE + TIME HELPERS (ports from index.html)
// ═══════════════════════════════════════════════════════════════

function getHawaiiDateStr(offsetDays = 0) {
  const now = new Date();
  const hi = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
  if (offsetDays) hi.setDate(hi.getDate() + offsetDays);
  const y = hi.getFullYear();
  const m = String(hi.getMonth() + 1).padStart(2, '0');
  const d = String(hi.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatHawaiiDate(dateStr, opts) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', opts);
}

function fmtTime(t) {
  if (!t) return '';
  const m = String(t).match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return String(t);
  const h = Number(m[1]);
  const mm = Number(m[2]);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return mm === 0 ? `${h12} ${ampm}` : `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
}

function fmtTimeRange(e) {
  if (!e.start_time) return 'TBD';
  const s = fmtTime(e.start_time);
  const en = fmtTime(e.end_time);
  return en ? `${s} \u2013 ${en}` : s;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(s, n) {
  if (!s) return '';
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '\u2026';
}

function getShowUrl(e) {
  const path = e.custom_url || `/shows/show.html?id=${e.id}`;
  return 'https://hawaiicardshows.com' + (path.startsWith('/') ? path : '/' + path);
}

// ═══════════════════════════════════════════════════════════════
// RECURRENCE LOGIC (direct port from index.html line 433)
// ═══════════════════════════════════════════════════════════════

function getEventsForDate(ds, allEvents) {
  const results = [];
  const d = new Date(ds + 'T12:00:00');
  const dow = d.getDay();
  const weekNum = Math.ceil(d.getDate() / 7);

  allEvents.forEach((ev) => {
    if (ev.skip_dates && ev.skip_dates.includes(ds)) return;

    if (ev.event_type === 'recurring') {
      const r = (ev.recurrence || '').toLowerCase();
      if (r.includes('1st') && r.includes('3rd') && r.includes('tuesday') && dow === 2 && (weekNum === 1 || weekNum === 3)) {
        results.push(ev);
      } else if (r.includes('1st') && r.includes('3rd') && r.includes('thursday') && dow === 4 && (weekNum === 1 || weekNum === 3)) {
        results.push(ev);
      } else if (r.includes('2nd') && r.includes('4th') && r.includes('thursday') && dow === 4 && (weekNum === 2 || weekNum === 4)) {
        results.push(ev);
      } else if ((r.includes('2nd weekend') || r.includes('2nd saturday')) && (dow === 6 || dow === 0) && weekNum === 2) {
        results.push(ev);
      } else if (r.includes('3rd') && r.includes('friday') && dow === 5 && weekNum === 3) {
        results.push(ev);
      } else if (r.includes('1st friday') && !r.includes('3rd') && dow === 5 && weekNum === 1) {
        results.push(ev);
      } else if (r.includes('1st saturday') && !r.includes('3rd') && dow === 6 && weekNum === 1) {
        results.push(ev);
      } else if (r.includes('1st sunday') && !r.includes('3rd') && dow === 0 && weekNum === 1) {
        results.push(ev);
      } else if (r.includes('every saturday & sunday') && (dow === 6 || dow === 0)) {
        results.push(ev);
      } else if (r.includes('last sunday') && dow === 0) {
        const nextWeek = new Date(d.getTime());
        nextWeek.setDate(d.getDate() + 7);
        if (nextWeek.getMonth() !== d.getMonth()) results.push(ev);
      }
    } else if (ev.start_date && ev.start_date <= ds && (ev.end_date || ev.start_date) >= ds) {
      results.push(ev);
    }
  });

  return results;
}

function expandWindow(allEvents, days) {
  const oneTimeMap = new Map();
  const recurringMap = new Map();

  for (let i = 0; i < days; i++) {
    const ds = getHawaiiDateStr(i);
    const evs = getEventsForDate(ds, allEvents);
    for (const e of evs) {
      if (e.event_type === 'recurring') {
        const entry = recurringMap.get(e.id) || { event: e, dates: [] };
        entry.dates.push(ds);
        recurringMap.set(e.id, entry);
      } else if (!oneTimeMap.has(e.id)) {
        oneTimeMap.set(e.id, { event: e, dateStr: ds });
      }
    }
  }

  const oneTime = [...oneTimeMap.values()].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const recurring = [...recurringMap.values()].sort((a, b) => a.dates[0].localeCompare(b.dates[0]) || a.event.name.localeCompare(b.event.name));

  return { oneTime, recurring };
}

// ═══════════════════════════════════════════════════════════════
// HTML BUILDERS
// ═══════════════════════════════════════════════════════════════

function buildEmail({ subject, previewText, weekLabel, totalCount, oneTime, recurring }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,Helvetica,sans-serif;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  ${esc(previewText)}
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f0e8;">
<tr>
<td align="center" style="padding:24px 16px;">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

${buildHeader()}
${buildIntro(weekLabel, totalCount)}
${buildDivider()}
${buildOneTimeSection(oneTime)}
${buildDivider()}
${buildRecurringSection(recurring)}
${buildDivider()}
${buildShopCta()}
${buildFooter()}

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

function buildHeader() {
  return `<tr>
<td align="center" style="background-color:#1a6b5a;padding:40px 40px 36px 40px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
    Hawaii Card Shows
  </div>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px;letter-spacing:0.5px;">
    THIS WEEK IN HAWAII CARDS
  </div>
</td>
</tr>`;
}

function buildIntro(weekLabel, totalCount) {
  const headline = totalCount === 0 ? 'Aloha!' : 'Aloha — here\u2019s your week';
  const blurb = totalCount === 0
    ? `Quiet week coming up. Check back at <a href="https://hawaiicardshows.com" style="color:#1a6b5a;text-decoration:none;font-weight:600;">hawaiicardshows.com</a> for updates.`
    : `${totalCount} show${totalCount === 1 ? '' : 's'} coming up ${esc(weekLabel)}. Mark your calendar.`;

  return `<tr>
<td style="padding:40px 40px 24px 40px;">
  <h1 style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:700;color:#1a1a1a;margin:0 0 16px 0;line-height:1.3;">
    ${headline}
  </h1>
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0;">
    ${blurb}
  </p>
</td>
</tr>`;
}

function buildDivider() {
  return `<tr>
<td style="padding:0 40px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="border-top:1px solid #e8e0d0;font-size:1px;line-height:1px;">&nbsp;</td></tr>
  </table>
</td>
</tr>`;
}

function buildOneTimeSection(oneTime) {
  const cards = oneTime.length === 0
    ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#777777;margin:0;">No one-time shows scheduled this week.</p>`
    : oneTime.map((item) => buildEventCard(item.event, item.dateStr)).join('\n');

  return `<tr>
<td style="padding:32px 40px 8px 40px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#1a6b5a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">
    This Week
  </div>
  <h2 style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 20px 0;line-height:1.3;">
    Shows coming up
  </h2>
  ${cards}
</td>
</tr>`;
}

function buildRecurringSection(recurring) {
  const rows = recurring.length === 0
    ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#777777;margin:0;">No recurring shows hitting this week.</p>`
    : recurring.map((item) => buildRecurringRow(item.event, item.dates)).join('\n');

  return `<tr>
<td style="padding:32px 40px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#1a6b5a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">
    Recurring This Week
  </div>
  <h2 style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 20px 0;line-height:1.3;">
    Regulars hitting this week
  </h2>
  ${rows}
</td>
</tr>`;
}

function buildEventCard(e, dateStr) {
  const url = getShowUrl(e);
  const dayLabel = formatHawaiiDate(dateStr, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = fmtTimeRange(e);
  const metaParts = [];
  if (e.venue) metaParts.push(esc(e.venue));
  if (e.island) metaParts.push(esc(e.island));
  const metaLine = metaParts.join(' &middot; ');
  const description = e.description ? esc(truncate(e.description, 180)) : '';

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;border:1px solid #e8e0d0;border-left:4px solid #d4582a;border-radius:8px;background:#ffffff;">
<tr>
<td style="padding:18px 20px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;color:#1a6b5a;text-transform:uppercase;letter-spacing:1.2px;">
    ${esc(dayLabel)} &middot; ${esc(timeStr)}
  </div>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#1a1a1a;margin-top:6px;line-height:1.3;">
    ${esc(e.name)}
  </div>
  ${metaLine ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666666;margin-top:4px;">${metaLine}</div>` : ''}
  ${description ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;margin-top:10px;line-height:1.6;">${description}</div>` : ''}

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
  <tr>
    <td align="center" style="background-color:#d4582a;border-radius:6px;mso-padding-alt:10px 18px;">
      <a href="${esc(url)}" style="display:inline-block;padding:10px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:6px;">
        View Show &rarr;
      </a>
    </td>
  </tr>
  </table>
</td>
</tr>
</table>`;
}

function buildRecurringRow(e, dates) {
  const url = getShowUrl(e);
  const datesLabel = dates
    .map((ds) => formatHawaiiDate(ds, { weekday: 'short', month: 'short', day: 'numeric' }))
    .join(' &middot; ');
  const timeStr = e.start_time ? fmtTimeRange(e) : (e.recurrence || 'Check IG');
  const metaParts = [];
  if (e.venue) metaParts.push(esc(e.venue));
  if (e.island) metaParts.push(esc(e.island));
  const metaLine = metaParts.join(' &middot; ');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px 0;border:1px solid #e8e0d0;border-left:4px solid #1a6b5a;border-radius:8px;background:#ffffff;">
<tr>
<td style="padding:14px 18px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;color:#1a6b5a;text-transform:uppercase;letter-spacing:1.2px;">
    ${datesLabel} &middot; ${esc(timeStr)}
  </div>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#1a1a1a;margin-top:4px;line-height:1.3;">
    <a href="${esc(url)}" style="color:#1a1a1a;text-decoration:none;">${esc(e.name)}</a>
  </div>
  ${metaLine ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666666;margin-top:2px;">${metaLine}</div>` : ''}
</td>
</tr>
</table>`;
}

function buildShopCta() {
  return `<tr>
<td style="padding:32px 40px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#1a6b5a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">
    Between Shows
  </div>
  <h2 style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 12px 0;line-height:1.3;">
    Find a card shop near you
  </h2>
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 24px 0;">
    Whether you&rsquo;re looking for packs, singles, or just want to talk cards, we&rsquo;ve got a running list of shops across the islands.
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
  <tr>
    <td align="center" style="background-color:#d4582a;border-radius:8px;mso-padding-alt:14px 32px;">
      <a href="https://hawaiicardshows.com/shops/" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.3px;">
        Find Card Shops &rarr;
      </a>
    </td>
  </tr>
  </table>
</td>
</tr>`;
}

function buildFooter() {
  return `<tr>
<td style="background-color:#1a1a1a;padding:32px 40px;border-radius:0 0 12px 12px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;margin-bottom:6px;">
        Hawaii Card Shows
      </div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;">
        Built by collectors, for collectors.
      </div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;margin-top:10px;">
        <a href="https://www.instagram.com/hawaiicardshows" style="color:#e8f4f0;text-decoration:none;font-weight:600;">@hawaiicardshows</a>
      </div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);margin-top:16px;line-height:1.6;">
        You&rsquo;re receiving this because you subscribed at hawaiicardshows.com.<br>
        <a href="{unsubscribe_url}" style="color:rgba(255,255,255,0.4);text-decoration:underline;">Unsubscribe</a>
      </div>
    </td>
  </tr>
  </table>
</td>
</tr>`;
}

// ═══════════════════════════════════════════════════════════════
// BUTTONDOWN
// ═══════════════════════════════════════════════════════════════

async function createButtondownEmail(env, { title, subject, previewText, html, confirmed, sendAt }) {
  const apiKey = env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    throw new Error('BUTTONDOWN_API_KEY not configured');
  }

  const status = confirmed ? 'scheduled' : 'draft';
  const body = {
    subject,
    body: '<!-- buttondown-editor-mode: fancy -->\n' + html,
    status,
  };
  if (confirmed && sendAt) {
    // Buttondown expects UTC ISO 8601 for publish_date
    // Convert HST offset (-10:00) to UTC if needed
    let utcDate = sendAt;
    if (sendAt.includes('-10:00')) {
      const d = new Date(sendAt);
      utcDate = d.toISOString();
    }
    body.publish_date = utcDate;
  }

  const res = await fetch('https://api.buttondown.com/v1/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Buttondown ${res.status}: ${JSON.stringify(data).slice(0, 400)}`);
  }

  const postId = data?.id;
  return {
    postId,
    status,
    editUrl: postId ? `https://buttondown.com/emails/${postId}` : null,
  };
}
