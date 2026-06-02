// Cloudflare Pages Function: serve /shows/<slug> as the dynamic show.html page,
// keeping the slug URL visible in the browser. Static files (like /shows/keep-it-aloha.html)
// are matched BEFORE this function runs, so dedicated series pages still win.
//
// The shows/show.html JS reads window.location.pathname to extract the slug
// when no ?id= or ?slug= query param is present.

export async function onRequest(context) {
  const { params, env, request, next } = context;
  const slug = params.slug || '';

  // Defensive: if the slug looks like a real asset (.html, .json, .xml, etc),
  // let the platform handle it normally.
  if (/\.(html|json|xml|css|js|png|jpe?g|gif|svg|webp|ico)$/i.test(slug)) {
    return next();
  }

  // Reserved slugs that already have dedicated assets — fall through.
  if (slug === 'show' || slug === 'index' || slug === '') {
    return next();
  }

  // Serve the content of /shows/show.html. The browser keeps the /shows/<slug>
  // URL in the address bar, and show.html's JS extracts the slug from
  // window.location.pathname to query Supabase.
  const url = new URL(request.url);
  url.pathname = '/shows/show.html';
  url.search = '';

  const response = await env.ASSETS.fetch(new Request(url.toString(), {
    headers: request.headers,
    method: 'GET'
  }));

  // Return the HTML content but keep the original URL visible to the browser.
  // Strip caching headers that would tell the browser to cache under the
  // wrong URL — we want each slug to fetch its own data fresh.
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=300, must-revalidate');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
