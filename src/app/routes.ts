import { createBrowserRouter, type RouteObject } from 'react-router';
import { routeConfig } from './routeConfig';

/**
 * Built after main.tsx has resolved the lazy modules for the current URL, so
 * the first client render can match prerendered HTML rather than replacing it.
 */
export function createAppRouter(routes: RouteObject[] = routeConfig) {
  return createBrowserRouter(routes);
}
