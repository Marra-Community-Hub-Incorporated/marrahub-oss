import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { MapPin, Phone, Mail, Clock, Accessibility } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreavvnv';
const TURNSTILE_SITE_KEY = '0x4AAAAAACksijQmW93tasP6';
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

interface TurnstileApi {
  render: (
    container: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact' | 'flexible';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function ensureTurnstileScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load Turnstile.'));
      document.head.appendChild(script);
    }

    let attempts = 0;
    const maxAttempts = 100;
    const intervalId = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(intervalId);
        resolve();
        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        window.clearInterval(intervalId);
        reject(new Error('Turnstile took too long to load.'));
      }
    }, 100);
  });
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<{
    state: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({
    state: 'idle',
    message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupTurnstile = async () => {
      try {
        await ensureTurnstileScript();

        if (!isMounted || !window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) {
          return;
        }

        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          size: 'flexible',
          callback: (token) => {
            if (!isMounted) {
              return;
            }

            setTurnstileToken(token);
            setFormStatus((currentStatus) =>
              currentStatus.state === 'error' && currentStatus.message.toLowerCase().includes('security')
                ? { state: 'idle', message: '' }
                : currentStatus,
            );
          },
          'expired-callback': () => {
            if (!isMounted) {
              return;
            }

            setTurnstileToken('');
            setFormStatus({
              state: 'error',
              message: 'Security verification expired. Please complete it again before sending.',
            });
          },
          'error-callback': () => {
            if (!isMounted) {
              return;
            }

            setTurnstileToken('');
            setFormStatus({
              state: 'error',
              message: 'Security verification could not be loaded. Please refresh and try again.',
            });
          },
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setFormStatus({
          state: 'error',
          message: 'Security verification could not be loaded. Please refresh and try again.',
        });
      }
    };

    setupTurnstile();

    return () => {
      isMounted = false;

      if (window.turnstile && turnstileWidgetIdRef.current && typeof window.turnstile.remove === 'function') {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }

      turnstileWidgetIdRef.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!turnstileToken) {
      setFormStatus({
        state: 'error',
        message: 'Please complete the security check before sending your message.',
      });
      return;
    }

    setFormStatus({
      state: 'submitting',
      message: 'Sending your message...',
    });

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.phone);
    formPayload.append('subject', formData.subject);
    formPayload.append('message', formData.message);
    formPayload.append('_subject', `MARRA enquiry: ${formData.subject}`);
    formPayload.append('_replyto', formData.email);
    formPayload.append('cf-turnstile-response', turnstileToken);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formPayload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.errors?.map((error: { message: string }) => error.message).join(', ') ||
          'There was a problem sending your message. Please try again.';

        setFormStatus({
          state: 'error',
          message: errorMessage,
        });
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        }
        setTurnstileToken('');
        return;
      }

      setFormStatus({
        state: 'success',
        message: 'Thanks for reaching out. Your enquiry has been sent successfully.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
      setTurnstileToken('');
    } catch {
      setFormStatus({
        state: 'error',
        message: 'There was a problem sending your message. Please try again.',
      });
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
      setTurnstileToken('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (formStatus.state !== 'idle') {
      setFormStatus({ state: 'idle', message: '' });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero-background bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Contact Us</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              We're here to help. Whether you're seeking support, have questions, or want to 
              partner with us, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Caulfield South, VIC<br />
                      Glen Eira, Australia
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Focused on Caulfield South as our primary local area
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <div className="text-muted-foreground space-y-1">
                      <a href="tel:+61421803285" className="block hover:text-primary transition-colors">
                        Main: 0421 803 285
                      </a>
                      <a href="tel:+61433212855" className="block hover:text-primary transition-colors">
                        0433 212 855
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monday to Friday, 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:hello@marrahub.com.au" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@marrahub.com.au
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 1-2 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Centre Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Some programs run outside these hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-muted/50 rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-3">For Urgent Matters</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you're experiencing a crisis or urgent situation, please contact:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Emergency Services: <a href="tel:000" className="text-primary hover:underline">000</a></li>
                  <li>Lifeline: <a href="tel:131114" className="text-primary hover:underline">13 11 14</a></li>
                  <li>Beyond Blue: <a href="tel:1300224636" className="text-primary hover:underline">1300 22 4636</a></li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-foreground">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-foreground">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-foreground">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-foreground">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a subject...</option>
                    <option value="programs">Program Information</option>
                    <option value="support">Seeking Support</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="partnership">Partnership/Council Enquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-foreground">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  ></textarea>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    By submitting this form, you agree to our privacy policy. We will only use 
                    your information to respond to your enquiry.
                  </p>
                </div>

                <div className="space-y-2">
                  <div ref={turnstileContainerRef} className="min-h-[65px]" />
                  <p className="text-xs text-muted-foreground">
                    This form is protected by Cloudflare Turnstile to reduce spam and automated submissions.
                  </p>
                </div>

                {formStatus.state !== 'idle' && (
                  <div
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      formStatus.state === 'success'
                        ? 'border-primary/20 bg-primary/5 text-primary'
                        : formStatus.state === 'error'
                          ? 'border-destructive/20 bg-destructive/5 text-destructive'
                          : 'border-border bg-muted/50 text-muted-foreground'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {formStatus.message}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={formStatus.state === 'submitting'}
                >
                  {formStatus.state === 'submitting' ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accessibility Information */}
      <section id="accessibility" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Accessibility & Inclusion"
            description="We're committed to ensuring our services and facilities are accessible to everyone."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Accessibility className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold mb-3">Physical Accessibility</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Wheelchair accessible entrances and facilities</li>
                <li>• Accessible parking spaces available</li>
                <li>• Accessible toilets and changing facilities</li>
                <li>• Lifts and ramps throughout the building</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold mb-3">Communication Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Interpreter services available on request</li>
                <li>• Large print materials available</li>
                <li>• Communication assistance for those who need it</li>
                <li>• Alternative formats provided as needed</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold mb-3">Flexible Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reasonable adjustments made as needed</li>
                <li>• Flexible program scheduling options</li>
                <li>• Support workers welcome to attend with you</li>
                <li>• One-on-one assistance available</li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-8 bg-card rounded-xl p-8 border border-border text-center">
            <h3 className="text-xl font-semibold mb-4">Need Specific Accommodations?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Please let us know if you have specific accessibility needs or require accommodations. 
              We'll work with you to ensure you can fully participate in our programs and services.
            </p>
            <a 
              href="mailto:hello@marrahub.com.au"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Accessibility Team
            </a>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Our Service Areas"
            description="Currently serving communities across Glen Eira."
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-background rounded-xl p-6">
              <h3 className="font-semibold mb-3">Current Service Area</h3>
              <p className="text-muted-foreground">
                Our primary service area is currently focused on Caulfield South, where we are
                building the first stage of MARRA's local community presence.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6">
              <h3 className="font-semibold mb-3">Expansion Plans</h3>
              <p className="text-muted-foreground">
                Right now, we are working closely with Glen Eira Council and local community
                partners as we explore how MARRA can grow into a more interactive community
                presence, with future programs, events, and spaces that bring people together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
