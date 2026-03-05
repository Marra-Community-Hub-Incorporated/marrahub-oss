import React from 'react';
import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">MARRA</h3>
            <p className="text-primary-foreground/80 mb-4">
              A non-profit community centre serving Glen Eira with care, connection, and commitment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About MARRA
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Programs & Services
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Community Impact
                </Link>
              </li>
              <li>
                <Link to="/governance" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Caulfield South, VIC<br />Glen Eira, Australia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <a href="mailto:hello@marrahub.com.au" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  hello@marrahub.com.au
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={20} className="mt-1 flex-shrink-0" />
                <div className="text-primary-foreground/80">
                  <a href="tel:+61421803285" className="hover:text-primary-foreground transition-colors">
                    Main: 0421 803 285
                  </a>
                  <br />
                  <a href="tel:+61433212855" className="pl-11 hover:text-primary-foreground transition-colors">
                    0433 212 855
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Governance */}
          <div>
            <h4 className="font-semibold mb-4">Transparency</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/governance" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Governance Structure
                </Link>
              </li>
              <li>
                <Link to="/governance#safeguarding" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Safeguarding Policy
                </Link>
              </li>
              <li>
                <Link to="/governance#accountability" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Accountability
                </Link>
              </li>
              <li>
                <Link to="/contact#accessibility" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} MARRA Community Centre. ABN: 79178583024. All rights reserved.
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
