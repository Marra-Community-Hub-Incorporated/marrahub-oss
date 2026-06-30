import React from 'react';
import { ProgramCard } from 'marrahub-website';
import { Sprout, BookOpen } from 'lucide-react';

const cell: React.CSSProperties = { padding: 24, maxWidth: 380 };

export const Basic = () => (
  <div style={cell}>
    <ProgramCard
      icon={Sprout}
      title="Community Garden"
      description="A shared green space where neighbours grow food, swap skills and put down roots together."
    />
  </div>
);

export const WithOutcomes = () => (
  <div style={cell}>
    <ProgramCard
      icon={BookOpen}
      title="Homework Club"
      description="Free after-school tutoring and mentoring for primary and secondary students."
      outcomes={['Improved literacy and numeracy', 'A safe place to study', 'One-on-one mentor support']}
    />
  </div>
);
