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
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Community Impact</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Measuring what matters: the meaningful change we create together in our 
              communities across Melbourne and Victoria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="By the Numbers"
            title="Our Reach & Impact"
            description="Data from our most recent annual reporting period."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ImpactCard 
                number="2,500+"
                label="People Served"
                description="Community members supported annually across all programs"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ImpactCard 
                number="40+"
                label="Active Programs"
                description="Diverse services meeting evolving community needs"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ImpactCard 
                number="150+"
                label="Volunteers"
                description="Dedicated community members contributing their time"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ImpactCard 
                number="95%"
                label="Satisfaction"
                description="Participants reporting positive outcomes and experiences"
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
            description="The key ways MARRA creates meaningful change in our community."
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
                    Reducing isolation and loneliness by creating spaces where people connect, 
                    form friendships, and build a sense of belonging.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      78% reduction in reported loneliness among regular participants
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      1,200+ new community connections formed annually
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      12 peer support groups meeting weekly
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
                    Supporting mental, physical, and emotional health through accessible programs 
                    and compassionate care.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      82% of participants report improved mental wellbeing
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      500+ individuals accessing mental health support
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      6 wellness programs running weekly
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
                    Building capability through education, training, and pathways to employment 
                    and financial stability.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      68% of job seekers gained employment within 6 months
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      350+ training and skills workshops delivered
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      65 community members completed literacy programs
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
                    Investing in young people through mentorship, leadership opportunities, and 
                    safe spaces for growth.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      420+ young people engaged in youth programs
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      15 youth-led community projects completed
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      90% report increased confidence and leadership skills
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
            description="Collaboration strengthens our impact. We work closely with councils, organisations, and community groups."
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
                Partnering with local government to align services, share resources, and address 
                community needs identified through council engagement.
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
                Collaborating with schools, health services, and educational institutions to 
                provide holistic, coordinated support.
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
                Working alongside other non-profits and community groups to avoid duplication 
                and maximize collective impact.
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
            description="Building sustainable, resilient communities for generations to come."
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              MARRA's impact extends beyond immediate service delivery. We're committed to creating 
              lasting change that strengthens communities for the long term.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Expansion Across Victoria</h4>
                <p className="text-sm">
                  Plans to establish satellite centres in regional Victoria, bringing our model of 
                  community-centered care to underserved areas.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Capacity Building</h4>
                <p className="text-sm">
                  Training community leaders and volunteers to sustain programs independently, 
                  ensuring long-term viability.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Innovation & Research</h4>
                <p className="text-sm">
                  Partnering with universities to evaluate impact, share learnings, and develop 
                  evidence-based best practices.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">Sustainable Funding</h4>
                <p className="text-sm">
                  Diversifying funding sources through grants, partnerships, and social enterprise 
                  to ensure financial sustainability.
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
            description="Whether you're seeking support, want to volunteer, or represent a funding organisation, you can contribute to positive community change."
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
