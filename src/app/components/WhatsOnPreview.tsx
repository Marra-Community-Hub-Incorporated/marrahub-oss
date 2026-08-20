import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Button } from './Button';
import {
  formatWhen,
  suburbFrom,
  type DiscoverWorkshop,
} from '../lib/hubDirectory';
import { snapshotItemsFor } from '../lib/discoverInitialData';

/**
 * Homepage preview of the Discover directory. Reads the same
 * `/api/hub/workshops` proxy the Discover page uses (edge-cached for a
 * minute), so the headline numbers are the real ones rather than a figure
 * that quietly goes stale in the copy.
 *
 * Every state still ends in a link to /discover — if the directory can't be
 * reached, the section degrades to its static pitch rather than disappearing.
 */

const PREVIEW_COUNT = 3;

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; items: DiscoverWorkshop[] }
  | { kind: 'unavailable' };

const STATIC_DESCRIPTION =
  "Workshops, classes and community events from local libraries, neighbourhood houses and community centres — gathered into one place so you can see what's on without checking a dozen websites.";

export function WhatsOnPreview() {
  // Seeded from the build-time Discover snapshot for the same reason the
  // Discover page is: the homepage's "what's on" section is the first thing a
  // crawler reads about MARRA's events, and a client-only fetch left it empty.
  const [state, setState] = useState<State>(() => {
    const seeded = snapshotItemsFor('workshops', '') as DiscoverWorkshop[] | null;
    return seeded ? { kind: 'ready', items: seeded } : { kind: 'loading' };
  });
  const isShowingSnapshot = useRef(snapshotItemsFor('workshops', '') !== null);

  useEffect(() => {
    // Already holding the snapshot: refetching on mount would only replace it
    // with the same listings, so leave the good first paint alone.
    if (isShowingSnapshot.current) {
      isShowingSnapshot.current = false;
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('/api/hub/workshops', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        setState({
          kind: 'ready',
          items: (await res.json()) as DiscoverWorkshop[],
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState({ kind: 'unavailable' });
      }
    })();

    return () => controller.abort();
  }, []);

  const items = state.kind === 'ready' ? state.items : [];
  const organisationCount = new Set(items.map((item) => item.organizationName))
    .size;
  const soonest = [...items]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, PREVIEW_COUNT);

  // Only claim numbers we actually have. Anything else falls back to the
  // static pitch, so an empty or unreachable directory never reads as "0".
  //
  // The area is worded loosely on purpose. The feed is not confined to Glen
  // Eira — of the 30 listings live when this was written, 7 were in Malvern East
  // (Stonnington) and 2 in Albert Park (Port Phillip) — so pinning an exact
  // count to "across Glen Eira" stated something the data did not support.
  const hasCounts = items.length > 0 && organisationCount > 0;
  const description = hasCounts
    ? `${items.length} workshops, classes and community events coming up around Glen Eira and neighbouring suburbs, from ${organisationCount} local organisations — gathered into one place so you can see what's on without checking a dozen websites.`
    : STATIC_DESCRIPTION;

  return (
    <section className="py-24 bg-muted/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Right now, near you"
          title="What's on around Glen Eira"
          description={description}
        />

        {state.kind === 'loading' && (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-hidden="true"
          >
            {Array.from({ length: PREVIEW_COUNT }, (_, index) => (
              <div
                key={index}
                className="h-56 rounded-2xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        )}

        {soonest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {soonest.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border flex flex-col"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  {item.organizationName}
                </p>
                <h3 className="text-xl font-serif font-semibold text-primary mb-4 leading-snug">
                  {item.title}
                </h3>
                {/* Top-aligned rather than pushed to the bottom: listings
                    carry different numbers of detail rows, and a shared
                    divider line reads better than a shared baseline. */}
                <div className="space-y-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} className="shrink-0" aria-hidden="true" />{' '}
                    {formatWhen(item.startsAt)}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-2">
                      <MapPin size={15} className="shrink-0" aria-hidden="true" />{' '}
                      {suburbFrom(item.location)}
                      {item.postcode && <span>· {item.postcode}</span>}
                    </span>
                  )}
                  {item.costNote && (
                    <span className="flex items-center gap-2">
                      <Ticket size={15} className="shrink-0" aria-hidden="true" /> {item.costNote}
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            href="/discover"
            size="lg"
            className="shadow-xl shadow-primary/10"
          >
            {hasCounts
              ? `Browse all ${items.length} events`
              : 'Browse the directory'}{' '}
            <ArrowRight size={20} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
