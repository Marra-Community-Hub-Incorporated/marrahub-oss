/* eslint-disable react-refresh/only-export-components -- This module is the
   build-time render entry, imported by scripts/seo-build.mjs in Node. It never
   reaches a browser and never participates in hot reload, so the rule's advice
   to split its non-component exports into another file does not apply. */
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  type RouteObject,
} from 'react-router';
import { routeConfig } from './app/routeConfig';
import {
  setServerDiscoverSnapshot,
  type DiscoverSnapshot,
} from './app/lib/discoverInitialData';

/**
 * The build-time render pass. scripts/seo-build.mjs imports this module (built
 * separately by vite.ssr.config.ts into a plain Node bundle) and calls render()
 * once per route to prerender real markup into dist/client/<route>/index.html.
 *
 * It also re-exports the SEO source of truth so seo-build.mjs can read the same
 * `siteConfig`/`pageSeoMap` the running app reads, instead of keeping a second
 * hand-synced copy of them. Those two copies had already drifted — the emitted
 * JSON-LD advertised a phone number the app config no longer carried.
 */
export {
  siteConfig,
  pageSeoMap,
  getCanonicalPath,
  getPageSeo,
} from './app/seo/site';
export {
  DISCOVER_DATA_ELEMENT_ID,
  type DiscoverSnapshot,
} from './app/lib/discoverInitialData';

export interface RenderResult {
  /** Markup for #root, or null when the route is a redirect. */
  html: string | null;
  /** 200 for a real page, 404 when the URL only matched the splat route. */
  status: number;
  /** Set when the route answered with a redirect instead of markup. */
  redirect?: { location: string; status: number };
}

/**
 * `lazy` route modules are resolved by the static handler for matched routes,
 * but the handler only walks the branch a URL matches — so each render() call
 * resolves exactly the modules that URL needs.
 */
export async function render(
  pathname: string,
  options: { discover?: DiscoverSnapshot | null } = {},
): Promise<RenderResult> {
  // Hand the Discover listings to the render pass before it starts. The page
  // reads them through the same module the browser reads its JSON data block
  // from, so the prerendered markup and the first client render agree.
  setServerDiscoverSnapshot(options.discover ?? null);

  const url = new URL(pathname, 'https://marrahub.com.au');
  const handler = createStaticHandler(routeConfig);
  const context = await handler.query(new Request(url));

  // A loader that redirected (the /volunteer route when its flag is off) comes
  // back as a Response rather than a render context.
  if (context instanceof Response) {
    const location = context.headers.get('location');
    return {
      html: null,
      status: context.status,
      redirect: location ? { location, status: context.status } : undefined,
    };
  }

  // Every unmatched URL still "matches" the splat route, which renders the 404
  // page — so the status has to come from which route matched, not from whether
  // one did. Without this the prerendered 404 page would be served as 200 and
  // Google would file it as a soft 404.
  const matchedNotFound = context.matches.some(
    (match) => match.route.id === 'not-found',
  );

  const router = createStaticRouter(
    handler.dataRoutes as RouteObject[],
    context,
  );
  const html = renderToString(
    <StaticRouterProvider router={router} context={context} hydrate={false} />,
  );

  return { html, status: matchedNotFound ? 404 : context.statusCode };
}
