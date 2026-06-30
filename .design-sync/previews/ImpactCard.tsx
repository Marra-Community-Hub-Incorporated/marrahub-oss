import React from 'react';
import { ImpactCard } from 'marrahub-website';
import { Heart, Users } from 'lucide-react';

const cell: React.CSSProperties = { padding: 24, maxWidth: 320 };

export const Stat = () => (
  <div style={cell}>
    <ImpactCard
      number="500+"
      label="Community members"
      description="Local residents connected through MARRA programs each year."
    />
  </div>
);

export const WithIcon = () => (
  <div style={cell}>
    <ImpactCard
      icon={Heart}
      label="Meals shared"
      description="Free, warm community meals served to those who need them most."
    />
  </div>
);

export const Volunteers = () => (
  <div style={cell}>
    <ImpactCard
      icon={Users}
      number="120"
      label="Active volunteers"
      description="Giving their time across our programs and events every month."
    />
  </div>
);
