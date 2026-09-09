/**
 * Silent Background Tracker for Missed/Unlisted Food Searches
 * 
 * Silently dispatches an email notification via Web3Forms when a visitor
 * searches for a food item that is not currently in the database.
 * 
 * Features:
 * - 0 KB external library bloat (native browser fetch + keepalive)
 * - Session-level deduplication (no repeat emails for the same term in one session)
 * - Rate-limited to max 5 notifications per session to avoid spam/quota abuse
 * - Fails 100% silently with zero user-visible disruption
 */

const SESSION_CACHE_KEY = 'nv_missed_searches';
const MAX_SEARCHES_PER_SESSION = 5;

export async function trackMissedSearch(query, context = 'Explorer Search') {
  if (typeof window === 'undefined' || !query) return;

  const cleanQuery = query.trim().toLowerCase();

  // Validate: must be at least 3 chars and contain at least 2 alphanumeric characters
  if (cleanQuery.length < 3 || (cleanQuery.match(/[a-z0-9]/gi) || []).length < 2) {
    return;
  }

  // Session-level deduplication and rate limiting
  try {
    const rawCache = sessionStorage.getItem(SESSION_CACHE_KEY);
    const trackedList = rawCache ? JSON.parse(rawCache) : [];

    // Already tracked in this session?
    if (trackedList.includes(cleanQuery)) {
      return;
    }

    // Hit session threshold limit?
    if (trackedList.length >= MAX_SEARCHES_PER_SESSION) {
      return;
    }

    // Check for access key
    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || '9d42ef77-de02-4a8d-b2ce-45205ec0e811';
    if (!accessKey) {
      if (import.meta.env.DEV) {
        console.warn(
          `[NutriVisual] Missed search for "${cleanQuery}" detected. Set PUBLIC_WEB3FORMS_ACCESS_KEY in .env to receive email alerts at dianben98823@gmail.com.`
        );
      }
      return;
    }

    // Mark as tracked immediately to prevent race conditions
    trackedList.push(cleanQuery);
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(trackedList));

    // Send silent background notification
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `NutriVisual: Unlisted Food Searched ("${cleanQuery}")`,
        from_name: 'NutriVisual Search Tracker',
        message: [
          `A visitor searched for a food item not found in NutriVisual:`,
          ``,
          `• Food Term: "${cleanQuery}"`,
          `• Source: ${context}`,
          `• Timestamp: ${new Date().toUTCString()}`,
          `• Page URL: ${window.location.href}`,
          `• User Device: ${navigator.userAgent || 'Unknown'}`
        ].join('\n'),
      }),
      keepalive: true, // Guarantees execution even if page unloads or navigates
    });
  } catch (_err) {
    // Fails completely silently without any user-facing error or console noise
  }
}
