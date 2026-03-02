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
  language: 'en-AU',
  locale: 'en_AU',
  themeColor: '#1e453a',
  description:
    'MARRA is a family-founded community hub growing in Caulfield South through connection, care, local partnerships, and interactive community programs.',
  email: 'hello@marrahub.com.au',
  phones: ['+61421803285', '+61433212855'],
  locality: 'Caulfield South',
  region: 'VIC',
  country: 'AU',
  abn: '79178583024',
  logoPath: '/media/favicon/web-app-manifest-512x512.png',
  faviconPath: '/media/favicon/favicon.svg',
  defaultImagePath: '/media/hero-background.png',
  siteUrl:
    import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : ''),
} as const;

export const pageSeoMap: Record<string, PageSeoMeta> = {
  '/': {
    title: 'MARRA Community Hub | Interactive Community Centre in Caulfield South',
    description:
      'Discover MARRA Community Hub, a family-founded community centre growing in Caulfield South with future programs, partnerships, and interactive local support.',
    keywords: [
      'MARRA Community Hub',
      'MARRA Community Centre',
      'community hub Caulfield South',
      'community centre Melbourne',
      'interactive community programs',
      'community support Victoria',
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
      'local partnerships Melbourne',
    ],
    pageType: 'AboutPage',
  },
  '/programs': {
    title: 'Programs and Services | MARRA Community Hub',
    description:
      'Explore the programs MARRA Community Hub is building across family support, education, wellbeing, youth development, inclusion, and community connection.',
    keywords: [
      'community programs Melbourne',
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
      'community impact Melbourne',
      'community wellbeing Caulfield South',
      'youth empowerment community hub',
      'local partnerships Victoria',
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
      'safeguarding policies Melbourne',
      'MARRA governance',
    ],
    pageType: 'AboutPage',
  },
  '/contact': {
    title: 'Contact MARRA | Community Hub in Caulfield South',
    description:
      'Contact MARRA Community Hub in Caulfield South for enquiries, partnerships, accessibility support, and community collaboration opportunities.',
    keywords: [
      'contact MARRA',
      'community hub contact Caulfield South',
      'community centre phone Melbourne',
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
