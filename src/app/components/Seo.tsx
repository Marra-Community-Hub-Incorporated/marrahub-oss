import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getAbsoluteUrl, getPageSeo, siteConfig } from '../seo/site';

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);

  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-seo-id', id);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.head.querySelector(`script[data-seo-id="${id}"]`)?.remove();
}

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = getPageSeo(location.pathname);
    const siteUrl = siteConfig.siteUrl;
    const canonicalUrl = getAbsoluteUrl(meta.canonicalPath);
    const imageUrl = getAbsoluteUrl(siteConfig.defaultImagePath);
    const logoUrl = getAbsoluteUrl(siteConfig.logoPath);
    const robotsContent = meta.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

    document.documentElement.lang = siteConfig.language;
    document.title = meta.title;

    upsertMeta('meta[name="description"]', { name: 'description' }, meta.description);
    upsertMeta('meta[name="keywords"]', { name: 'keywords' }, meta.keywords.join(', '));
    upsertMeta('meta[name="author"]', { name: 'author' }, siteConfig.name);
    upsertMeta('meta[name="application-name"]', { name: 'application-name' }, siteConfig.alternateName);
    upsertMeta('meta[name="apple-mobile-web-app-title"]', { name: 'apple-mobile-web-app-title' }, siteConfig.shortName);
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color' }, siteConfig.themeColor);
    upsertMeta('meta[name="robots"]', { name: 'robots' }, robotsContent);
    upsertMeta('meta[name="googlebot"]', { name: 'googlebot' }, robotsContent);
    upsertMeta('meta[name="geo.region"]', { name: 'geo.region' }, `${siteConfig.country}-${siteConfig.region}`);
    upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename' }, siteConfig.locality);

    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, siteConfig.alternateName);
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, siteConfig.locale);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, meta.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, meta.description);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl);
    upsertMeta(
      'meta[property="og:image:alt"]',
      { property: 'og:image:alt' },
      'MARRA Community Hub hero image and brand identity',
    );

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, meta.title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, meta.description);
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl);

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="en-au"]', {
      rel: 'alternate',
      hreflang: 'en-au',
      href: canonicalUrl,
    });

    if (!siteUrl) {
      return;
    }

    const organizationId = `${siteUrl}/#organization`;
    const websiteId = `${siteUrl}/#website`;

    upsertJsonLd('organization', {
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
      image: logoUrl,
      email: siteConfig.email,
      telephone: siteConfig.phones[0],
      taxID: siteConfig.abn,
      areaServed: ['Caulfield South', 'Glen Eira', 'Melbourne', 'Victoria', 'Australia'],
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
    });

    upsertJsonLd('website', {
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
    });

    upsertJsonLd('webpage', {
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
    });

    if (meta.canonicalPath === '/') {
      removeJsonLd('breadcrumbs');
      return;
    }

    upsertJsonLd('breadcrumbs', {
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
          name: meta.title.replace(` | ${siteConfig.name}`, ''),
          item: canonicalUrl,
        },
      ],
    });
  }, [location.pathname]);

  return null;
}
