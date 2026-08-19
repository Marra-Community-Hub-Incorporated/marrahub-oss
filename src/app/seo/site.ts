import { getDiscoverSnapshot } from '../lib/discoverInitialData';
import { assignUniqueEventPaths } from '../lib/eventSlug';
import type { DiscoverWorkshop } from '../lib/hubDirectory';

export type SeoPageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords: string[];
  pageType: SeoPageType;
  /** Optional page-specific share image; falls back to siteConfig.defaultImagePath. */
  image?: {
    path: string;
    width: number;
    height: number;
    alt: string;
  };
}

export const siteConfig = {
  // The name the site actually brands itself with, and what Google should show
  // for the entity. It read 'MARRA Community Centre' — a string that appears
  // nowhere in the UI and is not the registered name either (see legalName).
  name: 'MARRA Community Hub',
  /** Registered entity name as held by the ACNC/ABR — not a display name. */
  legalName: 'Marra Community Hub Incorporated',
  alternateName: 'MARRA Community Hub',
  shortName: 'MARRA',
  siteUrl: 'https://marrahub.com.au',
  language: 'en-AU',
  locale: 'en_AU',
  themeColor: '#1e453a',
  description:
    'MARRA is a community hub in Caulfield South connecting people through care, local partnerships, and interactive community programs.',
  email: 'hello@marrahub.com.au',
  phones: ['+61433212855'],
  locality: 'Caulfield South',
  region: 'VIC',
  country: 'AU',
  abn: '79178583024',
  /**
   * Public registers that identify this exact entity, for Organization.sameAs.
   * Verified to resolve and to name "Marra Community Hub Incorporated", ABN
   * active from 12 Feb 2026. ACNC is deliberately absent: its charity profiles
   * have no stable URL derivable from an ABN, and an unverified link in
   * structured data is worse than a missing one.
   */
  sameAs: ['https://abr.business.gov.au/ABN/View?abn=79178583024'],
  logoPath: '/media/favicon/favicon.png',
  faviconPath: '/media/favicon/favicon.png',
  defaultImagePath: '/media/Seo_Prev.jpg',
} as const;

// Mirrored in scripts/seo-build.mjs (which can't import this TS module) —
// keep both copies in sync or prerendered HTML serves stale meta tags.
export const pageSeoMap: Record<string, PageSeoMeta> = {
  '/': {
    title: 'MARRA Community Hub | Interactive Community Centre in Caulfield South',
    description:
      'Discover MARRA Community Hub, an interactive community centre in Caulfield South with programs, partnerships, and local support.',
    keywords: [
      'MARRA Community Hub',
      'MARRA Community Centre',
      'community hub Caulfield South',
      'community centre Glen Eira',
      'interactive community programs',
      'community support Glen Eira',
    ],
    pageType: 'WebPage',
  },
  '/launch': {
    title: 'Our First Meet-Up — 15 August 2026 | MARRA Community Hub',
    description:
      "A look back at MARRA Community Hub's first community meet-up: Saturday 15 August 2026, 2–6pm at Carnegie Library & Community Centre. AI basics, a sewing workshop, board games, coffee and snacks — supported by Glen Eira City Council.",
    keywords: [
      'MARRA first meet-up',
      'MARRA past events',
      'community event Glen Eira',
      'Carnegie Library community centre event',
      'free community meet-up Melbourne',
      'community hub Carnegie',
    ],
    pageType: 'WebPage',
    image: {
      path: '/media/launch/launch-wide-en-poster.jpg',
      width: 1280,
      height: 720,
      alt: "Still from the invitation to MARRA Community Hub's first meet-up on 15 August 2026 at Carnegie Library & Community Centre",
    },
  },
  '/about': {
    title: 'About MARRA | Community Hub Vision, Values, and Story',
    description:
      'Learn about MARRA, our story, values, and long-term vision for a trusted community hub in Caulfield South built through care, belonging, and local partnerships.',
    keywords: [
      'about MARRA',
      'community hub vision',
      'Caulfield South community centre',
      'community values',
      'local partnerships Glen Eira',
    ],
    pageType: 'AboutPage',
  },
  '/programs': {
    title: 'Programs and Services | MARRA Community Hub',
    description:
      'Our Volunteer IT Program is now running — currently recruiting a volunteer Grant Writer and a volunteer Social Media Manager, with a new developer intake opening soon. Explore the programs MARRA is building across family support, education, wellbeing, and community connection.',
    keywords: [
      'volunteer IT program Melbourne',
      'volunteer grant writer Melbourne',
      'volunteer social media manager Melbourne',
      'IT volunteering local experience',
      'community programs Glen Eira',
      'family support programs',
      'youth development Caulfield South',
      'wellbeing programs community hub',
      'MARRA services',
    ],
    pageType: 'CollectionPage',
  },
  '/discover': {
    title: "What's On in Glen Eira | Workshops, Free Food & Volunteering",
    description:
      'Browse workshops, classes, free food and volunteering across Glen Eira — listings from the MARRA Hub platform alongside events gathered from local libraries, neighbourhood houses and community centres.',
    keywords: [
      'discover MARRA hub',
      "what's on Glen Eira",
      'community events Caulfield South',
      'community workshops Glen Eira',
      'free food Caulfield South',
      'volunteer opportunities Melbourne',
      'community directory Glen Eira',
    ],
    pageType: 'CollectionPage',
  },
  '/impact': {
    title: 'Community Impact | MARRA Community Hub',
    description:
      'See the impact areas MARRA Community Hub is focused on, including belonging, wellbeing, youth empowerment, local skills, and stronger community partnerships.',
    keywords: [
      'community impact Glen Eira',
      'community wellbeing Caulfield South',
      'youth empowerment community hub',
      'local partnerships Glen Eira',
      'MARRA impact',
    ],
    pageType: 'CollectionPage',
  },
  '/governance': {
    title: 'Governance and Transparency | MARRA Community Hub',
    description:
      'Read how MARRA Community Hub approaches governance, safeguarding, accountability, transparency, and ethical community leadership.',
    keywords: [
      'community governance',
      'nonprofit transparency',
      'community hub accountability',
      'safeguarding policies Glen Eira',
      'MARRA governance',
    ],
    pageType: 'AboutPage',
  },
  '/volunteer': {
    title: 'Volunteer Agreement | MARRA Community Hub',
    description:
      'Become a MARRA Community Hub volunteer in Caulfield South. Read and sign the volunteer agreement online to start offering your time, skills, and support.',
    keywords: [
      'volunteer Caulfield South',
      'volunteer Glen Eira',
      'community volunteering Melbourne',
      'volunteer agreement',
      'MARRA volunteer',
    ],
    pageType: 'WebPage',
  },
  '/contact': {
    title: 'Contact MARRA | Community Hub in Caulfield South',
    description:
      'Contact MARRA Community Hub in Caulfield South for enquiries, partnerships, accessibility support, and community collaboration opportunities.',
    keywords: [
      'contact MARRA',
      'community hub contact Caulfield South',
      'community centre phone Glen Eira',
      'Glen Eira community partnership',
      'MARRA email',
    ],
    pageType: 'ContactPage',
  },
};

export function getCanonicalPath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '') || '/';
}

export function getAbsoluteUrl(path: string) {
  if (!siteConfig.siteUrl) {
    return path;
  }

  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}

/**
 * Meta for an individual listing page, derived from the same Discover snapshot the
 * page renders from.
 *
 * This has to exist. getPageSeo answers anything it does not recognise with
 * noindex, and Seo.tsx writes that into the live document on every navigation —
 * so without this, every /whats-on/ page would be prerendered with a proper title
 * and then actively de-indexed the moment its JavaScript ran.
 */
function getEventSeo(canonicalPath: string): (PageSeoMeta & { noindex: boolean }) | null {
  if (!canonicalPath.startsWith('/whats-on/')) return null;

  const snapshot = getDiscoverSnapshot();
  const all = snapshot ? [...snapshot.workshops, ...snapshot.food] : [];
  const match = assignUniqueEventPaths(all as DiscoverWorkshop[]).find(
    (entry) => entry.path === canonicalPath,
  );

  if (!match) {
    // A URL under the prefix that no current listing claims — a finished event
    // whose page is still linked somewhere. Real page, nothing to index.
    return {
      title: `Listing not available | ${siteConfig.alternateName}`,
      description: 'This listing is no longer showing in the MARRA community directory.',
      keywords: [],
      pageType: 'WebPage',
      noindex: true,
    };
  }

  const event = match.item;
  const parts = event.location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const venue = parts[0] ?? '';
  const suburb = parts.length > 1 ? parts[parts.length - 1] : '';
  const when = new Date(event.startsAt).toLocaleDateString('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Suburb and date first after the name: those are what a local search actually
  // contains ("repair cafe bentleigh", "what's on caulfield south this weekend").
  const title = suburb ? `${event.title}, ${suburb} — ${when}` : `${event.title} — ${when}`;
  const where = venue && suburb ? `${venue}, ${suburb}` : event.location;

  return {
    title,
    description: `${when} at ${where}. Listed by ${event.organizationName}${
      event.costNote ? `. ${event.costNote}` : ''
    }. Found through the MARRA community directory for Glen Eira and nearby suburbs.`.slice(0, 300),
    keywords: [event.title, suburb, event.organizationName, "what's on"].filter(Boolean),
    pageType: 'WebPage',
    noindex: false,
  };
}

export function getPageSeo(
  pathname: string,
): PageSeoMeta & { canonicalPath: string; noindex: boolean } {
  const canonicalPath = getCanonicalPath(pathname);

  const eventMeta = getEventSeo(canonicalPath);
  if (eventMeta) {
    return { ...eventMeta, canonicalPath };
  }

  const meta = pageSeoMap[canonicalPath];

  if (meta) {
    return {
      ...meta,
      canonicalPath,
      noindex: false,
    };
  }

  return {
    title: `Page Not Found | ${siteConfig.name}`,
    description: 'The page you requested could not be found on the MARRA website.',
    keywords: ['MARRA', 'page not found'],
    pageType: 'WebPage' as const,
    canonicalPath,
    noindex: true,
  };
}
