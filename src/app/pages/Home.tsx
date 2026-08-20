import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ProgramCard } from '../components/ProgramCard';
import { ImpactCard } from '../components/ImpactCard';
import { CTABanner } from '../components/CTABanner';
import { WhatsOnPreview } from '../components/WhatsOnPreview';
import { featureFlags } from '../featureFlags';
import {
  Users,
  Heart,
  BookOpen,
  Sprout,
  HandHeart,
  Shield,
  Clock,
  MapPin,
  Play,
  CalendarDays,
  ExternalLink,
  X
} from 'lucide-react';

const HUB_ORG_URL = 'https://hub.marrahub.com.au/o/marra-community-hub-inc';

const launchEvent = {
  dateLabel: 'Saturday, 15 August 2026',
  timeLabel: '2:00pm - 6:00pm',
  venueLabel: 'Carnegie Library & Community Centre',
  venueDetail: 'Level 2, 7 Shepparson Avenue, Carnegie',
  title: 'MARRA Launch Meet-Up',
  href: '/launch',
  // Keep in sync with timeLabel: the promo hides itself once the event ends.
  endsAtIso: '2026-08-15T18:00:00+10:00',
};

function launchEventHasEnded() {
  return Date.now() >= new Date(launchEvent.endsAtIso).getTime();
}

const homeEventPopupStorageKey = 'marrahub.homeEventPopupDismissed';

function shouldShowHomeEventPopup() {
  try {
    return window.sessionStorage.getItem(homeEventPopupStorageKey) !== 'true';
  } catch {
    return true;
  }
}

function EventNoticeBanner() {
  return (
    <section className="bg-primary text-primary-foreground border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center self-start rounded-full bg-white/10 ring-1 ring-accent/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              First Event
            </span>
            <p className="text-sm md:text-base text-primary-foreground/90">
              <span className="font-semibold text-white">{launchEvent.title}</span>
              <span className="mx-2 text-accent">|</span>
              {launchEvent.dateLabel}, {launchEvent.timeLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to={launchEvent.href}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-colors"
            >
              See event details
              <Play size={14} aria-hidden="true" />
            </Link>
            <a
              href={HUB_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground/85 hover:text-white transition-colors"
            >
              Open Hub page
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface EventPopupProps {
  open: boolean;
  onClose: () => void;
}

function EventPopup({ open, onClose }: EventPopupProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    // The popup opens on page load, so a keyboard or screen-reader user
    // must land inside it: move focus in, keep Tab cycling within the
    // panel, lock the page behind it, and put focus back on close.
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6 bg-primary/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-5/6 sm:w-full sm:max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-3xl bg-background shadow-2xl shadow-black/25 border border-white/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-event-popup-title"
            aria-describedby="home-event-popup-description"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-8 sm:right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-colors hover:bg-white"
              aria-label="Close event announcement"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="relative min-h-[180px] bg-primary text-primary-foreground">
              <div className="absolute inset-0 bg-cultural-fusion" aria-hidden="true"></div>
              <img
                src={`${import.meta.env.BASE_URL}media/launch/launch-wide-en-poster.jpg`}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/30"></div>
              <div className="relative z-10 p-8 pr-16 md:p-10">
                <span className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-accent/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                  New community event
                </span>
                <h2 id="home-event-popup-title" className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight break-words">
                  A New Digital Community
                </h2>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <p
                id="home-event-popup-description"
                className="text-lg text-muted-foreground leading-relaxed mb-6"
              >
                Join MARRA's first meet-up for AI basics, a sewing workshop, board games,
                coffee, tea, and snacks. Entry is free and everyone is welcome.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <CalendarDays className="text-secondary mb-2" size={22} aria-hidden="true" />
                  <p className="font-semibold text-foreground">{launchEvent.dateLabel}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4">
                  <Clock className="text-secondary mb-2" size={22} aria-hidden="true" />
                  <p className="font-semibold text-foreground">{launchEvent.timeLabel}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4">
                  <MapPin className="text-secondary mb-2" size={22} aria-hidden="true" />
                  <p className="font-semibold text-foreground">{launchEvent.venueLabel}</p>
                  <p className="text-sm text-muted-foreground mt-1">{launchEvent.venueDetail}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href={launchEvent.href} variant="primary" size="lg" className="w-full sm:w-auto">
                  Event Details & Invitation
                </Button>
                <Button
                  href={HUB_ORG_URL}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-primary/20"
                >
                  Open Hub Page
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-medium text-primary border-2 border-primary/20 transition-colors hover:bg-primary/5"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Home() {
  const eventPromoActive = !launchEventHasEnded();
  const [eventPopupOpen, setEventPopupOpen] = useState(
    () => eventPromoActive && shouldShowHomeEventPopup(),
  );
  const heroBackgroundUrl = `${import.meta.env.BASE_URL}media/hero-background.webp`;
  const closeEventPopup = () => {
    setEventPopupOpen(false);
    try {
      window.sessionStorage.setItem(homeEventPopupStorageKey, 'true');
    } catch {
      // Dismissal is still valid even if sessionStorage is unavailable.
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <EventPopup open={eventPopupOpen} onClose={closeEventPopup} />
      {eventPromoActive && <EventNoticeBanner />}

      {/* 
          Hero Section: 'The Shared Journey'
          Redesigned with a high-quality background image and signature curved bottom.
      */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
        
        {/* Background Image with Dark Overlay for Contrast */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundUrl})` }}
          aria-hidden="true"
        >
          {/* Multi-layered gradient overlay:
              1. A dark base to ensure text readability.
              2. A subtle primary-tinted gradient to unify the brand colors.
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </div>

        {/* Content Container: Constrained for readability on wide screens */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main Headline */}
            <h1 className="text-white mb-8 font-serif font-semibold leading-[1.1] tracking-tight text-4xl md:text-7xl lg:text-8xl">
              Bringing Communities <br className="hidden md:block" /> 
              <span className="text-accent italic">Together</span>
            </h1>
            
            {/* Body Text */}
            <p className="text-lg md:text-2xl mb-12 text-white/90 leading-relaxed max-w-2xl mx-auto font-sans font-light text-balance">
              Inspired by Aboriginal language, representing connection and helping hands.
              We are growing an interactive community hub in Caulfield South that brings people
              together through care, culture, and belonging.
            </p>
            
            {/* CTA Buttons: Fixed positioning, contrast, and spacing */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Button 
                href="/programs" 
                size="lg" 
                className="w-full sm:w-auto h-16 px-10 text-lg shadow-xl bg-secondary hover:bg-secondary/90 text-white border-none rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                Explore Programs
              </Button>
              <Button
                href={featureFlags.volunteer ? '/volunteer' : '/contact'}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-16 px-10 text-lg bg-white/10 hover:bg-white/20 border-white/40 text-white backdrop-blur-md rounded-2xl transition-all hover:scale-105 active:scale-95 focus-visible:outline-white"
              >
                {featureFlags.volunteer ? 'Become a Volunteer' : 'Get in touch'}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Signature Curved Bottom: SVG Divider for crisp rendering */}
        <div className="absolute bottom-[-1px] left-0 w-full leading-[0] z-10 pointer-events-none">
          <svg 
            viewBox="0 0 1440 120"
            aria-hidden="true" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 120L1440 120L1440 0C1440 0 1080 120 720 120C360 120 0 0 0 0L0 120Z" 
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* Volunteer IT Program Announcement */}
      <section className="pt-16 pb-4 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-12 shadow-2xl shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary rounded-full blur-[100px]"></div>
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-grow">
                <span className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-accent/40 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                  Now running
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                  Now Recruiting: Grant Writer & Social Media Manager
                </h2>
                <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl">
                  Two volunteer roles are open. Help us win the grants that fund our programs, or
                  run MARRA's social media and share our community's stories. Applications for
                  developer roles are closed for now, with a new intake opening soon.
                </p>
              </div>
              <div className="shrink-0">
                <Button
                  href="/programs"
                  variant="secondary"
                  size="lg"
                  className="w-full lg:w-auto shadow-xl shadow-black/10"
                >
                  Learn More & Apply
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's on near you — live preview of the Discover directory */}
      <WhatsOnPreview />

      {/* Why MARRA Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-secondary/30 rounded-tl-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/30 rounded-br-3xl"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1765614766505-b4afa9eef2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwaW5nJTIwaGFuZHMlMjB0b2dldGhlciUyMHN1cHBvcnR8ZW58MXx8fHwxNzcwNTk1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Hands joined together to represent support and community connection"
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover relative z-10"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader 
                subtitle="Our Purpose"
                title="Connection, Helping Hands & Working Together"
                align="left"
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  The name <strong className="text-primary font-semibold">MARRA</strong> is inspired by Aboriginal language. 
                  It represents the very essence of what we do: reaching out, providing support, and building lasting bonds.
                </p>
                <p>
                  We are building MARRA as a trusted community hub with a commitment to transparency,
                  cultural awareness, and practical support for families and individuals across
                  Caulfield South and Glen Eira.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="What We Offer"
            title="Community Programs"
            description="Purpose-built initiatives designed to foster connection and wellbeing for every stage of life."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProgramCard 
                icon={Users}
                title="Family Support Services"
                description="Comprehensive support for families navigating life's challenges, including parenting workshops, family counseling, and peer support groups."
                outcomes={[
                  "Stronger family connections",
                  "Access to resources and support",
                  "Community belonging"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProgramCard 
                icon={BookOpen}
                title="Educational Programs"
                description="Learning opportunities for all ages, from early childhood education to adult literacy and skills development programs."
                outcomes={[
                  "Improved literacy and skills",
                  "Lifelong learning pathways",
                  "Career development support"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProgramCard 
                icon={Heart}
                title="Wellbeing & Health"
                description="Mental health support, physical wellness activities, and holistic programs promoting overall community health."
                outcomes={[
                  "Better mental health outcomes",
                  "Active and healthy lifestyles",
                  "Reduced social isolation"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProgramCard 
                icon={Sprout}
                title="Youth Development"
                description="Engaging programs for young people focusing on leadership, mentorship, creative expression, and life skills."
                outcomes={[
                  "Youth empowerment",
                  "Leadership development",
                  "Positive peer connections"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProgramCard 
                icon={HandHeart}
                title="Elder Care & Support"
                description="Dedicated services for older community members, including social activities, health support, and companionship programs."
                outcomes={[
                  "Reduced loneliness",
                  "Active aging support",
                  "Intergenerational connections"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ProgramCard 
                icon={Shield}
                title="Inclusion & Advocacy"
                description="Support for diverse communities, cultural inclusion initiatives, and advocacy for community rights and accessibility."
                outcomes={[
                  "Cultural safety and respect",
                  "Equal access to services",
                  "Community voice amplification"
                ]}
              />
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button href="/programs" variant="primary" size="lg">
              View All Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Our Targets"
            title="What We Are Building Together"
            description="We are building an interactive, community-led space where people do not just attend, but participate, connect, and help shape what comes next. These are the early goals guiding our first stage."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ImpactCard 
                number="50+"
                label="Early Community Reach"
                description="Welcoming local people into events, conversations, and first-round activities"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full"
            >
              <ImpactCard 
                number="5"
                label="Interactive Pilot Programs"
                description="Hands-on programs that invite participation, feedback, and real community input"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full"
            >
              <ImpactCard 
                number="12+"
                label="Interactive Sessions"
                description="Events, workshops, and meetups designed for people to join in, respond, and connect"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full"
            >
              <ImpactCard 
                number="100%"
                label="Community Shaped"
                description="A space where local voices help guide what we create, test, and improve"
              />
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button href="/about" variant="primary">
              About Our Mission
            </Button>
          </div>
        </div>
      </section>

      {/* Governance Preview Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader 
                subtitle="Transparency & Accountability"
                title="Built on Trust"
                align="left"
              />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  MARRA operates with complete transparency and strong governance structures. 
                  We are committed to ethical practices, safeguarding, and accountability to our community.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Independent board oversight and ethical governance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Comprehensive safeguarding and child protection policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Regular reporting and community consultation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Cultural safety and inclusion frameworks</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button href="/governance" variant="outline">
                  View Governance Structure
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-muted/50 rounded-2xl px-14 py-10 border border-border"
            >
              <h3 className="text-4xl font-semibold mb-8">Our Commitments</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Community-First Approach</h4>
                  <p className="text-base text-muted-foreground">
                    Every decision is guided by the needs and voices of our community members.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Cultural Respect</h4>
                  <p className="text-base text-muted-foreground">
                    We honour Aboriginal heritage and maintain culturally safe spaces for all.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Financial Transparency</h4>
                  <p className="text-base text-muted-foreground">
                    Open reporting on funding, expenditure, and community investment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Continuous Improvement</h4>
                  <p className="text-base text-muted-foreground">
                    Regular evaluation and adaptation based on community feedback.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Where We Are"
            title="Community Hub in Caulfield South"
            description="Based in Caulfield South, with a long-term vision to support communities across Glen Eira."
          />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1766050588355-0bed0aba1eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWxib3VybmUlMjBjaXR5c2NhcGUlMjB2aWN0b3JpYXxlbnwxfHx8fDE3NzA1OTUzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Local skyline representing the wider Glen Eira community MARRA hopes to support"
                loading="lazy"
                decoding="async"
                className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Primary Location</h4>
                <p className="text-muted-foreground">
                  Caulfield South, VIC<br />
                  Glen Eira, Australia
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Service Areas</h4>
                <p className="text-muted-foreground">
                  MARRA Community Hub is starting in Caulfield South and aims to grow its reach
                  across Glen Eira through local partnerships.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
                <p className="text-muted-foreground mb-4">
                  Have questions or want to learn more? We'd love to hear from you.
                </p>
                <Button href="/contact" variant="primary">
                  Get in Touch
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner 
            title="Join Our Community"
            description="Whether you're looking for support, want to volunteer, or represent a council or funding body, we welcome you to connect with MARRA."
            primaryButtonText="Explore Programs"
            primaryButtonHref="/programs"
            secondaryButtonText="Contact Us"
            secondaryButtonHref="/contact"
          />
        </div>
      </section>
    </div>
  );
}
