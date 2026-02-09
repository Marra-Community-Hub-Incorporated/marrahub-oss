import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { Shield, FileText, Users, Eye, Heart, CheckCircle } from 'lucide-react';

export function Governance() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Governance & Transparency</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              MARRA operates with complete transparency, strong governance, and unwavering 
              commitment to ethical practices and accountability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organisational Structure */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            subtitle="How We're Structured"
            title="Organisational Governance"
            description="Independent oversight and ethical leadership guide all our work."
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Board of Directors</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Independent board with diverse expertise in community services, governance, 
                    finance, and public health.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Quarterly board meetings with published minutes
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Annual general meetings open to the community
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Skills-based recruitment ensuring diverse perspectives
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
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Constitution & Bylaws</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Clear governing documents outlining our purpose, decision-making processes, 
                    and accountability mechanisms.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Registered non-profit organisation
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Publicly available governing documents
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Regular constitutional reviews and updates
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
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Financial Oversight</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Rigorous financial management with independent auditing and transparent 
                    reporting to stakeholders.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Annual independent financial audits
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Quarterly financial reports to the board
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Public annual reports including financial statements
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
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Quality & Compliance</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Adherence to all relevant standards, regulations, and best practice frameworks 
                    for community services.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Regular compliance audits and reviews
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Staff training on standards and regulations
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Continuous quality improvement processes
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safeguarding */}
      <section id="safeguarding" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Safeguarding & Protection"
            description="The safety and wellbeing of community members is our highest priority."
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Child Safety</h3>
                  <p className="text-muted-foreground">
                    Comprehensive child protection policies and procedures aligned with Victorian 
                    Child Safe Standards.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Working with Children Checks for all staff and volunteers
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Mandatory child safety training and ongoing education
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Clear reporting procedures for concerns or disclosures
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Child-friendly complaint mechanisms
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Regular policy reviews and risk assessments
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Vulnerable Adults</h3>
                  <p className="text-muted-foreground">
                    Safeguarding policies for adults at risk, including those with disabilities or 
                    experiencing vulnerability.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Staff training on recognizing and responding to abuse
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Person-centered risk assessment and support planning
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Partnership with relevant authorities and services
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Confidential reporting and investigation procedures
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Advocacy and support for vulnerable community members
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ethical Commitments */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Our Ethical Commitments"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Privacy & Confidentiality</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Strict privacy policies protecting personal information, with clear consent processes 
                and secure data management.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• GDPR and Privacy Act compliance</li>
                <li>• Secure data storage and handling</li>
                <li>• Transparent privacy practices</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Cultural Safety</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Commitment to cultural respect, particularly for Aboriginal and Torres Strait Islander 
                peoples and diverse communities.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Cultural awareness training for staff</li>
                <li>• Culturally appropriate services</li>
                <li>• Indigenous consultation and partnership</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Inclusion & Accessibility</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Design and delivery of services ensuring equal access for people of all abilities, 
                backgrounds, and circumstances.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Physical accessibility standards</li>
                <li>• Communication accessibility</li>
                <li>• Reasonable adjustments policy</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Anti-Discrimination</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Zero tolerance for discrimination, harassment, or bias based on any protected 
                characteristic.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Equal opportunity policies</li>
                <li>• Staff code of conduct</li>
                <li>• Complaint and resolution processes</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Conflict of Interest</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Clear policies managing potential conflicts of interest for board members, staff, 
                and volunteers.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Declaration registers maintained</li>
                <li>• Transparent decision-making</li>
                <li>• Independent oversight</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-background rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3">Environmental Responsibility</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Commitment to sustainable practices minimizing environmental impact and promoting 
                ecological awareness.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Sustainable operations policy</li>
                <li>• Waste reduction initiatives</li>
                <li>• Community environmental education</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section id="accountability" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Accountability & Reporting"
            description="We maintain transparency through regular reporting to community, funders, and regulators."
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-4">Community Reporting</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Annual reports published and distributed to stakeholders
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Quarterly community newsletters with program updates
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Open community forums for feedback and dialogue
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Accessible feedback mechanisms including surveys and suggestion boxes
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-4">Regulatory Compliance</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Registered with Australian Charities and Not-for-profits Commission (ACNC)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Compliance with all Victorian community service standards
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Regular reporting to funding bodies and government departments
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Adherence to workplace health and safety regulations
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-4">Complaints & Feedback</h3>
              <p className="text-muted-foreground mb-4">
                We welcome feedback and take all complaints seriously. Our complaints process is:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Accessible and clearly communicated to all community members
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Confidential and respectful of complainants
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Timely with acknowledged receipt within 2 business days
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Fair and impartial with independent oversight where appropriate
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Questions About Our Governance?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're committed to transparency and happy to discuss our governance structures, 
            policies, and practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:governance@marra.org.au"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              Contact Governance Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
