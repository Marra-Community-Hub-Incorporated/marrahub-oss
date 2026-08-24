import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { CTABanner } from '../components/CTABanner';
import {
  CalendarDays,
  Clock,
  MapPin,
  Bot,
  Scissors,
  Dices,
  Coffee,
  Smile,
  Play,
  Camera,
} from 'lucide-react';

type VideoLang = 'en' | 'uk';

const activities = [
  {
    icon: Bot,
    title: 'An Intro to AI Basics',
    description: 'A friendly, practical taste of what AI can do for you — no jargon, no experience needed.',
  },
  {
    icon: Scissors,
    title: 'Sewing Workshop',
    description: 'Hands-on and beginner-friendly. People stitched something small and took it home.',
  },
  {
    icon: Dices,
    title: 'Board Games',
    description: 'The easiest way to meet new people is over a table — and the tables stayed full.',
  },
  {
    icon: Coffee,
    title: 'Coffee, Tea & Snacks',
    description: 'On us, all afternoon. A cup, a seat, and plenty of conversation.',
  },
];

/**
 * Photos from the day. Drop the files into `public/media/launch/photos/` and add
 * an entry here — the gallery appears automatically once this list isn't empty,
 * and until then the section shows a "photos coming soon" note instead.
 */
const photos: { file: string; alt: string }[] = [];

export function LaunchEvent() {
  const [lang, setLang] = useState<VideoLang>('en');
  const media = (file: string) => `${import.meta.env.BASE_URL}media/launch/${file}`;

  const languageToggle = (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-muted p-1.5"
      role="group"
      aria-label="Invitation video language"
    >
      {(
        [
          { value: 'en', label: 'English' },
          { value: 'uk', label: 'Українською' },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={lang === option.value}
          onClick={() => setLang(option.value)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            lang === option.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero: mirrors the dark-green look of the invitation videos */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-cultural-fusion" aria-hidden="true"></div>
        <div className="absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent rounded-full blur-[140px]"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary rounded-full blur-[140px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pt-28 md:pb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-accent/40 backdrop-blur-md px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">
              Past event · 15 August 2026
            </span>

            <h1 className="font-serif font-semibold text-white leading-[1.1] tracking-tight text-4xl md:text-6xl lg:text-7xl mb-6">
              A New <span className="text-accent italic">Digital Community</span>
            </h1>

            <p className="text-lg md:text-2xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto font-light text-balance mb-12">
              Our first meet-up, supported by Glen Eira City Council. Thank you to everyone who
              came along and said hello — this is a look back at the day.
            </p>

            {/* Key facts, styled like the glassy cards in the invitation video */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.14] to-white/[0.06] backdrop-blur-md ring-1 ring-white/15 shadow-lg shadow-black/10 px-6 py-4 text-left transition-colors hover:ring-accent/40">
                <span
                  className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/40 text-accent flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <CalendarDays size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-white">Saturday, 15 August 2026</p>
                  <p className="text-sm text-primary-foreground/75">Our first event</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.14] to-white/[0.06] backdrop-blur-md ring-1 ring-white/15 shadow-lg shadow-black/10 px-6 py-4 text-left transition-colors hover:ring-accent/40">
                <span
                  className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/40 text-accent flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Clock size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-white">2:00pm – 6:00pm</p>
                  <p className="text-sm text-primary-foreground/75">Four hours, drop-in</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.14] to-white/[0.06] backdrop-blur-md ring-1 ring-white/15 shadow-lg shadow-black/10 px-6 py-4 text-left transition-colors hover:ring-accent/40">
                <span
                  className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/40 text-accent flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <MapPin size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-white">Carnegie Library &amp; Community Centre</p>
                  <p className="text-sm text-primary-foreground/75">Level 2 · 7 Shepparson Ave, Carnegie</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <a
                href="#photos"
                className="inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 font-medium active:scale-95 hover:scale-105 bg-secondary text-white hover:bg-secondary/90 h-14 px-9 text-lg shadow-xl w-full sm:w-auto"
              >
                <Camera size={20} aria-hidden="true" />
                Photos from the Day
              </a>
              <a
                href="#watch"
                className="inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 font-medium active:scale-95 hover:scale-105 bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white backdrop-blur-md h-14 px-9 text-lg w-full sm:w-auto"
              >
                <Play size={20} aria-hidden="true" />
                Watch the Invitation
              </a>
            </div>
          </motion.div>
        </div>

        {/* Signature curved bottom, as on the home hero */}
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

      {/* Photos from the day */}
      <section id="photos" className="py-24 bg-background scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Photos"
            title="A Look Back at the Day"
            description="A room full of new faces, board games, sewing, and a lot of coffee."
          />

          {photos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <motion.figure
                  key={photo.file}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <img
                    src={media(`photos/${photo.file}`)}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.figure>
              ))}
            </div>
          ) : (
            /* Deliberately not scroll-revealed: this placeholder is the only thing
               in its section, so a missed reveal would leave the section blank. */
            <div className="rounded-2xl border border-dashed border-primary/25 bg-muted/20 px-8 py-16 text-center">
              <span
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary"
                aria-hidden="true"
              >
                <Camera size={30} aria-hidden="true" />
              </span>
              <h3 className="font-serif text-2xl text-foreground mb-3">Photos are on their way</h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                We're sorting through the pictures from the afternoon and will add them here
                shortly. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Invitation videos */}
      <section id="watch" className="py-24 bg-muted/20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Press Play"
            title="The Invitation We Sent"
            description="Thirty seconds shy of everything you needed to know — made with love, in both of our community's languages."
          />

          <div className="flex justify-center mb-12">{languageToggle}</div>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <video
                key={`wide-${lang}`}
                className="w-full aspect-video rounded-3xl shadow-2xl shadow-primary/20 bg-primary object-cover"
                poster={media(`launch-wide-${lang}-poster.jpg`)}
                preload="none"
                controls
                playsInline
                aria-label={
                  lang === 'en'
                    ? 'Launch event invitation video (English)'
                    : 'Launch event invitation video (Ukrainian)'
                }
              >
                <source src={media(`launch-wide-${lang}.mp4`)} type="video/mp4" />
                Your browser does not support embedded videos.
              </video>
              <p className="text-center text-muted-foreground mt-5">
                The full invitation — date, place, and what was on.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto w-full max-w-[300px]"
            >
              <video
                key={`story-${lang}`}
                className="w-full aspect-[9/16] rounded-[2rem] ring-8 ring-primary/10 shadow-2xl shadow-primary/20 bg-primary object-cover"
                poster={media(`launch-story-${lang}-poster.jpg`)}
                preload="none"
                controls
                playsInline
                aria-label={
                  lang === 'en'
                    ? 'Vertical story version of the invitation (English)'
                    : 'Vertical story version of the invitation (Ukrainian)'
                }
              >
                <source src={media(`launch-story-${lang}.mp4`)} type="video/mp4" />
                Your browser does not support embedded videos.
              </video>
              <p className="text-center text-muted-foreground mt-5 text-sm">
                The story version — made for sharing, and the one that brought most people along.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What was on */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="What Was On"
            title="An Afternoon of Good Company"
            description="Four hours, four corners of the room, and no schedule to keep — people wandered between whatever took their fancy."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                  <activity.icon size={28} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-3">{activity.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 rounded-2xl bg-accent/15 border border-accent/30 px-8 py-6 flex items-center justify-center gap-4 text-center"
          >
            <Smile className="text-secondary shrink-0" size={28} aria-hidden="true" />
            <p className="text-lg text-foreground">
              Entry was free and nothing needed booking —{' '}
              <span className="font-semibold text-primary">and that's how we'll keep it.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Where it happened */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                subtitle="Where It Happened"
                title="Carnegie Library & Community Centre"
                align="left"
              />
              <div className="max-w-[70ch] space-y-9 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We were upstairs on <strong className="text-primary font-semibold">Level 2</strong>{' '}
                  at 7 Shepparson Avenue, Carnegie — right in the heart of Carnegie, a short walk
                  from Koornang Road's shops and public transport.
                </p>
                <p>
                  Thank you to the team at the centre for making the room feel like ours for the
                  afternoon.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
                <MapPin className="text-secondary shrink-0 mt-1" size={24} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">The Venue</h4>
                  <p className="text-muted-foreground">
                    Level 2, 7 Shepparson Avenue
                    <br />
                    Carnegie, VIC 3163
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
                <Clock className="text-secondary shrink-0 mt-1" size={24} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">The Afternoon</h4>
                  <p className="text-muted-foreground">
                    Doors were open from 2:00pm to 6:00pm, and people came and went the whole
                    time — exactly as we'd hoped.
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
                <Smile className="text-secondary shrink-0 mt-1" size={24} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">More to Come</h4>
                  <p className="text-muted-foreground">
                    This was our first meet-up, not our last. We'll announce the next one here and
                    on our socials.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported by Glen Eira City Council */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-secondary font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              With Thanks
            </p>
            <img
              src={`${import.meta.env.BASE_URL}media/gecc/gecc-supported-black.png`}
              alt="Proudly supported by Glen Eira City Council"
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-[420px] h-auto"
            />
            <p className="text-muted-foreground text-lg leading-relaxed mt-8">
              Our first meet-up was proudly supported by Glen Eira City Council — thank you for
              helping a new community take its first step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Missed It? There'll Be More"
            description="This was our first meet-up and we're already thinking about the next one. Get in touch and we'll let you know when it's on."
            primaryButtonText="Get in Touch"
            primaryButtonHref="/contact"
            secondaryButtonText="Explore Our Programs"
            secondaryButtonHref="/programs"
          />
        </div>
      </section>
    </div>
  );
}
