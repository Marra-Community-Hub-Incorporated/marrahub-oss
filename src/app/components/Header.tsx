import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const logoUrl = `${import.meta.env.BASE_URL}media/favicon/web-app-manifest-512x512.png`;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Impact', href: '/impact' },
    { name: 'Governance', href: '/governance' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center group" aria-label="MARRA home">
            <img
              src={logoUrl}
              alt="MARRA Community Hub logo"
              width="56"
              height="56"
              className="w-14 h-14 object-contain -mr-1 transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110"
            />
            <span className="text-3xl font-serif font-bold text-primary tracking-tight">arra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-border/50">
              <Button href="/contact" size="sm" className="shadow-lg shadow-primary/10">
                Get Involved
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-primary/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/5 font-semibold'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 px-4">
                  <Button href="/contact" className="w-full shadow-lg shadow-primary/10" onClick={() => setMobileMenuOpen(false)}>
                    Get Involved
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
