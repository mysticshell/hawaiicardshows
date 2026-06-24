/* ─────────────────────────────────────────────────────────────────────
   nl-popup.js — Hawaii Card Shows newsletter capture popup (shared)
   ---------------------------------------------------------------------
   Drop-in: <script src="/branding/nl-popup.js" defer></script>
   Self-contained: injects its own styles + DOM, posts to /api/subscribe,
   fires a gtag form_submit event, and is frecency-capped via localStorage.

   Behavior:
     - Fires once per page load, on whichever happens FIRST:
         (a) reader scrolls past ~55% of the page, or
         (b) desktop exit-intent (cursor leaves toward the top of the window).
     - Never shows again after a visitor DISMISSES (suppressed 30 days) or
       SUBSCRIBES (suppressed permanently).
     - Mobile renders as a bottom sheet; desktop as a centered modal.
   Tune the knobs in CONFIG below — one file, site-wide.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var CONFIG = {
    scrollPct: 0.55,            // fire after this fraction of the page is scrolled
    minDelayMs: 5000,           // don't fire in the first N ms (let them read)
    dismissDays: 7,             // re-show a week after a dismiss (weekly returners get re-asked)
    formId: 'newsletter-popup-recap',
    storeKey: 'hcs_nl_popup',   // { dismissedAt: ts } or { subscribed: true }
    headline: 'Never miss a show',
    sub: 'A weekly digest of every card show in Hawaii — plus the occasional recap. Free.',
    privacy: 'No spam. Unsubscribe anytime.'
  };

  // ---- frecency gate -------------------------------------------------
  function getState() {
    try { return JSON.parse(localStorage.getItem(CONFIG.storeKey)) || {}; }
    catch (e) { return {}; }
  }
  function setState(s) {
    try { localStorage.setItem(CONFIG.storeKey, JSON.stringify(s)); } catch (e) {}
  }
  function suppressed() {
    var s = getState();
    if (s.subscribed) return true;
    if (s.dismissedAt && (Date.now() - s.dismissedAt) < CONFIG.dismissDays * 864e5) return true;
    return false;
  }
  if (suppressed()) return;

  // ---- styles --------------------------------------------------------
  var css = '' +
    '.hcs-nlp-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9998;opacity:0;transition:opacity .25s ease;display:flex;align-items:center;justify-content:center;padding:20px;}' +
    '.hcs-nlp-overlay.open{opacity:1;}' +
    '.hcs-nlp{position:relative;background:#1a1a1a;color:#fff;border-radius:16px;max-width:420px;width:100%;padding:36px 28px 28px;box-shadow:0 24px 60px rgba(0,0,0,0.45);transform:translateY(16px);transition:transform .25s ease;font-family:"Archivo",Arial,Helvetica,sans-serif;text-align:center;}' +
    '.hcs-nlp-overlay.open .hcs-nlp{transform:translateY(0);}' +
    '.hcs-nlp h2{font-family:"Phudu","Archivo",sans-serif;font-size:26px;font-weight:700;margin:0 0 8px;letter-spacing:-0.3px;color:#fff;}' +
    '.hcs-nlp p.sub{color:rgba(255,255,255,0.66);font-size:15px;line-height:1.6;margin:0 0 20px;}' +
    '.hcs-nlp form{display:flex;gap:8px;}' +
    '.hcs-nlp input{flex:1;padding:14px 16px;border:1px solid rgba(255,255,255,0.16);border-radius:8px;background:rgba(255,255,255,0.08);color:#fff;font-family:inherit;font-size:14px;outline:none;}' +
    '.hcs-nlp button{background:#d4582a;color:#fff;border:none;padding:14px 22px;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s;}' +
    '.hcs-nlp button:hover{background:#e8693a;}' +
    '.hcs-nlp .ok{color:#74e0b6;font-size:14px;margin:14px 0 0;display:none;}' +
    '.hcs-nlp .fine{font-size:11px;color:rgba(255,255,255,0.34);margin:14px 0 0;}' +
    '.hcs-nlp .x{position:absolute;top:12px;right:14px;width:30px;height:30px;border:none;background:transparent;color:rgba(255,255,255,0.55);font-size:24px;line-height:1;cursor:pointer;padding:0;}' +
    '.hcs-nlp .x:hover{color:#fff;}' +
    '@media(max-width:600px){.hcs-nlp-overlay{align-items:flex-end;padding:0;}.hcs-nlp{max-width:100%;border-radius:18px 18px 0 0;padding:30px 22px 26px;transform:translateY(100%);}.hcs-nlp-overlay.open .hcs-nlp{transform:translateY(0);}.hcs-nlp form{flex-direction:column;}}';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---- DOM -----------------------------------------------------------
  var overlay = document.createElement('div');
  overlay.className = 'hcs-nlp-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', CONFIG.headline);
  overlay.innerHTML =
    '<div class="hcs-nlp">' +
      '<button class="x" aria-label="Close">×</button>' +
      '<h2></h2>' +
      '<p class="sub"></p>' +
      '<form novalidate>' +
        '<input type="email" required placeholder="your@email.com" aria-label="Email address">' +
        '<button type="submit">Subscribe</button>' +
      '</form>' +
      '<p class="ok">You’re in! Mahalo for subscribing.</p>' +
      '<p class="fine"></p>' +
    '</div>';
  overlay.querySelector('h2').textContent = CONFIG.headline;
  overlay.querySelector('.sub').textContent = CONFIG.sub;
  overlay.querySelector('.fine').textContent = CONFIG.privacy;

  var form = overlay.querySelector('form');
  var input = overlay.querySelector('input');
  var btn = overlay.querySelector('button[type=submit]');
  var ok = overlay.querySelector('.ok');
  var shown = false;

  function open() {
    if (shown || suppressed()) return;
    shown = true;
    document.body.appendChild(overlay);
    // force reflow then add .open for transition
    overlay.getBoundingClientRect();
    overlay.classList.add('open');
    teardownTriggers();
    if (typeof gtag === 'function') gtag('event', 'newsletter_popup_view', { form_id: CONFIG.formId });
  }
  function close(persist) {
    overlay.classList.remove('open');
    if (persist) { var s = getState(); s.dismissedAt = Date.now(); setState(s); }
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 260);
  }

  overlay.querySelector('.x').addEventListener('click', function () { close(true); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && shown) close(true); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true; btn.textContent = 'Subscribing…';
    fetch('/api/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.value })
    }).then(function (r) { return r.json(); }).then(function (data) {
      btn.disabled = false; btn.textContent = 'Subscribe';
      if (data && data.success) {
        setState({ subscribed: true });
        if (data.duplicate) ok.textContent = 'You’re already subscribed!';
        ok.style.display = 'block';
        form.style.display = 'none';
        if (typeof gtag === 'function') gtag('event', 'form_submit', { form_id: CONFIG.formId, form_destination: 'buttondown', duplicate: !!data.duplicate });
        setTimeout(function () { close(false); }, 1800);
      } else { alert('Something went wrong. Please try again.'); }
    }).catch(function (err) { btn.disabled = false; btn.textContent = 'Subscribe'; alert('Something went wrong. Please try again.'); console.error(err); });
  });

  // ---- triggers ------------------------------------------------------
  var ready = false;
  setTimeout(function () { ready = true; }, CONFIG.minDelayMs);

  function onScroll() {
    if (!ready) return;
    var doc = document.documentElement;
    var scrolled = (window.scrollY || doc.scrollTop) + window.innerHeight;
    var pct = scrolled / doc.scrollHeight;
    if (pct >= CONFIG.scrollPct) open();
  }
  function onExit(e) {
    if (ready && e.clientY <= 0) open();
  }
  function teardownTriggers() {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('mouseout', onExit);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // exit-intent: desktop (fine pointer) only
  if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mouseout', onExit);
  }
})();
