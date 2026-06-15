// Cloudflare Pages Function: serve /shows/<slug> as the right page.
//
// Order of preference:
//   1. If a dedicated static page exists at /shows/<slug>.html (e.g. our hand-built
//      series pages: keep-it-aloha, paradise-card-show, bayview-night-market,
//      west-side-show), serve it. The browser still sees the clean URL.
//   2. Otherwise, serve the content of /shows/show.html (the dynamic event detail
//      page). show.html's JS reads window.location.pathname to extract the slug
//      and query Supabase for a matching event.
//
// Why we check step 1 explicitly: Cloudflare Pages doesn't auto-resolve
// /shows/<slug> to /shows/<slug>.html when there's a function registered at
// /shows/[slug]. The function intercepts EVERY /shows/<slug> request. Without
// the explicit static lookup below, every series-page request gets routed to
// the dynamic show.html instead of the hand-built series page — which then
// fails its slug lookup ("keep-it-aloha" doesn't match the event-name slug
// "keep-it-aloha-card-show") and gets stuck on "Loading Event...".

export async function onRequest(context) {
  const { params, env, request, next } = context;
  const slug = params.slug || '';

  // Defensive: if the slug already includes an extension, let the platform handle it.
  if (/\.(html|json|xml|css|js|png|jpe?g|gif|svg|webp|ico)$/i.test(slug)) {
    return next();
  }

  // Reserved slugs that already have dedicated assets — fall through.
  if (slug === 'show' || slug === 'index' || slug === '') {
    return next();
  }

  // Legacy slug redirects. This function intercepts /shows/<slug> before
  // _redirects gets a chance, so 301s for extension-less slugs must live here
  // (the .html variants are still handled by _redirects via the fall-through above).
  const LEGACY_REDIRECTS = {
    'west-side-card-show': '/shows/west-side-show',
  };
  if (LEGACY_REDIRECTS[slug]) {
    return Response.redirect(new URL(LEGACY_REDIRECTS[slug], request.url).toString(), 301);
  }

  const reqUrl = new URL(request.url);

  // STEP 1: try a dedicated static page at /shows/<slug>.html.
  // This is how hand-built series pages (KIA, Paradise, Bayview, West Side, etc.) win.
  const staticUrl = new URL(reqUrl);
  staticUrl.pathname = `/shows/${slug}.html`;
  staticUrl.search = '';
  const staticResponse = await env.ASSETS.fetch(new Request(staticUrl.toString(), {
    headers: request.headers,
    method: 'GET',
  }));
  if (staticResponse.status === 200) {
    // Found a dedicated static page. Serve it, keep the clean URL in the address bar.
    const headers = new Headers(staticResponse.headers);
    headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    return new Response(staticResponse.body, {
      status: 200,
      statusText: staticResponse.statusText,
      headers,
    });
  }

  // STEP 2: no dedicated page — serve the dynamic show.html and let its JS
  // figure out which event the slug refers to.
  const dynamicUrl = new URL(reqUrl);
  dynamicUrl.pathname = '/shows/show.html';
  dynamicUrl.search = '';
  const dynamicResponse = await env.ASSETS.fetch(new Request(dynamicUrl.toString(), {
    headers: request.headers,
    method: 'GET',
  }));

  const headers = new Headers(dynamicResponse.headers);
  headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
  return new Response(dynamicResponse.body, {
    status: dynamicResponse.status,
    statusText: dynamicResponse.statusText,
    headers,
  });
}
