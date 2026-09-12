/**
 * GA4 event helper. The analytics snippet only runs for Australian visitors
 * (see src/partials/analytics.html), so calls are a silent no-op for everyone
 * else and whenever analytics is blocked.
 *
 * @param {string} name - GA4 event name.
 * @param {Record<string, string>} [params] - Event parameters.
 */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
