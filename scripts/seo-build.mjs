import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const routes = ['/', '/about', '/programs', '/impact', '/governance', '/contact'];
const envFiles = ['.env.production.local', '.env.production', '.env.local', '.env'];

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

const siteUrl = (process.env.VITE_SITE_URL || envFromFiles.VITE_SITE_URL || '')
  .trim()
  .replace(/\/+$/, '');

if (!fs.existsSync(distDir)) {
  process.exit(0);
}

const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  for (const route of routes) {
    if (route === '/') {
      continue;
    }

    const routeSegment = route.replace(/^\/+|\/+$/g, '');
    const routeDirectory = path.join(distDir, routeSegment);
    const routeIndexPath = path.join(routeDirectory, 'index.html');

    fs.mkdirSync(routeDirectory, { recursive: true });
    fs.writeFileSync(routeIndexPath, indexHtml, 'utf8');
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
  ...routes.map((route) => {
    const url = new URL(route, `${siteUrl}/`).toString();
    return `  <url><loc>${url}</loc></url>`;
  }),
  '</urlset>',
];

fs.writeFileSync(sitemapPath, `${xmlLines.join('\n')}\n`, 'utf8');
fs.writeFileSync(
  robotsPath,
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8',
);
