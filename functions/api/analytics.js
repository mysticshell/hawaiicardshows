async function getGoogleToken(clientEmail, privateKey) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  const strToB64url = (str) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  const encodedHeader = strToB64url(JSON.stringify(header));
  const encodedPayload = strToB64url(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const cleanKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/gi, '')
    .replace(/-----END PRIVATE KEY-----/gi, '')
    .replace(/\\n/g, '')
    .replace(/["']/g, '')
    .replace(/\s+/g, '');
  
  const binaryKey = atob(cleanKey);
  const bytes = new Uint8Array(binaryKey.length);
  for (let i = 0; i < binaryKey.length; i++) bytes[i] = binaryKey.charCodeAt(i);

  const key = await crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(dataToSign));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const jwt = `${dataToSign}.${encodedSignature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  
  const data = await res.json();
  if (data.error) throw new Error("Google Auth Error: " + data.error_description);
  return data.access_token;
}

export async function onRequestGet({ request, env }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401 });
  }

  // 1. Verify User with Supabase (so we know they are the admin)
  const supabaseUrl = 'https://bcdgqqncycsdwnmrmuan.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZGdxcW5jeWNzZHdubXJtdWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTU4MzgsImV4cCI6MjA5MDEzMTgzOH0.UXTTv99cBYcll_uw-g50tA4yG9jpbVIdt3xrDc_rTKs';

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      'Authorization': authHeader,
      'apikey': supabaseAnonKey
    }
  });

  if (!userRes.ok) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 });
  }

  // 2. Ensure Environment Variables are configured
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ZONE_ID) {
    return new Response(JSON.stringify({ 
      error: 'Analytics not configured on server yet. Missing ENV vars.' 
    }), { status: 503 });
  }

  // 3. Fetch from Cloudflare Analytics GraphQL
  // Get data for the last 7 days
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateStr = weekAgo.toISOString().split('T')[0]; // "YYYY-MM-DD"

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${env.CLOUDFLARE_ZONE_ID}" }) {
          httpRequests1dGroups(limit: 100, filter: { date_geq: "${dateStr}" }) {
            sum {
              pageViews
            }
            uniq {
              uniques
            }
          }
        }
      }
    }
  `;

  try {
    const safeToken = env.CLOUDFLARE_API_TOKEN.replace(/[^A-Za-z0-9_\-]/g, '');
    const cfRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${safeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!cfRes.ok) {
       const text = await cfRes.text();
       throw new Error(`CF API HTTP ${cfRes.status}: ${text}`);
    }

    const cfData = await cfRes.json();
    
    // Process results
    let totalPageViews = 0;
    let totalUniques = 0;
    
    if (cfData.data && cfData.data.viewer && cfData.data.viewer.zones.length > 0) {
      const groups = cfData.data.viewer.zones[0].httpRequests1dGroups;
      for (const group of groups) {
        totalPageViews += group.sum.pageViews;
        totalUniques += group.uniq.uniques;
      }
    }

    // 4. Fetch GA4 Geography Data
    let geo = { hawaii: 0, mainland: 0, international: 0, active: false, error: null };
    if (env.GA4_CLIENT_EMAIL && env.GA4_PRIVATE_KEY && env.GA4_PROPERTY_ID) {
      try {
        const pk = env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n');
        const gToken = await getGoogleToken(env.GA4_CLIENT_EMAIL, pk);
        const gaRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${gToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'country' }, { name: 'region' }],
            metrics: [{ name: 'activeUsers' }]
          })
        });
        const gaJson = await gaRes.json();
        if (!gaRes.ok) throw new Error(gaJson.error?.message || "GA4 Fetch Error");
        
        geo.active = true;
        if (gaJson.rows) {
          for (const row of gaJson.rows) {
            const country = row.dimensionValues[0].value;
            const region = row.dimensionValues[1].value;
            const users = parseInt(row.metricValues[0].value, 10);
            if (country === 'United States') {
              if (region === 'Hawaii') geo.hawaii += users;
              else geo.mainland += users;
            } else {
              geo.international += users;
            }
          }
        }
      } catch (err) {
        geo.error = err.message;
      }
    }

    return new Response(JSON.stringify({
      pageViews7d: totalPageViews,
      uniques7d: totalUniques,
      geo: geo
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch analytics', 
      details: error.message,
      stack: error.stack
    }), { status: 500 });
  }
}
