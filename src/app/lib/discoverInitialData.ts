import type {
  DiscoverFood,
  DiscoverOrg,
  DiscoverWorkshop,
} from './hubDirectory';

/**
 * The Discover listings captured at build time so the page ships with real
 * event markup instead of a loading spinner.
 *
 * Without this the directory was invisible to search: every listing arrived
 * from a client-side fetch, so the HTML crawlers read contained none of the
 * events — the one thing on the site people actually search for.
 *
 * It also keeps hydration honest. React's first client render has to match the
 * prerendered markup, so the page has to start from the same listings the build
 * rendered rather than from `loading`.
 */
export interface DiscoverSnapshot {
  workshops: DiscoverWorkshop[];
  food: DiscoverFood[];
  orgs: DiscoverOrg[];
  /** When the build fetched these, so a stale snapshot can be reasoned about. */
  capturedAt: string;
}

export const DISCOVER_DATA_ELEMENT_ID = 'marra-discover-data';

/**
 * A JSON data block rather than an inline script assignment: `script-src` in
 * public/_headers allows only 'self' plus one hashed inline script, and a
 * non-executable `type="application/json"` block sidesteps that entirely.
 */
let serverSnapshot: DiscoverSnapshot | null = null;

export function setServerDiscoverSnapshot(snapshot: DiscoverSnapshot | null) {
  serverSnapshot = snapshot;
}

let clientSnapshot: DiscoverSnapshot | null | undefined;

export function getDiscoverSnapshot(): DiscoverSnapshot | null {
  if (typeof document === 'undefined') return serverSnapshot;

  // Parsed once: the element is inert after the first read, and re-parsing on
  // every render would be wasted work in a hot path.
  if (clientSnapshot !== undefined) return clientSnapshot;

  const element = document.getElementById(DISCOVER_DATA_ELEMENT_ID);

  if (!element?.textContent) {
    clientSnapshot = null;
    return clientSnapshot;
  }

  try {
    clientSnapshot = JSON.parse(element.textContent) as DiscoverSnapshot;
  } catch {
    // A malformed snapshot must not take the page down — fall back to fetching.
    clientSnapshot = null;
  }

  return clientSnapshot;
}

export type DiscoverSection = 'workshops' | 'food' | 'orgs';

/** The snapshot only covers the unfiltered default view, so a search must fetch. */
export function snapshotItemsFor(
  section: DiscoverSection,
  query: string,
): unknown[] | null {
  if (query.trim()) return null;

  const snapshot = getDiscoverSnapshot();
  if (!snapshot) return null;

  return snapshot[section] ?? null;
}
