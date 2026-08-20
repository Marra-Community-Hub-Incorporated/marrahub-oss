import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// The Cloudflare Vite plugin builds the client SPA into dist/client (and the
// Worker into its own dist/<name> alongside it) now that the site has a
// worker/index.ts entry point for the Discover API proxy.
const distDir = path.resolve('dist/client');
const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/launch', changefreq: 'monthly', priority: '0.5' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/programs', changefreq: 'weekly', priority: '0.9' },
  { path: '/discover', changefreq: 'daily', priority: '0.8' },
  { path: '/impact', changefreq: 'monthly', priority: '0.8' },
  { path: '/governance', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.9' },
  { path: '/volunteer', changefreq: 'monthly', priority: '0.8' },
];
const envFiles = ['.env.production.local', '.env.production', '.env.local', '.env'];
const seoHeadStart = '<!-- SEO_HEAD_START -->';
const seoHeadEnd = '<!-- SEO_HEAD_END -->';

// The SEO source of truth now comes from the app itself. src/app/seo/site.ts
// used to be duplicated here by hand because a Node script can't import a TS
// module — and the two copies had already drifted: this file still carried a
// phone number that site.ts no longer listed, so every prerendered page shipped
// JSON-LD advertising it to Google. dist/ssr/entry-server.js (built by
// vite.ssr.config.ts) re-exports the real values, so there is one copy again.
const ssrEntryPath = path.resolve('dist/ssr/entry-server.js');

if (!fs.existsSync(ssrEntryPath)) {
  console.error(
    'SEO build: dist/ssr/entry-server.js is missing. Run "vite build --config vite.ssr.config.ts" first.',
  );
  process.exit(1);
}

const {
  siteConfig,
  pageSeoMap,
  getPageSeo,
  render,
  DISCOVER_DATA_ELEMENT_ID,
} = await import(pathToFileURL(ssrEntryPath).href);

// The Hub's public Discover directory, captured at build time so /discover ships
// with its listings in the HTML. Every event used to arrive from a client-side
// fetch, which meant the 30-odd real listings — the thing people actually search
// for — appeared nowhere in the indexable page.
//
// A build must never fail because the Hub is briefly unreachable: on any error
// this returns null and /discover prerenders exactly as it did before, with the
// client fetching after boot.
const HUB_DISCOVER_BASE = 'https://hub.marrahub.com.au/api/discover';
const DISCOVER_FETCH_TIMEOUT_MS = 15000;

async function fetchDiscoverSection(section) {
  const response = await fetch(`${HUB_DISCOVER_BASE}/${section}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(DISCOVER_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${section} responded ${response.status}`);
  }

  const json = await response.json();

  if (!Array.isArray(json)) {
    throw new Error(`${section} did not return an array`);
  }

  return json;
}

async function fetchDiscoverSnapshot() {
  try {
    const [workshops, food, orgs] = await Promise.all([
      fetchDiscoverSection('workshops'),
      fetchDiscoverSection('food'),
      fetchDiscoverSection('orgs'),
    ]);

    return {
      workshops,
      food,
      // The Hub's orgs feed includes its internal "Public Intake" tenant, which
      // is not an organisation anyone can volunteer with. The page filters it
      // when rendering, but it would still ride to the browser inside the
      // snapshot and sit in the served HTML, so drop it here too.
      orgs: orgs.filter((org) => org?.slug !== 'public'),
      capturedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(
      `SEO build: could not capture the Discover directory (${error.message}). ` +
        '/discover will prerender without listings and fetch them in the browser.',
    );
    return null;
  }
}

const discoverSnapshot = await fetchDiscoverSnapshot();

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

/**
 * schema.org/Event markup for the captured listings — this is what makes an
 * event eligible for Google's event rich results, and it is the only route by
 * which a small site's individual events surface for "what's on near me" style
 * searches independently of the domain's authority.
 *
 * Deliberate omissions:
 *  - No `offers`. Cost arrives as free text the organisation wrote (costNote),
 *    and inferring "free" from a blank or chatty value would publish a price
 *    MARRA never verified. A wrong price in a rich result is worse than none.
 *  - Past events are dropped. Markup for an event that already happened is
 *    stale data Google is entitled to distrust.
 *  - `url` points at whoever actually runs the event, which for a gathered
 *    listing is the source organisation's own page — this site is aggregating
 *    these, not claiming them.
 */
function splitLocation(location) {
  const parts = String(location || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return { venue: '', street: '', suburb: '' };
  if (parts.length === 1) return { venue: parts[0], street: '', suburb: '' };

  return {
    venue: parts[0],
    street: parts.slice(1, -1).join(', '),
    suburb: parts[parts.length - 1],
  };
}

function eventJsonLdFor(item) {
  const startsAt = new Date(item.startsAt);
  if (Number.isNaN(startsAt.getTime())) return null;

  const { venue, street, suburb } = splitLocation(item.location);

  // Google requires a location on an Event, and at least one listing in the feed
  // arrives with location, postcode and coordinates all empty. Emitting a Place
  // with a blank name and an address of nothing but "VIC, AU" would be invalid
  // markup asserting a state the listing never claimed, so skip the event.
  if (!venue && !street && !suburb && !item.postcode) return null;

  const address = { '@type': 'PostalAddress', addressRegion: 'VIC', addressCountry: 'AU' };
  if (street) address.streetAddress = street;
  if (suburb) address.addressLocality = suburb;
  if (item.postcode) address.postalCode = item.postcode;

  const place = { '@type': 'Place', name: venue || item.location, address };

  if (typeof item.latitude === 'number' && typeof item.longitude === 'number') {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude: item.latitude,
      longitude: item.longitude,
    };
  }

  const event = {
    '@type': 'Event',
    name: item.title,
    startDate: startsAt.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: place,
  };

  if (item.durationMinutes > 0) {
    event.endDate = new Date(startsAt.getTime() + item.durationMinutes * 60000).toISOString();
  }

  if (item.description) event.description = item.description;
  if (item.coverImageThumbUrl) event.image = item.coverImageThumbUrl;

  if (item.organizationName) {
    event.organizer = { '@type': 'Organization', name: item.organizationName };
  }

  const url = item.isExternalListing
    ? item.registrationUrl || item.sourceUrl
    : `${HUB_SITE_URL_FOR_LISTINGS}/o/${item.organizationSlug}`;
  if (url) event.url = url;

  return event;
}

const HUB_SITE_URL_FOR_LISTINGS = 'https://hub.marrahub.com.au';

function upcomingEventJsonLd() {
  if (!discoverSnapshot) return [];

  const now = Date.now();
  const items = [...discoverSnapshot.workshops, ...discoverSnapshot.food];

  return items
    .filter((item) => {
      const at = new Date(item.startsAt).getTime();
      return Number.isFinite(at) && at >= now;
    })
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
    .map(eventJsonLdFor)
    .filter(Boolean);
}

/**
 * The image behind each page's hero, so the head can preload it.
 *
 * Both heroes are CSS/inline background images, which the browser's preload
 * scanner does not discover — it only sees them once the stylesheet or the
 * component's inline style has been parsed. That put the LCP element at the end
 * of a dependency chain instead of the start of the download queue. A preload
 * with fetchpriority="high" moves it to the front.
 *
 * /launch has no hero image, so it gets no preload.
 */
const heroImageByRoute = {
  '/': '/media/hero-background.webp',
  '/about': '/media/bkg-pg.webp',
  '/programs': '/media/bkg-pg.webp',
  '/discover': '/media/bkg-pg.webp',
  '/impact': '/media/bkg-pg.webp',
  '/governance': '/media/bkg-pg.webp',
  '/contact': '/media/bkg-pg.webp',
  '/volunteer': '/media/bkg-pg.webp',
};

function buildSeoHead(routePath, { is404 = false } = {}) {
  const canonicalPath = getCanonicalPath(routePath);
  // getPageSeo is the same lookup the running app uses, and it already answers
  // unknown paths with noindex "Page Not Found" meta — which is exactly what the
  // prerendered 404 document needs.
  const meta = getPageSeo(canonicalPath);
  const canonicalUrl = getAbsoluteUrl(canonicalPath);
  const imageUrl = getAbsoluteUrl(meta.image?.path ?? siteConfig.defaultImagePath);
  const imageWidth = meta.image?.width ?? 1200;
  const imageHeight = meta.image?.height ?? 630;
  const imageAlt =
    meta.image?.alt ?? 'MARRA Community Hub – Interactive community centre in Caulfield South';
  const logoUrl = getAbsoluteUrl(siteConfig.logoPath);
  const robotsContent =
    is404 || meta.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
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
    ...(is404 ? [] : [`    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`]),
    `    <meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `    <meta property="og:image:width" content="${imageWidth}" />`,
    `    <meta property="og:image:height" content="${imageHeight}" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  ];

  const heroImage = is404 ? undefined : heroImageByRoute[canonicalPath];

  if (heroImage) {
    lines.push(
      `    <link rel="preload" as="image" type="image/webp" fetchpriority="high" href="${escapeHtml(heroImage)}" />`,
    );
  }

  if (!is404) {
    lines.push(
      `    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
      `    <link rel="alternate" hreflang="en-au" href="${escapeHtml(canonicalUrl)}" />`,
    );
  }

  if (siteUrl && !is404) {
    const organizationId = `${siteUrl}/#organization`;
    const websiteId = `${siteUrl}/#website`;

    lines.push(
      jsonLdScript('organization', {
        '@context': 'https://schema.org',
        '@type': 'NGO',
        '@id': organizationId,
        name: siteConfig.name,
        // External verifications match the registered entity, not the brand.
        legalName: siteConfig.legalName,
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

    // Event structured data for our first meet-up (now a past event). Mirrored in
    // src/app/components/Seo.tsx — keep both in sync.
    if (canonicalPath === '/launch') {
      lines.push(
        jsonLdScript('event', {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'MARRA Community Hub — First Community Meet-Up',
          description: meta.description,
          startDate: '2026-08-15T14:00:00+10:00',
          endDate: '2026-08-15T18:00:00+10:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          isAccessibleForFree: true,
          image: imageUrl,
          url: canonicalUrl,
          performer: {
            '@type': 'Organization',
            '@id': organizationId,
            name: siteConfig.name,
          },
          location: {
            '@type': 'Place',
            name: 'Carnegie Library & Community Centre',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Level 2, 7 Shepparson Avenue',
              addressLocality: 'Carnegie',
              addressRegion: 'VIC',
              postalCode: '3163',
              addressCountry: 'AU',
            },
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            price: '0',
            priceCurrency: 'AUD',
            availability: 'https://schema.org/InStock',
            validFrom: '2026-08-09T00:00:00+10:00',
          },
          organizer: {
            '@id': organizationId,
          },
          funder: {
            '@type': 'GovernmentOrganization',
            name: 'Glen Eira City Council',
            url: 'https://www.gleneira.vic.gov.au/',
          },
        }),
      );
    }

    if (canonicalPath === '/discover') {
      const events = upcomingEventJsonLd();

      if (events.length > 0) {
        lines.push(
          jsonLdScript('discover-events', {
            '@context': 'https://schema.org',
            '@graph': events,
          }),
        );
      }
    }

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

const rootDiv = '<div id="root"></div>';

/**
 * Drop the rendered app into the shell. Until this existed the shell shipped an
 * empty #root, so every crawler that doesn't execute JavaScript — and every
 * social/AI scraper that never will — saw a page with zero words on it.
 */
function injectAppHtml(html, appHtml) {
  const index = html.indexOf(rootDiv);

  if (index === -1) {
    throw new Error('SEO build: could not find <div id="root"></div> to prerender into');
  }

  return html.replace(rootDiv, `<div id="root">${appHtml}</div>`);
}

// Routes whose markup was rendered from the Discover snapshot. They have to
// carry the same listings to the browser, or React's first client render would
// build a spinner where the HTML has events and discard the prerendered DOM.
const snapshotRoutes = new Set(['/', '/discover']);

/**
 * A `type="application/json"` data block, not an inline script assignment:
 * script-src in public/_headers allows only 'self' plus one hashed inline
 * script, and a JSON block is inert so the policy never applies to it.
 */
function injectDiscoverSnapshot(html, routePath) {
  if (!discoverSnapshot || !snapshotRoutes.has(routePath)) return html;

  const serialized = JSON.stringify(discoverSnapshot)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return html.replace(
    '</body>',
    `  <script type="application/json" id="${DISCOVER_DATA_ELEMENT_ID}">${serialized}</script>\n  </body>`,
  );
}

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`SEO build: ${indexHtmlPath} is missing. Run "vite build" first.`);
  process.exit(1);
}

const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, 'utf8');
const redirectRules = [];
let prerenderedCount = 0;

for (const route of routes) {
  const result = await render(route.path, { discover: discoverSnapshot });

  // A route whose loader redirects (/volunteer while its feature flag is off)
  // gets a real server redirect in _redirects instead of a prerendered page.
  // It used to rely on the SPA fallback serving the shell so the client router
  // could redirect after boot — which meant Google saw 200 + an empty body at a
  // URL that is not a page.
  if (result.redirect) {
    redirectRules.push(`${route.path} ${result.redirect.location} 302`);
    continue;
  }

  if (!result.html) {
    throw new Error(`SEO build: ${route.path} rendered no markup and no redirect`);
  }

  if (!activeRoutes.some((active) => active.path === route.path)) {
    continue;
  }

  const routeHtml = injectDiscoverSnapshot(
    injectAppHtml(
      upsertSeoHeadBlock(indexHtmlTemplate, buildSeoHead(route.path)),
      result.html,
    ),
    route.path,
  );
  prerenderedCount += 1;

  if (route.path === '/') {
    fs.writeFileSync(indexHtmlPath, routeHtml, 'utf8');
    continue;
  }

  const routeSegment = route.path.replace(/^\/+|\/+$/g, '');
  const routeDirectory = path.join(distDir, routeSegment);

  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(path.join(routeDirectory, 'index.html'), routeHtml, 'utf8');
}

// The 404 page is a real prerendered document now, served by Cloudflare with a
// 404 status (assets.not_found_handling = "404-page" in wrangler.jsonc). The old
// public/404.html was a GitHub-Pages-era "?/" redirect shim that the Worker made
// unreachable, so unknown URLs answered 200 with the homepage shell and Google
// filed the whole site as soft 404s.
const notFoundProbePath = '/__prerender_probe_for_the_404_page__';
const notFoundRender = await render(notFoundProbePath, { discover: discoverSnapshot });

if (notFoundRender.status !== 404 || !notFoundRender.html) {
  throw new Error(
    `SEO build: expected the 404 probe to render a 404 page, got status ${notFoundRender.status}`,
  );
}

const notFoundHtml = injectAppHtml(
  upsertSeoHeadBlock(indexHtmlTemplate, buildSeoHead(notFoundProbePath, { is404: true })),
  notFoundRender.html,
);

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

if (redirectRules.length > 0) {
  const redirectsPath = path.join(distDir, '_redirects');
  const existing = fs.existsSync(redirectsPath) ? `${fs.readFileSync(redirectsPath, 'utf8').trimEnd()}\n` : '';
  fs.writeFileSync(redirectsPath, `${existing}${redirectRules.join('\n')}\n`, 'utf8');
}

console.log(
  `SEO build: prerendered ${prerenderedCount} pages + 404.html, ${redirectRules.length} redirect rule(s).`,
);

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
