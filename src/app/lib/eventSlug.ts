import type { DiscoverWorkshop } from './hubDirectory';

/**
 * URLs for individual listings.
 *
 * The key is (organizationSlug, title, Melbourne date). Each part is load-bearing:
 *
 *  - `id` cannot be used. The feed's ids are arbitrary 128-bit values of unknown
 *    derivation, and there is no endpoint that resolves one — asking the Hub for
 *    a single listing by id returns 404. An id in the URL would be unreadable and
 *    unresolvable.
 *  - The title alone collides. Several titles recur across dates in the live feed
 *    ("Repair Cafe", "Chatty Cafe", "Pier Fishing", "Welcome Table community
 *    lunch" each appear more than once), so the date is what separates them.
 *  - The suburb is deliberately absent. `location` only parses as
 *    "Venue, Street, Suburb" for about five in six listings, so it is not
 *    dependable as a URL key. Suburb belongs in the title, heading and
 *    description, where a wrong guess is visible rather than baked into a URL.
 *
 * The date must be the Melbourne date, not the UTC one: a 9am event reads as the
 * previous day in UTC, which would put half a spring morning's listings on the
 * wrong date.
 */
const melbourneDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Melbourne',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** YYYY-MM-DD as it falls in Melbourne. en-CA yields exactly that order. */
export function melbourneDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return melbourneDateFormatter.format(date);
}

export function slugifyTitle(title: string) {
  return (
    String(title)
      .normalize('NFKD')
      // Strip marks left behind by the decomposition above.
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      // Spell out an ampersand rather than dropping it: "Food & Craft Market"
      // should not become "food-craft-market".
      .replace(/&/g, ' and ')
      // Quotes and apostrophes vanish instead of becoming separators, so
      // What's Old and What's New in the "New Antisemitism"? reads as
      // whats-old-and-whats-new-in-the-new-antisemitism.
      .replace(/['‘’"“”]/g, '')
      // Dashes of every width, and anything else, become one separator.
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70)
      .replace(/-+$/g, '')
  );
}

export interface EventUrlParts {
  orgSlug: string;
  eventSlug: string;
}

/** null when the listing lacks what a stable, readable URL needs. */
export function eventUrlParts(item: {
  title: string;
  startsAt: string;
  organizationSlug: string;
}): EventUrlParts | null {
  const date = melbourneDate(item.startsAt);
  const titleSlug = slugifyTitle(item.title);

  if (!item.organizationSlug || !titleSlug || !date) return null;

  return { orgSlug: item.organizationSlug, eventSlug: `${titleSlug}-${date}` };
}

export function eventPath(item: {
  title: string;
  startsAt: string;
  organizationSlug: string;
}): string | null {
  const parts = eventUrlParts(item);
  return parts ? `/whats-on/${parts.orgSlug}/${parts.eventSlug}` : null;
}

/**
 * Two listings can still share a key — the same title, by the same organisation,
 * twice on one day. The earlier one keeps the clean URL and later ones get their
 * Melbourne start time appended, so a collision produces two distinct pages
 * rather than one silently overwriting the other at build time.
 */
export function assignUniqueEventPaths<T extends DiscoverWorkshop>(items: T[]) {
  const taken = new Set<string>();
  const assigned: Array<{ item: T; path: string }> = [];

  for (const item of items) {
    const parts = eventUrlParts(item);
    if (!parts) continue;

    let path = `/whats-on/${parts.orgSlug}/${parts.eventSlug}`;

    if (taken.has(path)) {
      const time = new Date(item.startsAt)
        .toLocaleTimeString('en-GB', {
          timeZone: 'Australia/Melbourne',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(':', '');
      path = `${path}-${time}`;
    }

    if (taken.has(path)) continue;

    taken.add(path);
    assigned.push({ item, path });
  }

  return assigned;
}
