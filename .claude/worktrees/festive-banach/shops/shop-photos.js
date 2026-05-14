// Shop Photos Module
// Drop a `<script src="/shops/shop-photos.js"></script>` tag at the bottom of any
// shop page AND add a `<div id="shop-photos-mount"></div>` wherever the section
// should render. This file owns all shop photo URLs and renders a grid + lightbox.
//
// To add photos to a shop, add its slug to SHOP_PHOTOS below with an array of
// public image URLs (Supabase storage, etc). Empty arrays render nothing.

(function () {
  // ═══════════════════════════════════════════════════════════════
  // PHOTO DATA — Edit this to add/remove photos per shop
  // Slug = filename without ".html" (e.g. "tcg-tavern", "4-pillars", "paulas-sports-cards")
  // ═══════════════════════════════════════════════════════════════
  const SHOP_PHOTOS = {
    // '808-showcase': [],
    // '4-pillars': [],
    // 'aloha-card-shop': [],
    // 'armchair-adventurer': [],
    // 'best-of-the-best': [],
    // 'box-jellyz': [],
    // 'bubbahs-toy-box': [],
    // 'crows-nest': [],
    // 'da-planet': [],
    // 'dragons-lair': [],
    // 'evolving-realms': [],
    // 'from-the-heart': [],
    // 'gam3-escape': [],
    // 'iwingames': [],
    // 'maui-sports-cards': [],
    // 'other-realms': [],
    // 'paulas-sports-cards': [],
    // 'slow-your-roll': [],
    // 'space-62': [],
    // 'tcg-hawaii': [],
    // 'tcg-tavern': [],
    // 'toylynx': [],
    // 'windward-collectibles': [],
    // 'yocards': [],
  };

  // ═══════════════════════════════════════════════════════════════
  // STYLES — Injected once on load
  // ═══════════════════════════════════════════════════════════════
  const CSS = `
    .shop-photos-section { padding: 64px 0; border-top: 1px solid var(--sand-dark); }
    .shop-photos-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--shop-primary); margin-bottom: 12px; }
    .shop-photos-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: clamp(26px, 4vw, 36px); color: var(--night); line-height: 1.15; margin-bottom: 24px; }
    .shop-photos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .shop-photo { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.08); display: block; }
    .shop-photo:hover { transform: scale(1.03); box-shadow: 0 6px 24px rgba(0,0,0,0.15); }
    .shop-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2000; display: none; align-items: center; justify-content: center; padding: 24px; cursor: pointer; }
    .shop-lightbox.open { display: flex; }
    .shop-lightbox img { max-width: 92vw; max-height: 86vh; object-fit: contain; border-radius: 10px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
    .shop-lightbox-close { position: absolute; top: 20px; right: 24px; color: white; font-size: 32px; font-weight: 300; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.1); transition: background 0.2s; }
    .shop-lightbox-close:hover { background: rgba(255,255,255,0.25); }
    .shop-lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); color: white; font-size: 36px; font-weight: 300; cursor: pointer; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.1); transition: background 0.2s; user-select: none; }
    .shop-lightbox-nav:hover { background: rgba(255,255,255,0.25); }
    .shop-lightbox-prev { left: 20px; }
    .shop-lightbox-next { right: 20px; }
    .shop-lightbox-counter { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; }
    @media (max-width: 600px) { .shop-photos-section { padding: 48px 0; } .shop-photos-grid { grid-template-columns: 1fr 1fr; } }
  `;

  // ═══════════════════════════════════════════════════════════════
  // SLUG DETECTION
  // ═══════════════════════════════════════════════════════════════
  function getSlug() {
    const m = window.location.pathname.match(/\/shops\/([^/.?#]+)/);
    return m ? m[1] : null;
  }

  // ═══════════════════════════════════════════════════════════════
  // LIGHTBOX STATE
  // ═══════════════════════════════════════════════════════════════
  let photos = [];
  let idx = 0;

  function open(i) {
    idx = i;
    const box = document.getElementById('shopLightbox');
    document.getElementById('shopLightboxImg').src = photos[idx];
    document.getElementById('shopLightboxCounter').textContent = (idx + 1) + ' / ' + photos.length;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(e) {
    if (e && (e.target.classList.contains('shop-lightbox-nav') || e.target.classList.contains('shop-lightbox-prev') || e.target.classList.contains('shop-lightbox-next'))) return;
    document.getElementById('shopLightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  function nav(e, dir) {
    e.stopPropagation();
    idx = (idx + dir + photos.length) % photos.length;
    document.getElementById('shopLightboxImg').src = photos[idx];
    document.getElementById('shopLightboxCounter').textContent = (idx + 1) + ' / ' + photos.length;
  }

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function render() {
    const slug = getSlug();
    if (!slug) return;

    const list = SHOP_PHOTOS[slug] || [];
    if (list.length === 0) return;

    photos = list;

    // Inject styles (once)
    if (!document.getElementById('shop-photos-styles')) {
      const style = document.createElement('style');
      style.id = 'shop-photos-styles';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    // Find mount point
    const mount = document.getElementById('shop-photos-mount');
    if (!mount) return;

    // Build section
    const thumbsHtml = list.map((url, i) =>
      `<img src="${esc(url)}" alt="Shop photo ${i + 1}" class="shop-photo" data-idx="${i}" loading="lazy">`
    ).join('');

    mount.innerHTML = `
      <section class="shop-photos-section">
        <div class="shop-photos-label">Photos</div>
        <h2 class="shop-photos-title">Inside the shop</h2>
        <div class="shop-photos-grid">${thumbsHtml}</div>
      </section>
    `;

    // Wire thumbnail clicks
    mount.querySelectorAll('.shop-photo').forEach(img => {
      img.addEventListener('click', () => open(Number(img.dataset.idx)));
    });

    // Append lightbox to body (once)
    if (!document.getElementById('shopLightbox')) {
      const lb = document.createElement('div');
      lb.className = 'shop-lightbox';
      lb.id = 'shopLightbox';
      lb.innerHTML = `
        <div class="shop-lightbox-close">&times;</div>
        <div class="shop-lightbox-nav shop-lightbox-prev">&#8249;</div>
        <img id="shopLightboxImg" src="" alt="">
        <div class="shop-lightbox-nav shop-lightbox-next">&#8250;</div>
        <div class="shop-lightbox-counter" id="shopLightboxCounter"></div>
      `;
      document.body.appendChild(lb);

      lb.addEventListener('click', close);
      lb.querySelector('.shop-lightbox-close').addEventListener('click', close);
      lb.querySelector('.shop-lightbox-prev').addEventListener('click', e => nav(e, -1));
      lb.querySelector('.shop-lightbox-next').addEventListener('click', e => nav(e, 1));

      document.addEventListener('keydown', e => {
        if (!document.getElementById('shopLightbox').classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') nav(e, -1);
        if (e.key === 'ArrowRight') nav(e, 1);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
