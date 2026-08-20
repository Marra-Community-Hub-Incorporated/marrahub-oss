import { redirect, type RouteObject } from 'react-router';
import { Layout } from './Layout';
import { featureFlags } from './featureFlags';

// When the volunteer flow is live, /volunteer renders the agreement page.
// When it's hidden (see featureFlags), the route still exists but redirects to
// /contact so old links and bookmarks land somewhere useful instead of 404ing.
const volunteerRoute: RouteObject = featureFlags.volunteer
  ? {
      path: 'volunteer',
      lazy: async () => ({
        Component: (await import('./features/volunteer-agreement'))
          .VolunteerAgreementPage,
      }),
    }
  : { path: 'volunteer', loader: () => redirect('/contact') };

/**
 * The route tree as plain data, shared by three callers: the browser router
 * (routes.ts), the prerender/SSR render pass (src/entry-server.tsx), and the
 * hydration bootstrap in main.tsx, which walks it to resolve the lazy modules
 * for the current URL before hydrating.
 *
 * It must stay free of browser-only side effects at module scope — Node runs
 * this file during the build to prerender every page.
 *
 * `id: 'not-found'` on the splat route is load-bearing: the render pass reads
 * it to tell "this URL matched a real page" from "this URL fell through to the
 * 404 page", which is how a prerendered miss returns a real 404 status instead
 * of a soft 404.
 */
export const routeConfig: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./pages/Home')).Home }),
      },
      {
        path: 'launch',
        lazy: async () => ({
          Component: (await import('./pages/LaunchEvent')).LaunchEvent,
        }),
      },
      {
        path: 'about',
        lazy: async () => ({
          Component: (await import('./pages/About')).About,
        }),
      },
      {
        path: 'programs',
        lazy: async () => ({
          Component: (await import('./pages/Programs')).Programs,
        }),
      },
      {
        path: 'discover',
        lazy: async () => ({
          Component: (await import('./pages/Discover')).Discover,
        }),
      },
      // One page per listing in the Discover directory. The URL is derived in
      // lib/eventSlug.ts, and scripts/seo-build.mjs prerenders one file per
      // upcoming listing from the same derivation, so a link on /discover and the
      // file written for it cannot disagree.
      {
        path: 'whats-on/:orgSlug/:eventSlug',
        lazy: async () => ({
          Component: (await import('./pages/EventDetail')).EventDetail,
        }),
      },
      {
        path: 'impact',
        lazy: async () => ({
          Component: (await import('./pages/Impact')).Impact,
        }),
      },
      {
        path: 'governance',
        lazy: async () => ({
          Component: (await import('./pages/Governance')).Governance,
        }),
      },
      {
        path: 'contact',
        lazy: async () => ({
          Component: (await import('./pages/Contact')).Contact,
        }),
      },
      volunteerRoute,
      {
        id: 'not-found',
        path: '*',
        lazy: async () => ({
          Component: (await import('./pages/NotFound')).NotFound,
        }),
      },
    ],
  },
];
