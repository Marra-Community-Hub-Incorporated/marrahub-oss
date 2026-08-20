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

    // wrangler.jsonc routes every /api/* path here via run_worker_first, so an
    // /api/ path that isn't the proxy has to be answered here. It used to fall
    // through to env.ASSETS — which is undefined unless the assets block
    // declares a binding, so `/api/anything` threw and Cloudflare served its own
    // 1101 error page as an HTTP 500.
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return jsonError('Not found', 404);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleHubProxy(request: Request, url: URL): Promise<Response> {
  // HEAD is a GET without a body, and crawlers and uptime checks use it to probe
  // a URL cheaply. Rejecting it with 405 made those probes look like the endpoint
  // was broken. The upstream fetch below is a GET either way; the runtime strips
  // the body from the response to a HEAD request.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
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
