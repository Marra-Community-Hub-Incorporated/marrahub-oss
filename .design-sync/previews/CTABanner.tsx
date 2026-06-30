import React from 'react';
import { CTABanner } from 'marrahub-website';

const wrap: React.CSSProperties = { padding: 24, maxWidth: 960, margin: '0 auto' };

export const Default = () => (
  <div style={wrap}>
    <CTABanner
      title="Be part of something bigger"
      description="Join a growing community of volunteers, neighbours and friends making Glen Eira a more connected place."
      primaryButtonText="Get involved"
      primaryButtonHref="/contact"
    />
  </div>
);

export const WithSecondaryAction = () => (
  <div style={wrap}>
    <CTABanner
      title="Support our programs"
      description="Your donation funds free community meals, youth mentoring and newcomer support across the city."
      primaryButtonText="Donate today"
      primaryButtonHref="/contact"
      secondaryButtonText="See our impact"
      secondaryButtonHref="/impact"
    />
  </div>
);

export const Muted = () => (
  <div style={wrap}>
    <CTABanner
      variant="muted"
      title="Volunteer with MARRA"
      description="A few hours a month makes a real difference. We'll match you with a program that fits your skills."
      primaryButtonText="Sign up"
      primaryButtonHref="/contact"
      secondaryButtonText="Learn more"
      secondaryButtonHref="/about"
    />
  </div>
);
