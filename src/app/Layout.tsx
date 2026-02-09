import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
