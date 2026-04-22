// Recap Map
// Single source of truth for all published recaps. Add an entry here
// whenever you publish a new recap. The homepage "Latest From Hawaii"
// section and every show detail page both read from this list.
//
// Each entry:
//   slug       — matches the filename (without .html)
//   title      — short punchy title for the card
//   date       — ISO date (YYYY-MM-DD) of the show
//   event_id   — UUID of the show in the Supabase events table, or null
//                if the recap doesn't map to a specific event. When set,
//                the recap automatically appears on that show's detail page.
//   thumbnail  — relative path to the card image (or null for placeholder)
//   url        — relative URL to the recap page
//   blurb      — optional one-line summary for cards

(function () {
  const RECAPS = [
    {
      slug: 'getnutz-x-paradise-april-2026',
      title: 'GetNutz Brings the Culture to the Card Scene',
      date: '2026-04-19',
      event_id: '68848e16-2231-415d-9563-79bd50c1208d',
      thumbnail: '/recaps/images/getnutz-2026-security-cam-packed.jpg',
      url: '/recaps/getnutz-x-paradise-april-2026.html',
      blurb: '800 attendees, 30 vendors, and a big August 9 announcement with Paradise.'
    },
    {
      slug: 'paradise-card-show-march-2026',
      title: 'Paradise Card Show #3 — Lines Around the Block',
      date: '2026-03-22',
      event_id: '9b9ede99-8b7a-4dd5-a92a-e63ce80d0745',
      thumbnail: '/recaps/images/paradise-2026-show-floor.jpeg',
      url: '/recaps/paradise-card-show-march-2026.html',
      blurb: '64 vendors, 1,400+ adults and keiki at The Republik.'
    },
    {
      slug: 'moiliili-card-show-march-2026',
      title: 'Moiliili Card Show — Inaugural Community Show',
      date: '2026-03-28',
      event_id: null,
      thumbnail: null,
      url: '/recaps/moiliili-card-show-march-2026.html',
      blurb: '1,000+ collectors, 25 vendors, all proceeds to the Hongwanji.'
    }
  ];

  // Expose list
  window.HCS_RECAPS = RECAPS;

  // Helper: all recaps linked to a given event_id (newest first)
  window.HCS_RECAPS_FOR_EVENT = function (eventId) {
    if (!eventId) return [];
    return RECAPS
      .filter(r => r.event_id === eventId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  };

  // Helper: N most recent recaps (newest first)
  window.HCS_RECENT_RECAPS = function (n) {
    return [...RECAPS]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, n || 3);
  };
})();
