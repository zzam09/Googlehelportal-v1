// ============================================================
//  /js/analytics.js — Dynamic Tracker Loader
//  Fetches all enabled trackers from Firestore via API
//  and injects them into every page automatically.
//
//  Add ONE line inside <head> on every HTML page:
//  <script src="/js/analytics.js"></script>
//  Then manage everything from /pages/tracker-manager.html
// ============================================================

(async () => {
  const CACHE_KEY = '_sx_trackers_v1';
  const CACHE_TTL = 5 * 60 * 1000; // re-fetch after 5 minutes

  try {
    let trackers = null;

    // Use sessionStorage cache to avoid fetching on every page navigation
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) trackers = data;
    }

    if (!trackers) {
      const res = await fetch('/api/trackers');
      if (!res.ok) return;
      const json = await res.json();
      trackers = json.trackers || [];
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: trackers, ts: Date.now() }));
    }

    // Inject only enabled trackers
    trackers
      .filter(t => t.enabled !== false)
      .forEach(t => injectScript(t.script));

  } catch (e) {
    // Silent fail — tracking should never break the page
  }
})();

// Safely injects any <script> tag (external src OR inline code like Tawk.to)
function injectScript(html) {
  if (!html) return;
  const container = document.createElement('div');
  container.innerHTML = html;

  container.querySelectorAll('script').forEach(original => {
    const s = document.createElement('script');
    // Copy all attributes (async, src, charset, crossorigin, type, etc.)
    Array.from(original.attributes).forEach(attr => {
      s.setAttribute(attr.name, attr.value);
    });
    // Copy inline JS code
    if (original.textContent) {
      s.textContent = original.textContent;
    }
    document.head.appendChild(s);
  });
}