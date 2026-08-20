import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  HeartHandshake,
  MapPin,
  Search,
  Ticket,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { CTABanner } from '../components/CTABanner';
import { Button } from '../components/Button';
import {
  HUB_SITE_URL,
  formatWhenRange,
  isPublicFacingOrg,
  listingUrl,
  type DiscoverFood,
  type DiscoverOrg,
  type DiscoverWorkshop,
} from '../lib/hubDirectory';
import { snapshotItemsFor } from '../lib/discoverInitialData';
import { eventPath } from '../lib/eventSlug';

// The Discover directory lives on the Hub platform (hub.marrahub.com.au). This
// page previews it here so a visitor doesn't have to already know the Hub
// exists — cards link to the org's Hub page to register, or to the
// organisation's own page for listings we gathered from elsewhere.

const TABS = [
  { key: 'workshops', label: 'Workshops', icon: CalendarDays },
  { key: 'food', label: 'Free food', icon: UtensilsCrossed },
  { key: 'volunteer', label: 'Volunteer', icon: HeartHandshake },
] as const;
type Tab = (typeof TABS)[number]['key'];

const SECTION_BY_TAB: Record<Tab, 'workshops' | 'food' | 'orgs'> = {
  workshops: 'workshops',
  food: 'food',
  volunteer: 'orgs',
};

type State = { kind: 'loading' } | { kind: 'ready'; items: unknown[] } | { kind: 'error' };

export function Discover() {
  const [tab, setTab] = useState<Tab>('workshops');
  const [q, setQ] = useState('');
  // Start from the listings baked in at build time when there are any, so the
  // first paint (and the prerendered HTML behind it) shows real events rather
  // than a spinner. React hydrates against this, so it has to be the same value
  // the build rendered — hence the lazy initialiser reading the same snapshot.
  const [state, setState] = useState<State>(() => {
    const seeded = snapshotItemsFor(SECTION_BY_TAB.workshops, '');
    return seeded ? { kind: 'ready', items: seeded } : { kind: 'loading' };
  });
  // True while the state still holds the build-time snapshot. The fetch effect
  // skips its first run in that case: refetching immediately would flip a
  // populated list back to `loading` and throw away a good first paint.
  const isShowingSnapshot = React.useRef(
    snapshotItemsFor(SECTION_BY_TAB.workshops, '') !== null,
  );
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % TABS.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();

    const nextTab = TABS[nextIndex];
    setTab(nextTab.key);
    tabRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (isShowingSnapshot.current) {
      isShowingSnapshot.current = false;
      return;
    }

    setState({ kind: 'loading' });
    const section = SECTION_BY_TAB[tab];
    // Abort superseded requests: without this, a slow response for an old
    // query can land after a newer one and overwrite it.
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        const qs = params.toString();
        const res = await fetch(`/api/hub/${section}${qs ? `?${qs}` : ''}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        setState({ kind: 'ready', items: (await res.json()) as unknown[] });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState({ kind: 'error' });
      }
    }, 250); // debounce typing
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, tab]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero-background bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <Compass size={14} aria-hidden="true" /> Community directory
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Discover the Hub</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Workshops, classes, free food and volunteering around Glen Eira and neighbouring
              suburbs, in one place —
              listings published on the MARRA Hub platform alongside events we've gathered from
              local libraries, neighbourhood houses and community centres.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Directory */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Right now, near you"
            title="Browse what's on"
            description="One search box, three ways in. Search by suburb, postcode, organisation or topic."
          />

          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by suburb, postcode, organisation or topic…"
                aria-label="Search the directory"
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-5 text-foreground transition"
              />
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Directory sections"
            aria-orientation="horizontal"
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {TABS.map(({ key, label, icon: Icon }, index) => (
              <button
                key={key}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`directory-tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`directory-panel-${key}`}
                tabIndex={tab === key ? 0 : -1}
                onClick={() => setTab(key)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'border border-border bg-card text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon size={15} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`directory-panel-${tab}`}
            aria-labelledby={`directory-tab-${tab}`}
          >
            {state.kind === 'loading' && (
              <p className="py-16 text-center text-muted-foreground">Looking around…</p>
            )}

            {state.kind === 'error' && (
              <div className="mx-auto max-w-md rounded-2xl border border-secondary/20 bg-secondary/5 px-6 py-8 text-center text-secondary">
                We couldn't load the directory just now — try again in a moment, or browse it
                directly on{' '}
                <a href={HUB_SITE_URL} target="_blank" rel="noopener noreferrer" className="underline">
                  the Hub
                </a>
                .
              </div>
            )}

            {state.kind === 'ready' && state.items.length === 0 && (
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-primary">
                  <Compass size={18} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {q.trim() ? 'Nothing matches that search' : 'Nothing here just yet'}
                </h3>
                <p className="text-muted-foreground">
                  {q.trim()
                    ? 'Try a different suburb or a broader word.'
                    : 'Organisations publish new things all the time — check back soon.'}
                </p>
              </div>
            )}

            {state.kind === 'ready' && state.items.length > 0 && tab === 'workshops' && (
              <WorkshopsGrid items={state.items as DiscoverWorkshop[]} />
            )}
            {state.kind === 'ready' && state.items.length > 0 && tab === 'food' && (
              <FoodGrid items={state.items as DiscoverFood[]} />
            )}
            {state.kind === 'ready' && state.items.length > 0 && tab === 'volunteer' && (
              <VolunteerGrid
                items={(state.items as DiscoverOrg[]).filter(isPublicFacingOrg)}
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="See it all on the Hub"
            description="Register for a workshop, reserve a food giveaway or apply to volunteer — each listing links straight to the organisation running it, whether that's their Hub page or their own website."
            primaryButtonText="Open the Hub"
            primaryButtonHref={HUB_SITE_URL}
            secondaryButtonText="View Programs"
            secondaryButtonHref="/programs"
          />
        </div>
      </section>
    </div>
  );
}

function WorkshopsGrid({ items }: { items: DiscoverWorkshop[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((w, index) => {
        // Listings gathered from an organisation's own website carry no
        // capacity data — spotsRemaining is always 0 for them, so reading it
        // as "full" would mark every gathered event as unavailable.
        const external = Boolean(w.isExternalListing);
        const full = !external && w.spotsRemaining <= 0;
        return (
          <motion.article
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="bg-card rounded-2xl p-6 border border-border flex flex-col"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              {w.organizationName}
            </p>
            <h3 className="text-xl font-serif font-semibold text-primary mb-2 leading-snug">
              {w.title}
            </h3>
            {w.description && (
              <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">
                {w.description}
              </p>
            )}
            <div className="space-y-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays size={15} aria-hidden="true" /> {formatWhenRange(w.startsAt, w.durationMinutes)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={15} aria-hidden="true" /> {w.location || 'TBC'}
                {w.postcode && <span>· {w.postcode}</span>}
              </span>
              {external ? (
                w.costNote ? (
                  <span className="flex items-center gap-2">
                    <Ticket size={15} aria-hidden="true" /> {w.costNote}
                  </span>
                ) : null
              ) : (
                <span className="flex items-center gap-2">
                  <Users size={15} aria-hidden="true" />
                  {full
                    ? 'Full'
                    : `${w.spotsRemaining} spot${w.spotsRemaining === 1 ? '' : 's'} left`}
                </span>
              )}
            </div>
            {/*
              Links to MARRA's own page for the listing when one exists. Every card
              used to send the visitor straight to the source site, so the
              directory had no crawlable URL of its own for any of its 30 listings
              and handed every click and all link equity to the source domain —
              which for 15 of them is a generic classes page listing everything
              that organisation runs, not the event you clicked.
            */}
            <Button
              href={eventPath(w) ?? listingUrl(w)}
              variant={full ? 'outline' : 'primary'}
              size="sm"
              className="mt-5 w-full"
            >
              {full ? 'See the organisation' : 'View event details'}{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
            {external && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Listed by {w.organizationName}
              </p>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}

function FoodGrid({ items }: { items: DiscoverFood[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, index) => {
        const external = Boolean(f.isExternalListing);
        const gone = !external && f.spotsRemaining <= 0;
        return (
          <motion.article
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="bg-card rounded-2xl p-6 border border-border flex flex-col"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              {f.organizationName}
            </p>
            <h3 className="text-xl font-serif font-semibold text-primary mb-2 leading-snug">
              {f.title}
            </h3>
            {f.description && (
              <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">
                {f.description}
              </p>
            )}
            <div className="space-y-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays size={15} aria-hidden="true" /> {formatWhenRange(f.startsAt, f.durationMinutes)}
              </span>
              {f.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={15} aria-hidden="true" /> {f.location}
                </span>
              )}
              {!external && (
                <span className="flex items-center gap-2">
                  <UtensilsCrossed size={15} aria-hidden="true" />
                  {gone ? 'All portions taken' : `${f.spotsRemaining} left`}
                </span>
              )}
            </div>
            <Button
              href={listingUrl(f)}
              variant={gone ? 'outline' : 'primary'}
              size="sm"
              className="mt-5 w-full"
            >
              {external ? 'View details' : gone ? 'See the organisation' : 'Reserve on the Hub'}{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </motion.article>
        );
      })}
    </div>
  );
}

function VolunteerGrid({ items }: { items: DiscoverOrg[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((o, index) => (
        <motion.article
          key={o.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
          className="bg-card rounded-2xl p-6 border border-border flex flex-col"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
            <HeartHandshake size={18} aria-hidden="true" />
          </span>
          <h3 className="text-xl font-serif font-semibold text-primary mb-2 leading-snug">
            {o.name}
          </h3>
          {o.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
              {o.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-5 flex-1">
            {o.upcomingWorkshops > 0 || o.upcomingFoodEvents > 0 ? (
              <>
                Right now:{' '}
                {[
                  o.upcomingWorkshops > 0 &&
                    `${o.upcomingWorkshops} upcoming workshop${o.upcomingWorkshops === 1 ? '' : 's'}`,
                  o.upcomingFoodEvents > 0 &&
                    `${o.upcomingFoodEvents} food giveaway${o.upcomingFoodEvents === 1 ? '' : 's'}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                .
              </>
            ) : (
              'Always happy to hear from new volunteers.'
            )}
          </p>
          <Button href={`${HUB_SITE_URL}/o/${o.slug}`} size="sm" className="w-full">
            Apply on the Hub <ArrowUpRight size={15} aria-hidden="true" />
          </Button>
        </motion.article>
      ))}
    </div>
  );
}
