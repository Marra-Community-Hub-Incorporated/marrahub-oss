import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export function Layout() {
  const location = useLocation();
  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = import.meta.env.BASE_URL;
  const siteUrl = siteOrigin ? new URL(baseUrl, siteOrigin).toString() : baseUrl;
  const logoUrl = siteOrigin
    ? new URL(`${baseUrl}media/favicon/web-app-manifest-512x512.png`, siteOrigin).toString()
    : `${baseUrl}media/favicon/web-app-manifest-512x512.png`;
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MARRA Community Centre',
    alternateName: 'MARRA',
    url: siteUrl,
    logo: logoUrl,
    email: 'hello@marrahub.com.au',
    telephone: '0421803285',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Caulfield South',
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '0421803285',
        contactType: 'customer support',
        email: 'hello@marrahub.com.au',
        areaServed: 'AU',
      },
      {
        '@type': 'ContactPoint',
        telephone: '0433212855',
        contactType: 'customer support',
        email: 'hello@marrahub.com.au',
        areaServed: 'AU',
      },
    ],
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
