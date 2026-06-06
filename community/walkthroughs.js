// Community Walkthroughs Registry
// Single source of truth for community-contributed show videos (Instagram).
// Add an entry here whenever a creator sends you their walkthrough link
// and the "From the Floor" module on the matching recap / series / show
// page picks it up automatically.
//
// Each entry:
//   recap_slug      — matches the recap filename (without .html). When set,
//                     the video appears in the "From the Floor" block on that
//                     recap page. Most common case.
//   show_slug       — for series pages (e.g. "keep-it-aloha", "paradise-card-show"),
//                     not the event slug. When set, the video appears on the
//                     series page (under "From the Floor").
//   event_id        — optional UUID of the specific event in Supabase. When set,
//                     the video appears on the dynamic /shows/show.html page
//                     for that event.
//   ig_post_url     — the full Instagram permalink (works for posts AND reels).
//                     Format: https://www.instagram.com/p/XYZ/ or
//                     https://www.instagram.com/reel/XYZ/
//   creator_handle  — IG handle WITHOUT the @ (e.g. "sarukofamcollects")
//   creator_name    — display name (e.g. "Saruko Fam Collects")
//   date            — ISO date (YYYY-MM-DD) the show happened
//   type            — "walkthrough" | "highlight" | "recap" (mostly walkthrough)
//   caption         — short one-line description for accessibility / preview

(function () {
  const WALKTHROUGHS = [
    {
      recap_slug: 'keep-it-aloha-may-2026',
      ig_post_url: 'https://www.instagram.com/reel/DX3N5YViy08/',
      creator_handle: 'sarukofamcollects',
      creator_name: 'Saruko Fam Collects',
      date: '2026-05-02',
      type: 'walkthrough',
      caption: 'Floor walkthrough of Keep It Aloha #1 at SALT Kaka\'ako.'
    },
    // ── Add entries above. Tyler pulls IG links from @sarukofamcollects's
    // ── feed and adds them here. Each one renders automatically on the matching
    // ── recap page once the recap_slug matches.

    // Example template (commented out — uncomment + fill in to add):
    // {
    //   recap_slug: 'paradise-card-show-march-2026',
    //   ig_post_url: 'https://www.instagram.com/reel/XXXXXXXX/',
    //   creator_handle: 'sarukofamcollects',
    //   creator_name: 'Saruko Fam Collects',
    //   date: '2026-03-22',
    //   type: 'walkthrough',
    //   caption: 'Floor walkthrough of Paradise Card Show #3 at The Republik.'
    // },
  ];

  window.HCS_WALKTHROUGHS = WALKTHROUGHS;

  // Get walkthroughs for a given recap (newest first)
  window.HCS_WALKTHROUGHS_FOR_RECAP = function (slug) {
    if (!slug) return [];
    return WALKTHROUGHS
      .filter(w => w.recap_slug === slug)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  };

  // Get walkthroughs for a given show series (newest first)
  window.HCS_WALKTHROUGHS_FOR_SHOW = function (slug) {
    if (!slug) return [];
    return WALKTHROUGHS
      .filter(w => w.show_slug === slug)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  };

  // Get walkthroughs for a given event_id (newest first)
  window.HCS_WALKTHROUGHS_FOR_EVENT = function (eventId) {
    if (!eventId) return [];
    return WALKTHROUGHS
      .filter(w => w.event_id === eventId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  };
})();
