import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Seo } from './components/Seo';

export function Layout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isInitialLoad = useRef(true);

  // Scroll to top on route change
  useEffect(() => {
    // ...unless the URL names a section. The footer's "Safeguarding" and
    // "Accountability" links point at /governance#safeguarding and
    // #accountability, and both target ids do exist — but this effect ran after
    // the browser had already jumped to them and scrolled straight back to the
    // top, so every one of those links looked broken.
    const hash = location.hash ? location.hash.slice(1) : '';
    const target = hash ? document.getElementById(hash) : null;

    if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }

    // Keep the initial page load unchanged so the skip link remains
    // the first keyboard-accessible control.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Move focus into the newly rendered main content after SPA navigation.
    const frame = requestAnimationFrame(() => {
      // A newly mounted page can open a modal and focus into it in its own effect, which
      // runs a frame before this one — Home's launch-event popup does exactly that. Moving
      // focus now would pull the user out of a dialog that still has its focus trap armed,
      // so Tab would cycle inside a panel focus had already left. Leave it alone.
      if (document.querySelector('[aria-modal="true"]')) return;
      mainRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col min-h-screen">
      <Seo />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-md"
      >
        Skip to main content
      </a>

      <Header />

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="flex-grow focus-visible:outline-none focus-visible:shadow-none"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
