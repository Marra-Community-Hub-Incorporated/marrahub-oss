import React from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ImpactCard } from '../components/ImpactCard';
import { AuroraBackground } from '../components/AuroraBackground';
import { featureFlags } from '../featureFlags';
import {
  HandHeart,
  Handshake,
  Mail,
  ArrowRight,
  MapPin,
  QrCode,
  Clock,
  Utensils,
  ScanLine,
} from 'lucide-react';

// Volunteer sign-up isn't public yet (see featureFlags): every volunteer CTA
// gracefully falls back to the Contact page when the flow is hidden.
const involveHref = featureFlags.volunteer ? '/volunteer' : '/contact';
const involveLabel = featureFlags.volunteer ? 'Become a Volunteer' : 'Get in touch';

// Warm, representative community photography (Unsplash — allowed by the site CSP).
// These set mood; they are not photos of Marra's own members or events.
const ux = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const audiences = [
  {
    id: 'photo-1509099836639-18ba1795216d',
    title: 'Families & Children',
    note: 'Parents, carers, and kids of every age.',
    alt: 'Children smiling together outdoors',
  },
  {
    id: 'photo-1517486808906-6ca8b3f04846',
    title: 'Young People',
    note: 'Mentorship, creativity, and room to grow.',
    alt: 'A group of young adults sitting together and smiling',
  },
  {
    id: 'photo-1573497019940-1c28c88b4f3e',
    title: 'Older Adults',
    note: 'Connection, wellbeing, and good company.',
    alt: 'An older woman smiling warmly',
  },
  {
    id: 'photo-1529156069898-49953e39b3ac',
    title: 'Diverse Communities',
    note: 'Every culture, ability, and background.',
    alt: 'Friends standing arm in arm, looking out together',
  },
  {
    id: 'photo-1556484687-30636164638b',
    title: 'Individuals in Need',
    note: 'Support for anyone doing it tough.',
    alt: 'A circle of hands of different skin tones resting together on a table',
  },
];

const pillars = [
  {
    id: 'photo-1571019613454-1cb2f99b2d8b',
    title: 'Support & wellbeing',
    note: 'Practical help for everyday life.',
    alt: 'A person exercising on a mat',
  },
  {
    id: 'photo-1543269865-cbf427effbad',
    title: 'Learning & opportunity',
    note: 'Skills and pathways for every age.',
    alt: 'Young people learning together around a laptop',
  },
  {
    id: 'photo-1543807535-eceef0bc6599',
    title: 'Connection & belonging',
    note: 'Spaces that bring neighbours together.',
    alt: 'Three friends talking and laughing on a city street',
  },
];

const values = [
  { title: 'Care', note: 'We lead with compassion.' },
  { title: 'Connection', note: 'We help everyone belong.' },
  { title: 'Integrity', note: 'We act openly and honestly.' },
  { title: 'Respect', note: 'We honour every person.' },
];

const targets = [
  { number: '50+', label: 'Early Community Reach', description: 'People we hope to welcome first' },
  { number: '5', label: 'Pilot Programs', description: 'Hands-on and shaped by locals' },
  { number: '12+', label: 'Interactive Sessions', description: 'Workshops and meetups to join' },
  { number: '100%', label: 'Community Shaped', description: 'Local voices guiding what we build' },
];

// Small stylised QR glyph drawn in SVG (no external asset) for the app vignette.
function QrGlyph({ size = 88 }: { size?: number }) {
  const n = 13;
  const cell = size / n;
  const inFinder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3);
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (inFinder(r, c)) continue;
      // Deterministic pseudo-pattern so the glyph reads as a QR code.
      if ((r * 3 + c * 5 + ((r ^ c) & 3)) % 4 < 2) {
        cells.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} rx={cell * 0.15} />,
        );
      }
    }
  }
  const finder = (x: number, y: number) => (
    <g key={`f-${x}-${y}`}>
      <rect x={x} y={y} width={cell * 3} height={cell * 3} rx={cell * 0.6} />
      <rect
        x={x + cell * 0.55}
        y={y + cell * 0.55}
        width={cell * 1.9}
        height={cell * 1.9}
        rx={cell * 0.4}
        fill="var(--card)"
      />
      <rect x={x + cell} y={y + cell} width={cell} height={cell} rx={cell * 0.25} />
    </g>
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Example QR code"
      fill="var(--primary)"
    >
      {cells}
      {finder(0, 0)}
      {finder(size - cell * 3, 0)}
      {finder(0, size - cell * 3)}
    </svg>
  );
}

export function Home() {
  const reduce = useReducedMotion();

  // On-scroll reveal; disabled entirely under reduced motion.
  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  // Hero reveals on load rather than on scroll.
  const enter = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background">
        <AuroraBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: value proposition — headline + one line */}
            <motion.div {...enter(0)} className="lg:col-span-6">
              <p className="flex items-center gap-2 text-secondary font-semibold uppercase tracking-[0.2em] text-xs mb-6">
                <MapPin size={14} aria-hidden="true" />
                Caulfield South · Glen Eira, VIC
              </p>
              <h1 className="font-serif text-primary leading-[1.05] tracking-tight text-4xl md:text-6xl lg:text-7xl">
                A community where everyone <span className="italic text-secondary">belongs</span>.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                A digital-first community hub, taking shape in Caulfield South. Not open yet — help
                shape what we become.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Button href={involveHref} variant="primary" size="lg" className="w-full sm:w-auto">
                  {involveLabel}
                </Button>
                <Button href="/about" variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore our vision
                </Button>
              </div>
            </motion.div>

            {/* Right: photo composition with the meaning of Marra overlaid */}
            <motion.div {...enter(0.15)} className="lg:col-span-6">
              <div className="relative">
                <div className="overflow-hidden rounded-[1.75rem] shadow-xl shadow-primary/10">
                  <img
                    src={ux('photo-1511632765486-a01980e01a18', 1100)}
                    alt="Friends standing together at sunset with their arms around each other"
                    width={1100}
                    height={730}
                    decoding="async"
                    className="h-[320px] md:h-[440px] w-full object-cover"
                  />
                </div>
                {/* Overlapping meaning card */}
                <div className="absolute -bottom-6 -left-2 sm:left-6 max-w-[19rem] rounded-2xl bg-primary text-primary-foreground p-6 shadow-xl shadow-primary/20">
                  <p className="text-accent font-semibold uppercase tracking-[0.2em] text-[0.65rem] mb-2">
                    The name
                  </p>
                  <p className="font-serif text-xl leading-snug">
                    <span className="text-accent">Marra</span> means connection and helping hands.
                  </p>
                  <p className="mt-2 text-sm text-primary-foreground/75">
                    Inspired by Aboriginal language.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Who it's for" title="A hub for the whole community" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((item, i) => (
              <motion.div key={item.title} {...rise(i * 0.06)}>
                <div className="group h-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ux(item.id, 760)}
                      alt={item.alt}
                      width={760}
                      height={352}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-primary mb-1 leading-snug">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.note}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we're building (vision, not live services) ──────────────── */}
      <section className="py-20 md:py-24 bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="What we're building"
            title="The hub we're working towards"
            description="Areas we're planning as Marra grows. Nothing is running yet — we're building it with the community."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item, i) => (
              <motion.div key={item.title} {...rise(i * 0.08)}>
                <div className="group h-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={ux(item.id, 760)}
                      alt={item.alt}
                      width={760}
                      height={320}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-serif text-2xl text-primary mb-2 leading-snug">{item.title}</h3>
                    <p className="text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...rise(0.1)} className="mt-8 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 font-medium text-primary hover:text-secondary transition-colors"
            >
              See the full picture
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── A digital community centre ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-primary text-primary-foreground border-t border-border">
        <AuroraBackground className="opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            {/* Copy */}
            <motion.div {...rise(0)}>
              <p className="text-accent font-semibold uppercase tracking-[0.2em] text-xs mb-5">
                A digital community centre
              </p>
              <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight">
                Built for how people live today.
              </h2>
              <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
                We&apos;re building simple tools so taking part is effortless — in development now,
                ready for the day we open.
              </p>

              <ul className="mt-8 space-y-4 max-w-md">
                {[
                  { icon: QrCode, title: 'QR workshop sign-ups', note: 'Scan, book, and check in.' },
                  { icon: Clock, title: 'Volunteer hours', note: 'Tracked automatically.' },
                  { icon: Utensils, title: 'FoodQue', note: 'Fair, dignified free-food queues.' },
                ].map(({ icon: Icon, title, note }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{title}</span>
                      <span className="block text-sm text-primary-foreground/70">{note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CSS/SVG app vignette */}
            <motion.div {...rise(0.12)} className="relative">
              <div className="relative mx-auto w-full max-w-sm">
                {/* Lifestyle photo banner — the device card overlaps up over it */}
                <div className="overflow-hidden rounded-[1.5rem] shadow-xl shadow-black/20">
                  <img
                    src={ux('photo-1522202176988-66273c2fd55f', 720)}
                    alt="Young people collaborating around a laptop"
                    width={720}
                    height={288}
                    loading="lazy"
                    decoding="async"
                    className="h-40 w-full object-cover"
                  />
                </div>
                {/* Device card */}
                <div className="relative z-10 -mt-12 mx-auto w-[92%] rounded-[2rem] border border-white/15 bg-card text-foreground shadow-2xl shadow-black/30 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif text-primary text-lg">Marra Hub</span>
                    <span className="rounded-full bg-secondary/10 text-secondary text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-1">
                      In development
                    </span>
                  </div>

                  <div className="rounded-2xl bg-muted/60 border border-border p-4">
                    <p className="text-secondary font-semibold uppercase tracking-[0.15em] text-[0.6rem] mb-3">
                      Workshop check-in
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-card border border-border p-2">
                        <QrGlyph size={80} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-primary text-lg leading-tight">Community cooking</p>
                        <p className="text-sm text-muted-foreground">Saturdays · all welcome</p>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                          <ScanLine size={14} aria-hidden="true" />
                          Scan to sign up
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="text-2xl font-serif font-semibold text-primary tabular-nums">12.5h</p>
                      <p className="text-xs text-muted-foreground">Volunteer hours</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="text-2xl font-serif font-semibold text-primary tabular-nums">3rd</p>
                      <p className="text-xs text-muted-foreground">in the FoodQue</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="What guides us" title="Four values, in everything we do" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((item, i) => (
              <motion.div key={item.title} {...rise(i * 0.06)}>
                <div className="h-full bg-card rounded-2xl p-6 md:p-7 border border-border shadow-sm">
                  <h3 className="font-serif text-xl text-primary mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our goals (aspirational targets, clearly framed) ─────────────── */}
      <section className="py-20 md:py-24 bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Where we're headed"
            title="Our goals for the first stage"
            description="Milestones we're aiming for — not numbers we've reached yet."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targets.map((item, i) => (
              <motion.div key={item.label} {...rise(i * 0.08)} className="h-full">
                <ImpactCard number={item.number} label={item.label} description={item.description} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get involved ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Get involved"
            title="Help shape what Marra becomes"
            description="We're just getting started — there's real room to make a difference."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div {...rise(0)}>
              <div className="h-full flex flex-col bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 text-secondary">
                  <HandHeart size={24} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-2">Volunteer</h3>
                <p className="text-muted-foreground mb-6">Give your time and skills as we build.</p>
                <div className="mt-auto">
                  <Button href={involveHref} variant="primary">
                    {involveLabel}
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div {...rise(0.08)}>
              <div className="h-full flex flex-col bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 text-secondary">
                  <Handshake size={24} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-2">Partner with us</h3>
                <p className="text-muted-foreground mb-6">Councils, schools, and local organisations.</p>
                <div className="mt-auto">
                  <Button href="/contact" variant="outline">
                    Become a partner
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div {...rise(0.16)}>
              <div className="h-full flex flex-col bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 text-secondary">
                  <Mail size={24} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-2">Stay in touch</h3>
                <p className="text-muted-foreground mb-6">Questions or ideas? We&apos;d love to hear.</p>
                <div className="mt-auto">
                  <Button href="/contact" variant="outline">
                    Contact us
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...rise(0.1)}
            className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center text-center text-sm text-muted-foreground"
          >
            <span>Independent governance, safeguarding, and cultural safety guide everything we do.</span>
            <Link
              to="/governance"
              className="inline-flex items-center justify-center gap-1 font-medium text-primary hover:text-secondary transition-colors"
            >
              Our governance
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
