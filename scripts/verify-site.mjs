/**
 * Smoke test for a built marrahub deployment.
 *
 * Every assertion here corresponds to something that was actually broken at some
 * point, so a failure means a real regression rather than a style opinion. Run it
 * against a local `wrangler dev`, a preview URL, or production:
 *
 *   node scripts/verify-site.mjs http://127.0.0.1:8787
 *   node scripts/verify-site.mjs https://marrahub.com.au
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */
const BASE = (process.argv[2] || 'http://127.0.0.1:8787').replace(/\/$/, '');

let pass = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    pass += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

async function head(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location'), headers: res.headers };
}

async function body(path) {
  const res = await fetch(BASE + path, { redirect: 'follow' });
  return { status: res.status, html: await res.text(), headers: res.headers };
}

/** Visible text only — script/style contents are what made the old pages look non-empty. */
function textOf(html) {
  const inBody = html.split('<body>')[1] ?? '';
  return inBody
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsonLd(html, id) {
  const match = html.match(new RegExp(`data-seo-id="${id}">([\\s\\S]*?)</script>`));
  if (!match) return null;
  try {
    return JSON.parse(match[1].replace(/\\u003c/g, '<').replace(/\\u003e/g, '>'));
  } catch {
    return null;
  }
}

const PAGES = ['/', '/about', '/programs', '/discover', '/impact', '/governance', '/contact', '/launch'];

// ---------------------------------------------------------------- status codes
section('Status codes and redirects');
for (const path of PAGES) {
  const { status } = await head(path);
  check(`${path} is 200 with no redirect hop`, status === 200, `got ${status}`);
}
{
  const slash = await head('/about/');
  check('/about/ redirects to the slash-less canonical', slash.status === 307 && slash.location === '/about', `${slash.status} -> ${slash.location}`);

  const missing = await head('/definitely-not-a-real-url-xyz');
  check('unknown URL returns a real 404, not the homepage at 200', missing.status === 404, `got ${missing.status}`);

  const volunteer = await head('/volunteer');
  check('/volunteer 302s to /contact server-side', volunteer.status === 302 && volunteer.location === '/contact', `${volunteer.status} -> ${volunteer.location}`);

  const icon = await head('/favicon.ico');
  check('/favicon.ico serves an icon, not HTML', icon.status === 200 && /icon|image/.test(icon.headers.get('content-type') || ''), icon.headers.get('content-type') || '');

  const asset = await head('/assets/does-not-exist-abc123.js');
  check('missing hashed asset 404s instead of returning HTML', asset.status === 404, `got ${asset.status}`);

  for (const api of ['/api/anything', '/api/']) {
    const res = await head(api);
    check(`${api} returns 404, not a Worker exception`, res.status === 404, `got ${res.status}`);
  }
  const proxy = await head('/api/hub/workshops');
  check('/api/hub/workshops still proxies (HEAD allowed)', proxy.status === 200, `got ${proxy.status}`);
}

// ------------------------------------------------------------ crawlable content
section('Crawlable content (the HTML a non-JS crawler receives)');
const seenH1 = new Map();
for (const path of PAGES) {
  const { html } = await body(path);
  const text = textOf(html);
  check(`${path} has real body text`, text.length > 1000, `${text.length} chars`);

  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  check(`${path} has an H1`, Boolean(h1), 'none found');
  if (h1) seenH1.set(path, h1);

  const svgs = html.match(/<svg[^>]*>/g) || [];
  const unnamed = svgs.filter((tag) => !/aria-hidden|aria-label|role="img"/.test(tag));
  check(`${path} exposes no unnamed decorative icons`, unnamed.length === 0, `${unnamed.length} of ${svgs.length}`);
}
check('every page has a distinct H1', new Set(seenH1.values()).size === seenH1.size,
  `${new Set(seenH1.values()).size} distinct across ${seenH1.size} pages`);

// -------------------------------------------------------------------- the events
section('Events');
{
  const { html } = await body('/discover');
  const text = textOf(html);
  check('/discover names real venues in its HTML', /Bentleigh|Caulfield|McKinnon|Malvern/.test(text), 'no suburb found');

  const graph = jsonLd(html, 'discover-events');
  const events = graph?.['@graph'] ?? [];
  check('/discover carries Event markup', events.length >= 10, `${events.length} events`);
  check('every Event has a non-empty location name', events.every((e) => String(e.location?.name || '').trim()),
    'at least one blank Place name');
  check('no Event claims a price', events.every((e) => !('offers' in e)), 'an offers block is present');
  check('Events carry geo coordinates', events.some((e) => e.location?.geo?.latitude), 'none found');

  const sitemap = await body('/sitemap.xml');
  const locs = (sitemap.html.match(/<loc>/g) || []).length;
  check('sitemap lists the listing pages too', locs > 8, `${locs} URLs`);

  const eventUrl = (sitemap.html.match(/<loc>([^<]*whats-on[^<]*)<\/loc>/) || [])[1];
  check('sitemap contains at least one listing URL', Boolean(eventUrl), 'none found');

  if (eventUrl) {
    const path = new URL(eventUrl).pathname;
    const page = await body(path);
    check(`${path} is 200`, page.status === 200, `got ${page.status}`);
    check('listing page is indexable (not noindex)', /name="robots" content="index/.test(page.html),
      (page.html.match(/name="robots" content="([^"]*)"/) || [])[1] || 'no robots meta');
    check('listing page self-canonicals', page.html.includes(`rel="canonical" href="${eventUrl}"`), 'canonical mismatch');
    const single = jsonLd(page.html, 'event');
    check('listing page carries single-Event markup', single?.['@type'] === 'Event', 'missing');
    // Not a per-page assertion: a listing can genuinely be the only one at its
    // venue and the only one by its organisation, in which case it correctly has
    // no siblings to link to. What matters is that the set is cross-linked at all,
    // checked below across every listing in the sitemap.
    check('listing page links back to the directory', page.html.includes('href="/discover"'),
      'no link back to /discover');
    check('listing page has real body text', textOf(page.html).length > 800, `${textOf(page.html).length} chars`);
  }

  const fake = await head('/whats-on/not-an-org/not-an-event-2020-01-01');
  check('unknown listing URL 404s', fake.status === 404, `got ${fake.status}`);

  // The 404 document is served for every unmatched URL, so its markup describes
  // the 404 page while the router may match a real route for the URL requested.
  // It is marked so the client renders rather than hydrates — without that, every
  // stale listing link throws a React hydration error.
  const notFoundDoc = await body('/whats-on/not-an-org/not-an-event-2020-01-01');
  check('404 document opts out of hydration', notFoundDoc.html.includes('data-prerendered-not-found="true"'),
    'marker absent — stale links will throw a hydration error');

  const allLocs = [...(await body('/sitemap.xml')).html.matchAll(/<loc>([^<]*whats-on[^<]*)<\/loc>/g)].map((m) => m[1]);
  let withCrossLinks = 0;
  for (const url of allLocs.slice(0, 6)) {
    const page = await body(new URL(url).pathname);
    if ((page.html.match(/href="\/whats-on\//g) || []).length >= 1) withCrossLinks += 1;
  }
  check('listings cross-link each other', withCrossLinks > 0,
    `none of the first ${Math.min(6, allLocs.length)} listings link to a sibling`);
}

// ---------------------------------------------------------------- entity + meta
section('Entity data and meta');
{
  const { html } = await body('/');
  const phones = [...html.matchAll(/"telephone":"([^"]*)"/g)].map((m) => m[1]);
  check('one phone number, and it is the current one', phones.length > 0 && phones.every((p) => p === '+61433212855'),
    phones.join(', ') || 'none');
  check('Organization carries sameAs', /"sameAs":\["https:\/\/abr\.business\.gov\.au/.test(html), 'missing');
  check('Organization name is the one the site uses', /"name":"MARRA Community Hub"/.test(html), 'not found');

  const launch = await body('/launch');
  const launchEvent = jsonLd(launch.html, 'event');
  const ended = Date.now() > Date.parse('2026-08-15T18:00:00+10:00');
  check('finished launch event is not marked up as upcoming', ended ? launchEvent === null : true,
    'Event markup still present after the event ended');

  const notFound = await body('/definitely-not-a-real-url-xyz');
  check('404 page is noindex', /name="robots" content="noindex/.test(notFound.html), 'not noindexed');
  check('404 page has no canonical', !/rel="canonical"/.test(notFound.html), 'canonical present');
}

// ------------------------------------------------------------ analytics + assets
section('Analytics, fonts and image weight');
{
  const { html, headers } = await body('/');
  check('analytics beacon is in the HTML', html.includes('static.cloudflareinsights.com'), 'absent');

  const csp = headers.get('content-security-policy') || '';
  check('CSP allows the beacon script origin', csp.includes('static.cloudflareinsights.com'), 'script-src missing it');
  check('CSP allows the beacon report origin', csp.includes('cloudflareinsights.com'), 'connect-src missing it');

  const font = await head('/fonts/ibarra-real-nova-v30-latin.woff2');
  check('serif webfont is served', font.status === 200 && /font/.test(font.headers.get('content-type') || ''),
    `${font.status} ${font.headers.get('content-type')}`);
  check('serif webfont is preloaded', html.includes('rel="preload" as="font"'), 'no font preload');
  check('hero image is preloaded', /rel="preload" as="image"/.test(html), 'no image preload');

  for (const [asset, limitKb] of [['/media/bkg-pg.webp', 200], ['/media/hero-background.webp', 150], ['/media/marra-wordmark.webp', 20]]) {
    const res = await fetch(BASE + asset);
    const kb = Math.round((await res.arrayBuffer()).byteLength / 1024);
    check(`${asset} is ${kb} KB (under ${limitKb})`, res.status === 200 && kb < limitKb, `${res.status}, ${kb} KB`);
  }
  for (const gone of ['/media/bkg-pg.png', '/media/hero-background.png']) {
    const res = await head(gone);
    check(`${gone} no longer served`, res.status === 404, `got ${res.status}`);
  }
}

console.log(`\n${'='.repeat(60)}\n${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
console.log('All checks passed.');
