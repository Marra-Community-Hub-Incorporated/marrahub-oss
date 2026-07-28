export type SeoPageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords: string[];
  pageType: SeoPageType;
}

export const siteConfig = {
  name: 'MARRA Community Centre',
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
  logoPath: '/media/favicon/favicon.png',
  faviconPath: '/media/favicon/favicon.png',
  defaultImagePath: '/media/Seo_Prev.png',
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
      'Our Volunteer IT Program is now running — currently recruiting a volunteer Social Media Manager, with a new developer intake opening soon. Explore the programs MARRA is building across family support, education, wellbeing, and community connection.',
    keywords: [
      'volunteer IT program Melbourne',
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

export function getPageSeo(pathname: string) {
  const canonicalPath = getCanonicalPath(pathname);
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
