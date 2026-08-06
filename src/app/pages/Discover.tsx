import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  HeartHandshake,
  MapPin,
  Search,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { CTABanner } from '../components/CTABanner';
import { Button } from '../components/Button';

// The Discover directory lives on the Hub platform (hub.marrahub.com.au). This
// page previews it here so a visitor doesn't have to already know the Hub
// exists — every card links out to the org's Hub page to register or apply.
const HUB_SITE_URL = 'https://hub.marrahub.com.au';

interface DiscoverWorkshop {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  postcode: string;
  spotsRemaining: number;
  organizationName: string;
  organizationSlug: string;
}

interface DiscoverFood {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  spotsRemaining: number;
  organizationName: string;
  organizationSlug: string;
}

interface DiscoverOrg {
  name: string;
  slug: string;
  description: string;
  upcomingWorkshops: number;
  upcomingFoodEvents: number;
}

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

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type State = { kind: 'loading' } | { kind: 'ready'; items: unknown[] } | { kind: 'error' };

export function Discover() {
  const [tab, setTab] = useState<Tab>('workshops');
  const [q, setQ] = useState('');
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    setState({ kind: 'loading' });
    const section = SECTION_BY_TAB[tab];
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        const qs = params.toString();
        const res = await fetch(`/api/hub/${section}${qs ? `?${qs}` : ''}`);
        if (!res.ok) throw new Error(String(res.status));
        setState({ kind: 'ready', items: (await res.json()) as unknown[] });
      } catch {
        setState({ kind: 'error' });
      }
    }, 250); // debounce typing
    return () => clearTimeout(timer);
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Discover the Hub</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Live workshops, free food giveaways and volunteering opportunities from every
              community organisation on the MARRA Hub platform — browse here, then head to the
              Hub to register.
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
            description="One search box, three ways to help. Everything shown here is live on the Hub."
          />

          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by suburb, postcode, organisation or topic…"
                aria-label="Search the directory"
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-5 text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <nav aria-label="Directory sections" className="flex flex-wrap justify-center gap-2 mb-12">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-current={tab === key ? 'page' : undefined}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'border border-border bg-card text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>

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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="See it all on the Hub"
            description="Register for a workshop, reserve a food giveaway or apply to volunteer — every listing here links straight to the organisation's page on the MARRA Hub platform."
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
        const full = w.spotsRemaining <= 0;
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
              <span className="flex items-center gap-2">
                <Users size={15} />
                {full ? 'Full' : `${w.spotsRemaining} spot${w.spotsRemaining === 1 ? '' : 's'} left`}
              </span>
            </div>
            <Button
              href={`${HUB_SITE_URL}/o/${w.organizationSlug}`}
              variant={full ? 'outline' : 'primary'}
              size="sm"
              className="mt-5 w-full"
            >
              {full ? 'See the organisation' : 'Register on the Hub'} <ArrowUpRight size={15} />
            </Button>
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
        const gone = f.spotsRemaining <= 0;
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
              <span className="flex items-center gap-2">
                <UtensilsCrossed size={15} />
                {gone ? 'All portions taken' : `${f.spotsRemaining} left`}
              </span>
            </div>
            <Button
              href={`${HUB_SITE_URL}/o/${f.organizationSlug}`}
              variant={gone ? 'outline' : 'primary'}
              size="sm"
              className="mt-5 w-full"
            >
              {gone ? 'See the organisation' : 'Reserve on the Hub'} <ArrowUpRight size={15} />
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
