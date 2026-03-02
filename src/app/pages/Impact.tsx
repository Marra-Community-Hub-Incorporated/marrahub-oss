import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { ImpactCard } from '../components/ImpactCard';
import { CTABanner } from '../components/CTABanner';
import { Target, Users, TrendingUp, Award } from 'lucide-react';

export function Impact() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Community Impact</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              We are building MARRA with impact in mind from the beginning, focusing on the
              changes we want to create and the signals we will track as the work grows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="What We Will Track"
            title="Our Early Impact Focus"
            description="As MARRA begins, these are the first areas we will use to understand whether our work is meaningful, trusted, and sustainable."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ImpactCard
                number="01"
                icon={Users}
                label="Community Reach"
                description="Who we are connecting with, who returns, and where access gaps still remain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ImpactCard
                number="02"
                icon={Target}
                label="Pilot Programs"
                description="Small, practical activities that help us learn what the community values most"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ImpactCard
                number="03"
                icon={Award}
                label="Volunteer Readiness"
                description="Building a capable and supported base of people who can help carry the work"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ImpactCard
                number="04"
                icon={TrendingUp}
                label="Trust & Feedback"
                description="Listening closely so MARRA grows in ways that feel useful, safe, and community-led"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Areas of Impact"
            description="The key kinds of change MARRA hopes to contribute to as programs begin and develop over time."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Social Connection & Belonging</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Creating welcoming spaces where people can meet, return, and feel part of
                    something local and meaningful.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Welcoming environments that reduce isolation and encourage connection
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Stronger peer support and local relationships over time
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Activities shaped by community voice and lived experience
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Health & Wellbeing</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Supporting emotional, social, and practical wellbeing through accessible
                    activities and compassionate pathways to care.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Programs that support confidence, calm, and day-to-day wellbeing
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Clear referral pathways when extra support is needed
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Practical activities that encourage healthy routines and participation
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Skills & Employment</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Building confidence, capability, and clearer next steps for people navigating
                    learning, work, and everyday life.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Workshops that build useful skills and everyday confidence
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Support that opens pathways to learning, work, and stability
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Programs designed around practical next steps, not theory alone
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Youth Empowerment</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Making space for young people to participate, be heard, and shape the future
                    direction of the community around them.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Safe spaces where young people can participate and contribute
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Leadership and mentoring opportunities that grow over time
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Youth ideas informing future activities and community projects
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Partnerships */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Working Together"
            title="Community Partnerships"
            description="Collaboration will strengthen MARRA as it grows. We want to build relationships that make the work more grounded, connected, and useful."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl p-8 text-center"
            >
              <h3 className="text-xl font-semibold mb-4">Local Councils</h3>
              <p className="text-muted-foreground leading-relaxed">
                Building relationships with local government to better understand place-based
                priorities, community need, and long-term opportunities for collaboration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-xl p-8 text-center"
            >
              <h3 className="text-xl font-semibold mb-4">Health & Education</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connecting with schools, health services, and educators so support can be more
                practical, coordinated, and responsive to real community circumstances.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-8 text-center"
            >
              <h3 className="text-xl font-semibold mb-4">Community Organisations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Working alongside grassroots groups and other organisations so MARRA can contribute
                meaningfully without duplicating what already exists.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Long-term Vision */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Long-Term Vision"
            description="Building a community model that grows responsibly, stays grounded, and earns trust over time."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              MARRA's long-term impact is not only about scale. It is about building something
              community-led, culturally aware, and practical enough to stay useful as it grows.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Expansion Across Victoria</h4>
                <p className="text-sm">
                  Grow carefully into new communities only when the foundations, partnerships, and
                  support systems are strong enough to do it well.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Capacity Building</h4>
                <p className="text-sm">
                  Strengthen volunteers, leaders, and local contributors so programs can become
                  more resilient over time.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Learning & Improvement</h4>
                <p className="text-sm">
                  Use feedback, evidence, and reflection to improve programs continuously rather
                  than assuming the first version will be the best one.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Sustainable Support</h4>
                <p className="text-sm">
                  Build a funding and partnership base that allows MARRA to remain steady,
                  transparent, and community-focused.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Be Part of Our Impact"
            description="Whether you want to support the work, volunteer, or explore a future partnership, you can help shape what MARRA becomes."
            primaryButtonText="Get Involved"
            primaryButtonHref="/contact"
            secondaryButtonText="View Programs"
            secondaryButtonHref="/programs"
          />
        </div>
      </section>
    </div>
  );
}
