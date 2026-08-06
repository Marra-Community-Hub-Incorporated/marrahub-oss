/**
 * The only server-side logic this static site needs: a same-origin proxy for
 * the Hub platform's public Discover directory (hub.marrahub.com.au). The
 * Discover page fetches `/api/hub/:section` instead of calling the Hub API
 * directly from the browser, so the marketing site never depends on the Hub
 * API allowing cross-origin requests from marrahub.com.au.
 *
 * Everything else falls through to the static assets (the React SPA).
 */

const HUB_DISCOVER_BASE = 'https://hub.marrahub.com.au/api/discover';
const PROXY_PATH_PREFIX = '/api/hub/';
const ALLOWED_SECTIONS = new Set(['workshops', 'food', 'orgs']);
const UPSTREAM_TIMEOUT_MS = 8000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith(PROXY_PATH_PREFIX)) {
      return handleHubProxy(request, url);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleHubProxy(request: Request, url: URL): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonError('Method not allowed', 405);
  }

  const section = url.pathname.slice(PROXY_PATH_PREFIX.length);
  if (!ALLOWED_SECTIONS.has(section)) {
    return jsonError('Not found', 404);
  }

  const upstreamUrl = new URL(`${HUB_DISCOVER_BASE}/${section}`);
  const q = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  if (q) upstreamUrl.searchParams.set('q', q);
  if (category) upstreamUrl.searchParams.set('category', category);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });

    if (!upstreamResponse.ok) {
      return jsonError('The Hub directory is unavailable right now.', 502);
    }

    return new Response(upstreamResponse.body, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // Public directory data — short edge cache keeps repeat visits and
        // tab-switching snappy without serving stale listings for long.
        'cache-control': 'public, max-age=60',
      },
    });
  } catch {
    return jsonError('The Hub directory is unavailable right now.', 502);
  } finally {
    clearTimeout(timeout);
  }
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
