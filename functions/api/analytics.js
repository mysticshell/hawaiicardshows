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
    const cfRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

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

    return new Response(JSON.stringify({
      pageViews7d: totalPageViews,
      uniques7d: totalUniques
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), { status: 500 });
  }
}
