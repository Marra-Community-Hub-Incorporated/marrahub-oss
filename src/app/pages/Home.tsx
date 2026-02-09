import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ProgramCard } from '../components/ProgramCard';
import { ImpactCard } from '../components/ImpactCard';
import { CTABanner } from '../components/CTABanner';
import { 
  Users, 
  Heart, 
  BookOpen, 
  Sprout,
  HandHeart,
  Shield,
  ArrowDown
} from 'lucide-react';

/**
 * Hero Section: 'The Shared Journey'
 * Redesigned for a brighter, warmer "Golden Hour" feel with high-contrast buttons.
 */
function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const bgVariants = {
    initial: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 1.05,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 2, 
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  // Correct path for GitHub Pages using the base set in vite.config.ts
  const heroBgPath = `${import.meta.env.BASE_URL}media/hero-background.png`;

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-primary">
      
      {/* Background Image Wrapper with Brighter "Golden Hour" Overlays */}
      <motion.div 
        variants={bgVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 z-0"
      >
        <img 
          src={heroBgPath} 
          alt="Community Connection" 
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* 
           Brightened Overlay System:
           - Lighter top gradient for header clarity.
           - Warm amber tint to create the "Golden Hour" effect.
           - Reduced overall darkness to keep the image vibrant.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-orange-400/10 mix-blend-soft-light"></div>
      </motion.div>

      {/* Content Container: Positioned higher to ensure visibility */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-16 pb-32 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="max-w-4xl"
        >
          {/* Pill Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center py-1.5 px-5 rounded-full border border-white/30 bg-black/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white">
                A Family Founded Community
              </span>
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <h1 className="text-white mb-8 font-serif font-medium leading-[1.1] tracking-tight text-5xl md:text-8xl lg:text-9xl drop-shadow-xl">
            Building a Future, <br />
            <span className="relative inline-block mt-2">
              {/* Glow Layer: Softened and shifted away from white */}
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-secondary/40 to-accent bg-clip-text text-transparent opacity-30 blur-lg animate-pulse">
                Together
              </span>
              {/* Main Text Layer: Richer gold/terracotta tones for better definition */}
              <span className="relative bg-gradient-to-r from-[#d4a574] via-[#f7dcb8] to-[#b05e45] bg-clip-text text-transparent italic font-semibold filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                Together
              </span>
            </span>
          </h1>
          
          {/* Body Text: Increased contrast */}
          <p className="text-lg md:text-2xl mb-12 text-white font-sans font-normal text-balance drop-shadow-md max-w-2xl mx-auto">
            MARRA represents connection and helping hands. 
            We build belonging for all across Melbourne and Victoria.
          </p>
          
          {/* CTA Buttons: Distinct colors for maximum visibility */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
          >
            <Button 
              href="/programs" 
              size="lg" 
              className="w-full sm:w-auto min-w-[220px] h-16 text-lg bg-secondary hover:bg-secondary/90 text-white shadow-2xl font-bold border-none rounded-full transition-all hover:scale-105"
            >
              Explore Programs
            </Button>
            <Button 
              href="/contact" 
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[220px] h-16 text-lg bg-white/10 hover:bg-white/20 border-white/60 text-white backdrop-blur-md rounded-full transition-all font-semibold"
            >
              Get Involved
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-white/70 hidden md:flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={24} />
        </motion.div>
      </div>

      {/* Organic Wave Bottom Overlay */}
      <div className="absolute bottom-[-1px] left-0 w-full leading-[0] z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1440 180" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-auto min-h-[100px]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C320,160 520,180 720,120 C920,60 1120,0 1440,80 L1440,180 L0,180 Z" 
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      {/* Why MARRA Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-secondary/30 rounded-tl-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/30 rounded-br-3xl"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1765614766505-b4afa9eef2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwaW5nJTIwaGFuZHMlMjB0b2dldGhlciUyMHN1cHBvcnR8ZW58MXx8fHwxNzcwNTk1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Helping hands together"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover relative z-10"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader 
                subtitle="Our Purpose"
                title="Connection, Helping Hands & Working Together"
                align="left"
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  The name <strong className="text-primary font-semibold">MARRA</strong> is inspired by Aboriginal language. 
                  It represents the very essence of what we do: reaching out, providing support, and building lasting bonds.
                </p>
                <p>
                  Founded by a local family in Caulfield South, MARRA was born from a simple belief: 
                  every person deserves a place where they are seen, heard, and valued.
                </p>
                <p>
                  We operate with a commitment to transparency and cultural awareness, 
                  ensuring our programs serve as a bridge for families and individuals across Victoria.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="What We Offer"
            title="Community Programs"
            description="Purpose-built initiatives designed to foster connection and wellbeing for every stage of life."
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
                  "Improved literacy and skills",
                  "Lifelong learning pathways",
                  "Career development support"
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
                  "Reduced social isolation"
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
                  "Positive peer connections"
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
                  "Intergenerational connections"
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
                  "Community voice amplification"
                ]}
              />
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button href="/programs" variant="primary" size="lg">
              View All Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Our Impact"
            title="Creating Meaningful Change"
            description="Together, we're building stronger, more connected communities across Melbourne and Victoria."
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
                label="Community Members Served"
                description="Individuals and families supported annually"
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
                description="Diverse services meeting community needs"
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
                label="Volunteer Contributors"
                description="Dedicated community members giving back"
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
                label="Satisfaction Rating"
                description="Community members reporting positive outcomes"
              />
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button href="/impact" variant="primary">
              Explore Our Impact
            </Button>
          </div>
        </div>
      </section>

      {/* Governance Preview Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader 
                subtitle="Transparency & Accountability"
                title="Built on Trust"
                align="left"
              />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  MARRA operates with complete transparency and strong governance structures. 
                  We are committed to ethical practices, safeguarding, and accountability to our community.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Independent board oversight and ethical governance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Comprehensive safeguarding and child protection policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Regular reporting and community consultation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Cultural safety and inclusion frameworks</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button href="/governance" variant="outline">
                  View Governance Structure
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-muted/50 rounded-2xl px-14 py-10 border border-border"
            >
              <h3 className="text-4xl font-semibold mb-8">Our Commitments</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Community-First Approach</h4>
                  <p className="text-base text-muted-foreground">
                    Every decision is guided by the needs and voices of our community members.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Cultural Respect</h4>
                  <p className="text-base text-muted-foreground">
                    We honour Aboriginal heritage and maintain culturally safe spaces for all.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Financial Transparency</h4>
                  <p className="text-base text-muted-foreground">
                    Open reporting on funding, expenditure, and community investment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-3">Continuous Improvement</h4>
                  <p className="text-base text-muted-foreground">
                    Regular evaluation and adaptation based on community feedback.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Where We Are"
            title="Serving Melbourne & Victoria"
            description="Based in Caulfield South, with a vision to support communities across Victoria."
          />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1766050588355-0bed0aba1eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWxib3VybmUlMjBjaXR5c2NhcGUlMjB2aWN0b3JpYXxlbnwxfHx8fDE3NzA1OTUzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Melbourne cityscape"
                className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Primary Location</h4>
                <p className="text-muted-foreground">
                  Caulfield South, VIC<br />
                  Melbourne, Australia
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Service Areas</h4>
                <p className="text-muted-foreground">
                  We currently serve communities across greater Melbourne and have plans to 
                  extend our reach to regional Victoria in partnership with local councils.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
                <p className="text-muted-foreground mb-4">
                  Have questions or want to learn more? We'd love to hear from you.
                </p>
                <Button href="/contact" variant="primary">
                  Get in Touch
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner 
            title="Join Our Community"
            description="Whether you're looking for support, want to volunteer, or represent a council or funding body, we welcome you to connect with MARRA."
            primaryButtonText="Explore Programs"
            primaryButtonHref="/programs"
            secondaryButtonText="Contact Us"
            secondaryButtonHref="/contact"
          />
        </div>
      </section>
    </div>
  );
}
