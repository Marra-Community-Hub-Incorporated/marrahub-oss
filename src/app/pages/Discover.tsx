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
  formatWhen,
  listingUrl,
  type DiscoverFood,
  type DiscoverOrg,
  type DiscoverWorkshop,
} from '../lib/hubDirectory';

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
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
    setState({ kind: 'loading' });
    setStatusMessage('');
    setErrorMessage('');

    const section = SECTION_BY_TAB[tab];
    const activeTabLabel =
      TABS.find(({ key }) => key === tab)?.label.toLowerCase() ?? 'items';

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setStatusMessage(`Loading ${activeTabLabel}.`);

      try {
        const params = new URLSearchParams();
        const trimmedQuery = q.trim();

        if (trimmedQuery) {
          params.set('q', trimmedQuery);
        }

        const qs = params.toString();

        const res = await fetch(`/api/hub/${section}${qs ? `?${qs}` : ''}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(String(res.status));
        }

        const items = (await res.json()) as unknown[];

        setState({ kind: 'ready', items });

        setStatusMessage(
          `${items.length} result${items.length === 1 ? '' : 's'} found${
            trimmedQuery ? ` for ${trimmedQuery}` : ''
          } in ${activeTabLabel}.`,
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        setState({ kind: 'error' });
        setStatusMessage('');
        setErrorMessage(
          `We couldn't load ${activeTabLabel} results. Please try again.`,
        );
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
              <Compass size={14} /> Community directory
            </span>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Discover the Hub
            </h1>

            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Workshops, classes, free food and volunteering across Glen Eira, in one place —
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

          <div className="sr-only">
            <div role="status" aria-live="polite" aria-atomic="true">
              {statusMessage}
            </div>

            <div role="alert" aria-atomic="true">
              {errorMessage}
            </div>
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

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
                <Icon size={15} /> {label}
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
                <a
                  href={HUB_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  the Hub
                </a>
                .
              </div>
            )}

            {state.kind === 'ready' && state.items.length === 0 && (
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-primary">
                  <Compass size={18} />
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
              <VolunteerGrid items={state.items as DiscoverOrg[]} />
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
                <CalendarDays size={15} /> {formatWhen(w.startsAt)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={15} /> {w.location || 'TBC'}
                {w.postcode && <span>· {w.postcode}</span>}
              </span>
              {external ? (
                w.costNote ? (
                  <span className="flex items-center gap-2">
                    <Ticket size={15} /> {w.costNote}
                  </span>
                ) : null
              ) : (
                <span className="flex items-center gap-2">
                  <Users size={15} />
                  {full
                    ? 'Full'
                    : `${w.spotsRemaining} spot${w.spotsRemaining === 1 ? '' : 's'} left`}
                </span>
              )}
            </div>
            <Button
              href={listingUrl(w)}
              variant={full ? 'outline' : 'primary'}
              size="sm"
              className="mt-5 w-full"
            >
              {external ? 'View event details' : full ? 'See the organisation' : 'Register on the Hub'}{' '}
              <ArrowUpRight size={15} />
            </Button>
            {external && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Listed by {w.organizationName} — opens their website
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
                <CalendarDays size={15} /> {formatWhen(f.startsAt)}
              </span>
              {f.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={15} /> {f.location}
                </span>
              )}
              {!external && (
                <span className="flex items-center gap-2">
                  <UtensilsCrossed size={15} />
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
              <ArrowUpRight size={15} />
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
            <HeartHandshake size={18} />
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
            Apply on the Hub <ArrowUpRight size={15} />
          </Button>
        </motion.article>
      ))}
    </div>
  );
}
