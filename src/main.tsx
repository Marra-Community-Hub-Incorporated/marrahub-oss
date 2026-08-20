import { createRoot, hydrateRoot } from 'react-dom/client';
import { matchRoutes, type RouteObject } from 'react-router';
import App from './app/App.tsx';
import { routeConfig } from './app/routeConfig.tsx';
import { createAppRouter } from './app/routes.ts';
import './styles/index.css';

/**
 * Every page is prerendered at build time (scripts/seo-build.mjs), so #root
 * arrives with real markup and this boot hydrates it instead of rendering from
 * scratch. React can only hydrate if its first render produces the same tree
 * the server produced, and a `lazy` route renders nothing until its module
 * lands — so resolve the lazy modules on this URL's matched routes first, then
 * build the router from the now-eager tree.
 *
 * The createRoot branch is the fallback for a document that reached the browser
 * without prerendered markup (a dev server response, or a hand-written shell).
 */
async function resolveLazyRoutes(pathname: string) {
  const matches = matchRoutes(routeConfig, pathname) ?? [];

  await Promise.all(
    matches.map(async ({ route }) => {
      const lazy = (route as RouteObject).lazy;
      if (!lazy || typeof lazy !== 'function') return;
      Object.assign(route, await lazy(), { lazy: undefined });
    }),
  );
}

async function boot() {
  const container = document.getElementById('root')!;
  // The 404 document is served for every unmatched URL, so the markup in it
  // describes the 404 page while the router may match a real route for whatever
  // URL was actually requested. Those two cannot be reconciled, so render rather
  // than hydrate — a brief flash on an error page, instead of a hydration error
  // on every stale link.
  const isPrerendered =
    container.firstElementChild !== null && container.dataset.prerenderedNotFound !== 'true';

  // Either way the lazy module for this URL is resolved first. Hydration needs it
  // to match the prerendered tree; the render path wants it so the router does not
  // boot with an unresolved route and warn about a missing HydrateFallback.
  await resolveLazyRoutes(window.location.pathname);

  if (!isPrerendered) {
    createRoot(container).render(<App router={createAppRouter()} />);
    return;
  }

  hydrateRoot(container, <App router={createAppRouter()} />);
}

void boot();
