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
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Programs & Services</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Comprehensive community programs designed to foster connection, growth, and 
              wellbeing for all community members across Melbourne and Victoria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Programs */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Core Services"
            title="Our Flagship Programs"
            description="Established programs with proven community impact and outcomes."
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
                description="Comprehensive support for families navigating life's challenges, including parenting workshops, family counseling, and peer support groups."
                outcomes={[
                  "Stronger family connections",
                  "Access to resources and support",
                  "Improved parenting confidence",
                  "Community belonging"
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
                description="Learning opportunities for all ages, from early childhood education to adult literacy and skills development programs."
                outcomes={[
                  "Improved literacy and numeracy",
                  "Lifelong learning pathways",
                  "Career development support",
                  "Digital skills training"
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
                description="Mental health support, physical wellness activities, and holistic programs promoting overall community health."
                outcomes={[
                  "Better mental health outcomes",
                  "Active and healthy lifestyles",
                  "Reduced social isolation",
                  "Access to health resources"
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
                description="Engaging programs for young people focusing on leadership, mentorship, creative expression, and life skills."
                outcomes={[
                  "Youth empowerment",
                  "Leadership development",
                  "Positive peer connections",
                  "Career pathway support"
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
                description="Dedicated services for older community members, including social activities, health support, and companionship programs."
                outcomes={[
                  "Reduced loneliness",
                  "Active aging support",
                  "Intergenerational connections",
                  "Health and wellness monitoring"
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
                description="Support for diverse communities, cultural inclusion initiatives, and advocacy for community rights and accessibility."
                outcomes={[
                  "Cultural safety and respect",
                  "Equal access to services",
                  "Community voice amplification",
                  "Disability support"
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
            description="Specialized programs addressing specific community needs and interests."
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
                description="Workshops, classes, and community events celebrating creativity through music, visual arts, and performance."
                outcomes={[
                  "Creative skill development",
                  "Cultural expression",
                  "Community showcase events"
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
                description="Job readiness training, resume workshops, interview preparation, and connections to employment opportunities."
                outcomes={[
                  "Improved employability",
                  "Job placement support",
                  "Workplace skills training"
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
                description="Advocacy, resources, and support for individuals and families experiencing housing instability or homelessness."
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
                description="Budgeting workshops, financial planning support, and resources for building financial capability and resilience."
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
                description="Regular meetups, interest groups, and social activities designed to reduce isolation and build friendships."
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
                description="Programs to develop community leaders and train volunteers who give back to strengthen our community."
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
            title="How to Access Our Programs"
            description="We make it easy to connect with the support and services you need."
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
                Contact us by phone, email, or visit our centre. We'll discuss your needs and 
                interests in a welcoming, judgment-free conversation.
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
                Together we'll identify programs that match your goals, interests, and circumstances. 
                All services are flexible and person-centered.
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
                Start participating in programs at your own pace. We provide ongoing support, 
                check-ins, and connections to additional resources as needed.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 bg-muted/50 rounded-xl p-8 border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-center">Important Information</h3>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Free & Low-Cost Services</h4>
                <p className="text-sm">
                  Most programs are free or low-cost. We never turn anyone away due to financial 
                  constraints—speak to us about your situation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Accessible for All</h4>
                <p className="text-sm">
                  Our centre and programs are designed to be accessible. Contact us about specific 
                  accessibility needs or accommodations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Confidential Support</h4>
                <p className="text-sm">
                  All interactions are confidential and respectful. We maintain strict privacy 
                  standards and safeguarding practices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Flexible Scheduling</h4>
                <p className="text-sm">
                  Programs run at various times to accommodate different schedules, including 
                  evenings and weekends where possible.
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
            title="Ready to Get Started?"
            description="Reach out to learn more about our programs or register your interest. We're here to support you."
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
