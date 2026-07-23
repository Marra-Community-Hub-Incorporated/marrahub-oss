import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/programs', changefreq: 'weekly', priority: '0.9' },
  { path: '/impact', changefreq: 'monthly', priority: '0.8' },
  { path: '/governance', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.9' },
  { path: '/volunteer', changefreq: 'monthly', priority: '0.8' },
];
const envFiles = ['.env.production.local', '.env.production', '.env.local', '.env'];
const seoHeadStart = '<!-- SEO_HEAD_START -->';
const seoHeadEnd = '<!-- SEO_HEAD_END -->';

const siteConfig = {
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
  phones: ['+61421803285', '+61433212855'],
  locality: 'Caulfield South',
  region: 'VIC',
  country: 'AU',
  abn: '79178583024',
  logoPath: '/media/favicon/favicon.png',
  defaultImagePath: '/media/Seo_Prev.png',
};

// Duplicated from src/app/seo/site.ts (this Node script can't import the TS
// module) — any edit to the SEO map there must be mirrored here, or the
// prerendered HTML keeps serving the old meta tags.
const pageSeoMap = {
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
      'Our Volunteer IT Program is now running — hands-on experience for IT students and graduates. Explore this and the programs MARRA is building across family support, education, wellbeing, and community connection.',
    keywords: [
      'volunteer IT program Melbourne',
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
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .reduce((accumulator, line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return accumulator;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, '');

      accumulator[key] = value;
      return accumulator;
    }, {});
}

const envFromFiles = envFiles.reduce((accumulator, fileName) => {
  return { ...accumulator, ...parseEnvFile(path.resolve(fileName)) };
}, {});

// The volunteer flow is hidden in production unless explicitly enabled. Mirror
// the app's featureFlags logic here so the sitemap and prerendered pages stay in
// sync — when it's off, /volunteer is left out of both.
const resolvedEnv = { ...envFromFiles, ...process.env };
const volunteerEnabled = resolvedEnv.VITE_VOLUNTEER_ENABLED === 'true';
const activeRoutes = volunteerEnabled
  ? routes
  : routes.filter((route) => route.path !== '/volunteer');

const siteUrl = siteConfig.siteUrl;
const buildDate = new Date().toISOString().split('T')[0];

if (!fs.existsSync(distDir)) {
  process.exit(0);
}

const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const indexHtmlPath = path.join(distDir, 'index.html');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getCanonicalPath(routePath) {
  if (!routePath || routePath === '/') {
    return '/';
  }

  return routePath.replace(/\/+$/, '') || '/';
}

function getAbsoluteUrl(urlPath) {
  if (!siteUrl) {
    return urlPath;
  }

  return new URL(urlPath, `${siteUrl}/`).toString();
}

function upsertSeoHeadBlock(html, seoHead) {
  const startIndex = html.indexOf(seoHeadStart);
  const endIndex = html.indexOf(seoHeadEnd);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('SEO build: Could not find SEO_HEAD_START/SEO_HEAD_END markers in index.html');
  }

  const afterEndIndex = endIndex + seoHeadEnd.length;
  return `${html.slice(0, startIndex)}${seoHead}${html.slice(afterEndIndex)}`;
}

function jsonLdScript(id, data) {
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c');
  return `    <script type="application/ld+json" data-seo-id="${id}">${serialized}</script>`;
}

function buildSeoHead(routePath) {
  const canonicalPath = getCanonicalPath(routePath);
  const meta = pageSeoMap[canonicalPath] || pageSeoMap['/'];
  const canonicalUrl = getAbsoluteUrl(canonicalPath);
  const imageUrl = getAbsoluteUrl(siteConfig.defaultImagePath);
  const logoUrl = getAbsoluteUrl(siteConfig.logoPath);
  const robotsContent =
    'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const lines = [
    '    <!-- SEO_HEAD_START -->',
    `    <title>${escapeHtml(meta.title)}</title>`,
    `    <meta name="description" content="${escapeHtml(meta.description)}" />`,
    `    <meta name="keywords" content="${escapeHtml(meta.keywords.join(', '))}" />`,
    `    <meta name="robots" content="${escapeHtml(robotsContent)}" />`,
    `    <meta name="googlebot" content="${escapeHtml(robotsContent)}" />`,
    `    <meta name="author" content="${escapeHtml(siteConfig.name)}" />`,
    `    <meta name="application-name" content="${escapeHtml(siteConfig.alternateName)}" />`,
    `    <meta name="apple-mobile-web-app-title" content="${escapeHtml(siteConfig.shortName)}" />`,
    `    <meta name="theme-color" content="${escapeHtml(siteConfig.themeColor)}" />`,
    `    <meta name="geo.region" content="${escapeHtml(`${siteConfig.country}-${siteConfig.region}`)}" />`,
    `    <meta name="geo.placename" content="${escapeHtml(siteConfig.locality)}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:site_name" content="${escapeHtml(siteConfig.alternateName)}" />`,
    `    <meta property="og:locale" content="${escapeHtml(siteConfig.locale)}" />`,
    `    <meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `    <meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    '    <meta property="og:image:width" content="1200" />',
    '    <meta property="og:image:height" content="630" />',
    '    <meta property="og:image:alt" content="MARRA Community Hub – Interactive community centre in Caulfield South" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `    <link rel="alternate" hreflang="en-au" href="${escapeHtml(canonicalUrl)}" />`,
  ];

  if (siteUrl) {
    const organizationId = `${siteUrl}/#organization`;
    const websiteId = `${siteUrl}/#website`;

    lines.push(
      jsonLdScript('organization', {
        '@context': 'https://schema.org',
        '@type': 'NGO',
        '@id': organizationId,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        description: siteConfig.description,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
          contentUrl: logoUrl,
        },
        image: imageUrl,
        email: siteConfig.email,
        telephone: siteConfig.phones[0],
        taxID: siteConfig.abn,
        areaServed: ['Caulfield South', 'Glen Eira', 'Australia'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.locality,
          addressRegion: siteConfig.region,
          addressCountry: siteConfig.country,
        },
        contactPoint: siteConfig.phones.map((phone) => ({
          '@type': 'ContactPoint',
          telephone: phone,
          contactType: 'community enquiries',
          email: siteConfig.email,
          areaServed: 'AU',
          availableLanguage: ['en', 'en-AU'],
        })),
      }),
      jsonLdScript('website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: {
          '@id': organizationId,
        },
      }),
      jsonLdScript('webpage', {
        '@context': 'https://schema.org',
        '@type': meta.pageType,
        name: meta.title,
        description: meta.description,
        url: canonicalUrl,
        inLanguage: siteConfig.language,
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': organizationId,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
      }),
    );

    if (canonicalPath !== '/') {
      lines.push(
        jsonLdScript('breadcrumbs', {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: meta.title.split(' | ')[0],
              item: canonicalUrl,
            },
          ],
        }),
      );
    }
  }

  lines.push('    <!-- SEO_HEAD_END -->');
  return lines.join('\n');
}

if (fs.existsSync(indexHtmlPath)) {
  const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, 'utf8');

  for (const route of activeRoutes) {
    const routeHtml = upsertSeoHeadBlock(indexHtmlTemplate, buildSeoHead(route.path));

    if (route.path === '/') {
      fs.writeFileSync(indexHtmlPath, routeHtml, 'utf8');
      continue;
    }

    const routeSegment = route.path.replace(/^\/+|\/+$/g, '');
    const routeDirectory = path.join(distDir, routeSegment);
    const routeIndexPath = path.join(routeDirectory, 'index.html');

    fs.mkdirSync(routeDirectory, { recursive: true });
    fs.writeFileSync(routeIndexPath, routeHtml, 'utf8');
  }
}

if (!siteUrl) {
  if (fs.existsSync(sitemapPath)) {
    fs.unlinkSync(sitemapPath);
  }

  fs.writeFileSync(robotsPath, 'User-agent: *\nAllow: /\n', 'utf8');
  console.warn('SEO build: VITE_SITE_URL is not set. Skipping sitemap.xml generation.');
  process.exit(0);
}

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...activeRoutes.flatMap((route) => {
    const url = new URL(route.path, `${siteUrl}/`).toString();
    return [
      '  <url>',
      `    <loc>${url}</loc>`,
      `    <lastmod>${buildDate}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ];
  }),
  '</urlset>',
];

fs.writeFileSync(sitemapPath, `${xmlLines.join('\n')}\n`, 'utf8');
fs.writeFileSync(
  robotsPath,
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8',
);
