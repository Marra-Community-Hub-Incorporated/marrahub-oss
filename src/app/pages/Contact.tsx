import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { MapPin, Phone, Mail, Clock, Accessibility } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert('Thank you for your message. We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
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
                      Melbourne, Australia
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Serving communities across Melbourne and Victoria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+61312345678" className="text-muted-foreground hover:text-primary transition-colors">
                      (03) 1234 5678
                    </a>
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
                    <a href="mailto:info@marra.org.au" className="text-muted-foreground hover:text-primary transition-colors">
                      info@marra.org.au
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
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Send Message
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
              href="mailto:accessibility@marra.org.au"
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
            description="Currently serving communities across Melbourne with plans to expand throughout Victoria."
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
              <p className="text-muted-foreground mb-3">
                Our primary centre is based in Caulfield South, serving the broader Melbourne 
                metropolitan area including:
              </p>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Glen Eira region</li>
                  <li>• Bayside communities</li>
                  <li>• Port Phillip area</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Stonnington district</li>
                  <li>• Greater Melbourne metro</li>
                  <li>• Surrounding suburbs</li>
                </ul>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6">
              <h3 className="font-semibold mb-3">Expansion Plans</h3>
              <p className="text-muted-foreground">
                We are actively working with local councils and community partners to extend our 
                services to regional Victoria. If you're interested in bringing MARRA programs to 
                your area, please get in touch.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
