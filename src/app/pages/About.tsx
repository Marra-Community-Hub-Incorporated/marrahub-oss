import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { Heart, Users, Compass, Shield } from 'lucide-react';

export function About() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">About MARRA</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              We are a family-founded, non-profit community centre dedicated to building 
              connection, care, and belonging across Melbourne and Victoria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meaning of MARRA */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1765614766505-b4afa9eef2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwaW5nJTIwaGFuZHMlMjB0b2dldGhlciUyMHN1cHBvcnR8ZW58MXx8fHwxNzcwNTk1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Helping hands together"
                className="rounded-2xl shadow-lg w-full h-[500px] object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader 
                subtitle="Our Name"
                title="The Meaning of MARRA"
                align="left"
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  The name <strong className="text-foreground">MARRA</strong> is inspired by Aboriginal 
                  language, representing concepts of connection, helping hands, and working together. 
                </p>
                <p>
                  This meaning is central to everything we do. We honour the cultural significance of 
                  this name by ensuring our work embodies these values: bringing people together, 
                  extending support to those who need it, and fostering genuine collaboration.
                </p>
                <p>
                  We acknowledge the Traditional Owners of the land on which we operate and pay our 
                  respects to Elders past and present. Our commitment to cultural safety and respect 
                  guides all our programs and interactions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Our Journey"
            title="The MARRA Story"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              MARRA was founded by a local family in Caulfield South who saw a growing need for 
              inclusive, accessible community spaces where everyone could feel welcome and supported.
            </p>
            <p>
              What started as a small initiative to support local families has grown into a 
              comprehensive community centre serving thousands of people across Melbourne. Our 
              founders believed that strong communities are built on trust, care, and genuine 
              human connection—values that continue to guide us today.
            </p>
            <p>
              As we've grown, we've remained committed to our grassroots origins: listening to 
              community needs, responding with compassion and expertise, and always maintaining 
              transparency in our operations and governance.
            </p>
            <p>
              Today, MARRA is preparing for expansion across Victoria, working in partnership with 
              local councils and community groups to bring our model of inclusive, sustainable 
              community support to more regions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Our Mission & Values"
            description="The principles that guide everything we do"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Care</h3>
              <p className="text-muted-foreground">
                We approach every interaction with compassion, empathy, and a genuine commitment 
                to supporting wellbeing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connection</h3>
              <p className="text-muted-foreground">
                We build bridges between people, creating inclusive spaces where everyone belongs 
                and feels valued.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Compass className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-muted-foreground">
                We operate with transparency, accountability, and ethical practices in all aspects 
                of our work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Respect</h3>
              <p className="text-muted-foreground">
                We honour diversity, maintain cultural safety, and treat every person with dignity 
                and understanding.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="Our Community"
            title="Who We Serve"
            description="MARRA is for everyone. We welcome all members of our community with open doors and open hearts."
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Families & Children</h3>
              <p className="text-muted-foreground leading-relaxed">
                Parents, carers, and children of all ages. We provide parenting support, early 
                childhood programs, family counseling, and activities that bring families together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Young People</h3>
              <p className="text-muted-foreground leading-relaxed">
                Youth and young adults seeking mentorship, skills development, creative outlets, 
                and peer connections in a safe, supportive environment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Older Adults</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seniors looking for social connection, health support, lifelong learning, and 
                activities that promote active aging and reduce isolation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Diverse Communities</h3>
              <p className="text-muted-foreground leading-relaxed">
                People from all cultural backgrounds, abilities, and circumstances. We're committed 
                to cultural safety, accessibility, and inclusive practice.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Individuals in Need</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anyone experiencing hardship, isolation, or seeking support. No one is turned away 
                from accessing help and connection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-background rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Community Partners</h3>
              <p className="text-muted-foreground leading-relaxed">
                Local councils, schools, health services, and other organisations working together 
                to strengthen community capacity and wellbeing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Learn More?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our programs, see our impact, or get in touch to connect with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/programs" variant="primary" size="lg">
              View Programs
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
