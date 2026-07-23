import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { ProgramCard } from '../components/ProgramCard';
import { CTABanner } from '../components/CTABanner';
import { Button } from '../components/Button';
import {
  Users,
  Heart,
  BookOpen,
  Sprout,
  HandHeart,
  Shield,
  Music,
  Briefcase,
  Home,
  Lightbulb,
  Coffee,
  GraduationCap,
  Clock,
  MapPin,
  CalendarDays,
  Laptop,
  Mail
} from 'lucide-react';

export function Programs() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Programs & Services</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              The programs we want to build at MARRA are designed to foster connection, growth,
              and wellbeing through practical, community-shaped support. Our first program — the
              Volunteer IT Program — is now running and open for applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Now Running: Volunteer IT Program */}
      <section id="volunteer-it-program" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl border border-primary/10 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="grid lg:grid-cols-5">
                {/* Program story */}
                <div className="lg:col-span-3 p-10 md:p-14">
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Now running · Applications open
                  </span>
                  <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
                    Volunteer IT Program
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-lg mb-8">
                    <p>
                      Hands-on volunteering for people with an IT background — especially those
                      who find that a lack of local experience holds them back in the Australian
                      job market. Volunteers join a small development team and build genuine
                      features that ship to our volunteer and workshop platform.
                    </p>
                    <p>
                      This is not classroom-style training. Volunteers pick up real tickets, open
                      pull requests, get code review, and see their work go live.
                    </p>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
                    Current volunteer roles
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Frontend Developer', 'Backend Developer', 'DevOps / Cloud Engineer', 'QA & Test Engineer'].map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-primary/20 text-primary px-4 py-1.5 text-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
                    What volunteers gain
                  </p>
                  <ul className="space-y-2 mb-10">
                    {[
                      'Local project experience on a production system, with an Australian organisation',
                      'A portfolio contribution — real features you can point to in interviews',
                      'A written reference and volunteer certificate on completing the program',
                      'Mentoring and code review — structured feedback on every contribution',
                    ].map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3 mt-2 shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:hello@marrahub.com.au?subject=Volunteer%20IT%20Program%20application"
                      className="inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 font-medium active:scale-95 hover:scale-[1.02] bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-8 py-4 text-lg"
                    >
                      <Mail size={20} />
                      Apply by Email
                    </a>
                    <Button href="/contact" variant="outline" size="lg">
                      Ask a Question
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Email your CV with a short note about yourself and which role interests you.
                    We'll arrange an informal chat — no formal interview process.
                  </p>
                </div>

                {/* Practical details */}
                <div className="lg:col-span-2 bg-primary text-primary-foreground p-10 md:p-14">
                  <h3 className="font-serif text-2xl text-white mb-8">Practical Details</h3>
                  <div className="space-y-7">
                    <div className="flex items-start gap-4">
                      <GraduationCap size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">Eligibility</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          Hold, or be currently studying towards, an IT certificate or bachelor's
                          degree.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">Commitment</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          From 15 hours per fortnight (approx. 5–10 hours a week), flexible around
                          study and work.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CalendarDays size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">Duration</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          Typically 3–6 months, adjusted to suit each volunteer.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">Location</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          Remote-friendly; we're based in Caulfield South, Melbourne.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Laptop size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">You'll Need</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          Your own computer, an internet connection, and conversational English.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <HandHeart size={22} className="text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">Type</p>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">
                          Volunteer (unpaid) role — no cost to participants.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Programs */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Core Services"
            title="Programs We Want to Build"
            description="These are the core program areas we want to develop as MARRA grows and community needs become clearer."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProgramCard 
                icon={Users}
                title="Family Support Services"
                description="Support we want to offer for families navigating life's challenges, including parenting workshops, family guidance, and peer support spaces."
                outcomes={[
                  "Stronger family connections",
                  "Better access to support and resources",
                  "More parenting confidence",
                  "A stronger sense of community belonging"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProgramCard 
                icon={BookOpen}
                title="Educational Programs"
                description="Learning opportunities we hope to create for all ages, from early support through to adult literacy, skills-building, and lifelong learning."
                outcomes={[
                  "Stronger literacy and numeracy foundations",
                  "Clearer lifelong learning pathways",
                  "Practical career development support",
                  "Improved digital confidence"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProgramCard 
                icon={Heart}
                title="Wellbeing & Health"
                description="Wellbeing-focused activities we want to develop, including mental health support, physical wellness, and accessible community care."
                outcomes={[
                  "Improved wellbeing and confidence",
                  "Healthier day-to-day routines",
                  "Less social isolation",
                  "Better access to helpful resources"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProgramCard 
                icon={Sprout}
                title="Youth Development"
                description="Programs we want to shape with young people around leadership, mentorship, creative expression, and practical life skills."
                outcomes={[
                  "Greater youth confidence and participation",
                  "Leadership development",
                  "Positive peer connections",
                  "Clearer future pathways"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProgramCard 
                icon={HandHeart}
                title="Elder Care & Support"
                description="Dedicated support we hope to offer older community members through social activities, companionship, and wellbeing-focused programs."
                outcomes={[
                  "Reduced loneliness and isolation",
                  "Active ageing support",
                  "Intergenerational connections",
                  "Stronger wellbeing support"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ProgramCard 
                icon={Shield}
                title="Inclusion & Advocacy"
                description="Inclusive and advocacy-focused work we want to build for diverse communities, cultural safety, and better accessibility."
                outcomes={[
                  "Cultural safety and respect",
                  "Equal access to services",
                  "Stronger community voice",
                  "More inclusive support pathways"
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Programs */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Extended Services"
            title="Additional Community Initiatives"
            description="Additional ideas we would like to explore as MARRA grows and community priorities become clearer."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProgramCard 
                icon={Music}
                title="Arts & Creative Expression"
                description="Creative workshops, classes, and community events we would love to run through music, visual arts, and performance."
                outcomes={[
                  "Creative skill development",
                  "Cultural expression",
                  "Community showcase opportunities"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProgramCard 
                icon={Briefcase}
                title="Employment Support"
                description="Employment-focused support we want to offer through job readiness training, resume workshops, interview preparation, and practical guidance."
                outcomes={[
                  "Improved employability",
                  "Stronger job readiness",
                  "More workplace confidence"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProgramCard 
                icon={Home}
                title="Housing & Homelessness Support"
                description="Housing support we hope to provide through advocacy, practical resources, and guidance for people facing housing instability."
                outcomes={[
                  "Housing pathway support",
                  "Crisis intervention",
                  "Long-term stability planning"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProgramCard 
                icon={Lightbulb}
                title="Financial Literacy"
                description="Financial capability programs we want to develop around budgeting, planning, and building long-term resilience."
                outcomes={[
                  "Better money management",
                  "Reduced financial stress",
                  "Long-term planning skills"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProgramCard 
                icon={Coffee}
                title="Social Connection Groups"
                description="Regular meetups, interest groups, and welcoming social activities we want to create to help people connect and feel included."
                outcomes={[
                  "New friendships",
                  "Reduced loneliness",
                  "Shared interests and hobbies"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ProgramCard 
                icon={GraduationCap}
                title="Volunteer & Leadership Training"
                description="Leadership and volunteer pathways we hope to build so community members can contribute, host, and grow with MARRA."
                outcomes={[
                  "Leadership skills",
                  "Community contribution",
                  "Volunteer pathways"
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Access */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="How People Will Join Our Programs"
            description="As programs begin to roll out, we want the process to feel welcoming, simple, and easy to navigate."
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
              <p className="text-muted-foreground">
                Reach out by phone or email to register interest, ask questions, or tell us what
                kind of support and community activity matters most to you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Your Fit</h3>
              <p className="text-muted-foreground">
                As programs develop, we want to help people find activities that match their
                goals, interests, and circumstances in a flexible, person-centered way.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Join & Participate</h3>
              <p className="text-muted-foreground">
                Join programs as they launch, participate at your own pace, and help shape what
                improves through feedback, conversation, and continued involvement.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 bg-muted/50 rounded-xl p-8 border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-center">Important Information</h3>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Free & Low-Cost Services</h4>
                <p className="text-sm">
                  We want most programs to be free or low-cost wherever possible so financial
                  barriers do not stop people from taking part.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Accessible for All</h4>
                <p className="text-sm">
                  Accessibility will be a core part of how programs are designed. Contact us about
                  specific access needs or accommodations you would want us to consider.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Confidential Support</h4>
                <p className="text-sm">
                  We intend to keep all interactions respectful, confidential, and supported by
                  strong privacy and safeguarding practices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Flexible Scheduling</h4>
                <p className="text-sm">
                  We want to schedule programs in ways that suit real life, including evenings and
                  weekends where possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner 
            title="Want to Shape These Programs With Us?"
            description="Reach out to register your interest, share what matters to your community, or help us build these programs well."
            primaryButtonText="Contact Us"
            primaryButtonHref="/contact"
            secondaryButtonText="View Impact"
            secondaryButtonHref="/impact"
          />
        </div>
      </section>
    </div>
  );
}
