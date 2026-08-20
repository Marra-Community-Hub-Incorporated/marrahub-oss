import { Link, useParams } from 'react-router';
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Info,
  MapPin,
  Ticket,
  Users,
} from 'lucide-react';
import { Button } from '../components/Button';
import { getDiscoverSnapshot } from '../lib/discoverInitialData';
import {
  formatWhenRange,
  listingUrl,
  type DiscoverWorkshop,
} from '../lib/hubDirectory';
import { assignUniqueEventPaths } from '../lib/eventSlug';

/**
 * One listing, one URL.
 *
 * Everything here comes from the build-time Discover snapshot, which the page
 * already ships to the browser — so this renders identically on the server and
 * the client with no extra request.
 *
 * On what this page is for: MARRA gathers these listings from other
 * organisations' sites, and a page that merely restated a copied description
 * would be a thinner duplicate of the original competing against it. What is
 * genuinely MARRA's here is the aggregation — a normalised start AND finish time
 * in Melbourne, the venue resolved to a full address with a postcode and a map,
 * the cost quoted exactly as the organiser worded it, and cross-links to
 * everything else on at that venue or run by that organisation. No single source
 * site offers the last of those, which is the whole reason the directory exists.
 * The organiser is credited prominently and linked in every case.
 */
function venueOf(location: string) {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[0] ?? '';
}

function suburbOf(location: string) {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function longDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function RelatedList({
  title,
  items,
}: {
  title: string;
  items: Array<{ item: DiscoverWorkshop; path: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-serif font-semibold text-primary mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map(({ item, path }) => (
          <li key={path}>
            <Link
              to={path}
              className="group flex flex-col rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
            >
              <span className="font-medium text-foreground group-hover:text-primary">
                {item.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatWhenRange(item.startsAt, item.durationMinutes)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EventDetail() {
  const { orgSlug, eventSlug } = useParams();
  const snapshot = getDiscoverSnapshot();
  const all = snapshot ? [...snapshot.workshops, ...snapshot.food] : [];
  const assigned = assignUniqueEventPaths(all as DiscoverWorkshop[]);
  const wanted = `/whats-on/${orgSlug}/${eventSlug}`;
  const match = assigned.find((entry) => entry.path === wanted);

  // A listing that has started drops out of the Hub's feed, so an indexed URL
  // for a finished event ends up here. Say so plainly and send people back to
  // what is still on, rather than showing an error.
  if (!match) {
    return (
      <div className="min-h-screen">
        <section className="page-hero-background bg-primary text-primary-foreground py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
              This listing isn&apos;t showing right now
            </h1>
            <p className="text-lg text-primary-foreground/90">
              It may have already happened, or the organisation may have taken
              it down. The directory only carries what&apos;s still coming up.
            </p>
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button href="/discover" variant="primary">
              See what&apos;s on now{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const event = match.item;
  const venue = venueOf(event.location);
  const suburb = suburbOf(event.location);
  const external = event.isExternalListing === true;
  const mapUrl =
    typeof event.latitude === 'number' && typeof event.longitude === 'number'
      ? `https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=17/${event.latitude}/${event.longitude}`
      : null;

  const sameVenue = assigned
    .filter(
      (entry) =>
        entry.path !== match.path && entry.item.location === event.location,
    )
    .slice(0, 5);
  const sameOrg = assigned
    .filter(
      (entry) =>
        entry.path !== match.path &&
        entry.item.organizationSlug === event.organizationSlug &&
        !sameVenue.some((v) => v.path === entry.path),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <section className="page-hero-background bg-primary text-primary-foreground py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6 hover:bg-white/20 transition-colors"
          >
            <Compass size={14} aria-hidden="true" /> Community directory
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
            {event.title}
          </h1>
          <p className="text-lg text-primary-foreground/90">
            {longDate(event.startsAt)}
            {suburb ? ` · ${suburb}` : ''} · Listed by {event.organizationName}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                <CalendarDays size={15} aria-hidden="true" /> When
              </dt>
              <dd className="text-foreground">
                {formatWhenRange(event.startsAt, event.durationMinutes)}
                <span className="block text-sm text-muted-foreground">
                  Melbourne time
                </span>
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                <MapPin size={15} aria-hidden="true" /> Where
              </dt>
              <dd className="text-foreground">
                {event.location || 'To be confirmed'}
                {event.postcode ? (
                  <span className="block text-sm text-muted-foreground">
                    VIC {event.postcode}
                  </span>
                ) : null}
                {mapUrl ? (
                  <a
                    href={mapUrl}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-primary underline hover:no-underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open in maps <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ) : null}
              </dd>
            </div>

            {event.costNote ? (
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  <Ticket size={15} aria-hidden="true" /> Cost
                </dt>
                {/* Quoted exactly as the organisation worded it — never inferred. */}
                <dd className="text-foreground">{event.costNote}</dd>
              </div>
            ) : null}

            {event.audienceNote ? (
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  <Users size={15} aria-hidden="true" /> Who it&apos;s for
                </dt>
                <dd className="text-foreground">{event.audienceNote}</dd>
              </div>
            ) : null}
          </dl>

          {event.description ? (
            <div>
              <h2 className="text-xl font-serif font-semibold text-primary mb-3">
                About this event
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Description as published by {event.organizationName}.
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-muted/20 p-6">
            <p className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-primary"
              />
              <span>
                {external
                  ? `MARRA gathered this listing from ${event.organizationName}'s own website so you can find it alongside everything else on locally. They run the event, and they hold the current details — check with them before you set out.`
                  : `${event.organizationName} publishes this listing on the MARRA Hub, where registration happens.`}
              </span>
            </p>
            <Button
              href={listingUrl(event)}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              {external
                ? `View on ${event.organizationName}'s site`
                : 'Register on the Hub'}{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </div>

          {(sameVenue.length > 0 || sameOrg.length > 0) && (
            <div className="grid gap-8 sm:grid-cols-2">
              <RelatedList
                title={venue ? `More at ${venue}` : 'More at this venue'}
                items={sameVenue}
              />
              <RelatedList
                title={`More from ${event.organizationName}`}
                items={sameOrg}
              />
            </div>
          )}

          <div>
            <Button href="/discover" variant="outline" size="sm">
              Browse the whole directory{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
