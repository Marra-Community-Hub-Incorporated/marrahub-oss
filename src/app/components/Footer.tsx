import React from 'react';
import { Link } from 'react-router';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { featureFlags } from '../featureFlags';

/* Column headings need an explicit light colour: the base stylesheet colours
   h1–h4 with var(--primary), which is invisible on the primary-green footer. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-semibold mb-5">
      {children}
      <span className="block w-8 h-0.5 bg-accent/70 rounded-full mt-2" aria-hidden="true"></span>
    </h4>
  );
}

export function Footer() {
  const logoUrl = `${import.meta.env.BASE_URL}media/marra-wordmark.webp`;

  return (
    <footer className="relative bg-primary text-primary-foreground mt-20 overflow-hidden">
      {/* Layered background: deepening gradient + the cultural weave pattern */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-[#122b23] pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-cultural-fusion pointer-events-none" aria-hidden="true"></div>
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center w-fit mb-4 group" aria-label="MARRA home">
              <img
                src={logoUrl}
                alt=""
                width="48"
                height="48"
                className="w-12 h-12 object-contain -mr-1 transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110"
              />
              <span className="text-3xl font-serif font-bold text-white tracking-tight">arra</span>
            </Link>
            <p className="text-primary-foreground/75 leading-relaxed">
              A non-profit community centre serving Glen Eira with care, connection, and commitment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-primary-foreground/75 hover:text-white transition-colors">
                  About MARRA
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-primary-foreground/75 hover:text-white transition-colors">
                  Programs & Services
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-primary-foreground/75 hover:text-white transition-colors">
                  Discover the Hub
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-primary-foreground/75 hover:text-white transition-colors">
                  Community Impact
                </Link>
              </li>
              <li>
                <Link to="/governance" className="text-primary-foreground/75 hover:text-white transition-colors">
                  Governance
                </Link>
              </li>
              {featureFlags.volunteer && (
                <li>
                  <Link to="/volunteer" className="text-primary-foreground/75 hover:text-white transition-colors">
                    Volunteer
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/launch"
                  className="inline-flex items-center gap-2 text-primary-foreground/75 hover:text-white transition-colors"
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Our First Meet-Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnHeading>Contact Us</ColumnHeading>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <MapPin size={17} />
                </span>
                <span className="text-primary-foreground/75 pt-1.5">
                  Caulfield South, VIC<br />Glen Eira, Australia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <Mail size={17} />
                </span>
                <a
                  href="mailto:hello@marrahub.com.au"
                  className="text-primary-foreground/75 hover:text-white transition-colors"
                >
                  hello@marrahub.com.au
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <Phone size={17} />
                </span>
                <a href="tel:+61433212855" className="text-primary-foreground/75 hover:text-white transition-colors">
                  0433 212 855
                </a>
              </li>
            </ul>
          </div>

          {/* Governance */}
          <div>
            <ColumnHeading>Transparency</ColumnHeading>
            <ul className="space-y-3">
              <li>
                <Link to="/governance" className="text-primary-foreground/75 hover:text-white transition-colors">
                  Governance Structure
                </Link>
              </li>
              <li>
                <Link
                  to="/governance#safeguarding"
                  className="text-primary-foreground/75 hover:text-white transition-colors"
                >
                  Safeguarding Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/governance#accountability"
                  className="text-primary-foreground/75 hover:text-white transition-colors"
                >
                  Accountability
                </Link>
              </li>
              <li>
                <Link
                  to="/contact#accessibility"
                  className="text-primary-foreground/75 hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              {/* Registered legal entity name — must match the ACNC/ABR record
                  exactly, since it is what external verifications check. */}
              © {new Date().getFullYear()} Marra Community Hub Incorporated · ABN 79 178 583 024 · Caulfield South VIC 3162
            </p>
            <p className="text-primary-foreground/60 text-sm">
              Acknowledgement: We acknowledge the Traditional Owners of the land and pay our respects to Elders past and present.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
