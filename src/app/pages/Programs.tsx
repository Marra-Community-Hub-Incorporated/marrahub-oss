import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { ProgramCard } from '../components/ProgramCard';
import { CTABanner } from '../components/CTABanner';
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
  GraduationCap
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
              and wellbeing through practical, community-shaped support.
            </p>
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
