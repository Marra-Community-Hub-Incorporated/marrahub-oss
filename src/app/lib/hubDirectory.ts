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
  /** How long it runs. The API sends this; nothing used to read it. */
  durationMinutes?: number;
  /**
   * Venue coordinates, null when the listing has no address at all. Also sent by
   * the API and also previously undeclared — the event page uses them for a map
   * link, and the Event markup for schema.org geo.
   */
  latitude?: number | null;
  longitude?: number | null;
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
  durationMinutes?: number;
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

/**
 * Slugs the Hub exposes through its public orgs feed that are not real
 * organisations. "public" is its internal Public Intake tenant: it carries no
 * description and no events, and it was being rendered on the Volunteer tab as
 * though it were somewhere a person could go and volunteer, linking through to
 * hub.marrahub.com.au/o/public.
 *
 * The Hub should not publish it at all — this is a guard on the consuming side,
 * not the fix.
 */
const INTERNAL_ORG_SLUGS = new Set(['public']);

export function isPublicFacingOrg(org: { slug: string }) {
  return !INTERNAL_ORG_SLUGS.has(org.slug);
}

/**
 * Start and finish, when the listing says how long it runs.
 *
 * Only the start time used to be shown, so a drop-in session running 5–7 pm
 * read as "5:00 pm" — indistinguishable from an appointment you had to be on
 * time for. Falls back to the start alone when no duration is given, rather
 * than inventing an end time.
 */
export function formatWhenRange(iso: string, durationMinutes?: number) {
  const startText = formatWhen(iso);
  if (!startText || !durationMinutes || durationMinutes <= 0) return startText;

  const end = new Date(new Date(iso).getTime() + durationMinutes * 60000);
  const endText = end.toLocaleTimeString('en-AU', {
    timeZone: 'Australia/Melbourne',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${startText} – ${endText}`;
}
