export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://hawaiicardshows.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { email } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const apiKey = env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Newsletter not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`,
        'X-Buttondown-Bypass-Firewall': 'true',
      },
      body: JSON.stringify({
        email_address: email,
        type: 'regular',
      }),
    });

    // Success: 201 Created
    if (res.status === 201) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Duplicate: 400 Bad Request
    if (res.status === 400) {
      const body = await res.text().catch(() => '');
      // Check if it's actually a duplicate vs another 400 error
      if (body.includes('already') || body.includes('exists') || body.includes('duplicate')) {
        return new Response(JSON.stringify({ success: true, duplicate: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      // Not a duplicate — return the actual error for debugging
      return new Response(JSON.stringify({ error: 'Subscription failed', detail: body.slice(0, 300), status: 400 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Auth error
    if (res.status === 401 || res.status === 403) {
      const body = await res.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'API auth error', detail: body.slice(0, 300), status: res.status }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Rate limit
    if (res.status === 429) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Other errors
    const data = await res.text();
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://hawaiicardshows.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
