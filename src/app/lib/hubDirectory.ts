/**
 * Shared types and helpers for the Hub's public Discover directory
 * (hub.marrahub.com.au), which this site reads through the same-origin
 * `/api/hub/:section` proxy in worker/index.ts.
 *
 * Used by the full Discover page and by the homepage preview of it.
 */

export const HUB_SITE_URL = 'https://hub.marrahub.com.au';

export interface DiscoverWorkshop {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  postcode: string;
  spotsRemaining: number;
  organizationName: string;
  organizationSlug: string;
  /**
   * True for listings MARRA gathered from another organisation's own website
   * rather than ones published on the Hub. These carry no capacity data, so
   * spotsRemaining is always 0 and must not be read as "full".
   */
  isExternalListing?: boolean;
  /** Where the organisation takes bookings, when the listing names one. */
  registrationUrl?: string;
  /** The page the listing was gathered from. */
  sourceUrl?: string;
  /** Cost exactly as the organisation words it — never inferred. */
  costNote?: string;
  audienceNote?: string;
}

export interface DiscoverFood {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  spotsRemaining: number;
  organizationName: string;
  organizationSlug: string;
  isExternalListing?: boolean;
  registrationUrl?: string;
  sourceUrl?: string;
}

export interface DiscoverOrg {
  name: string;
  slug: string;
  description: string;
  upcomingWorkshops: number;
  upcomingFoodEvents: number;
}

/**
 * Times are pinned to Melbourne rather than the viewer's own timezone: these
 * are physical events in Glen Eira, so a visitor reading the page from
 * overseas still needs the time they'd turn up at the door.
 */
export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Locations arrive as "Venue, Street, Suburb". The suburb is the part people
 * actually scan for, so pull it out for the compact homepage cards.
 */
export function suburbFrom(location: string) {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : '';
}

/**
 * Where a listing's button should go. Listings gathered from elsewhere send
 * people to the organisation running the event; Hub-published ones go to the
 * organisation's Hub page, where registration happens.
 */
export function listingUrl(item: {
  isExternalListing?: boolean;
  registrationUrl?: string;
  sourceUrl?: string;
  organizationSlug: string;
}) {
  if (item.isExternalListing) {
    const external = item.registrationUrl || item.sourceUrl;
    if (external) return external;
  }
  return `${HUB_SITE_URL}/o/${item.organizationSlug}`;
}
