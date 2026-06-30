import React from 'react';
import { SectionHeader } from 'marrahub-website';

const wrap: React.CSSProperties = { padding: 32, maxWidth: 800, margin: '0 auto' };

export const Centered = () => (
  <div style={wrap}>
    <SectionHeader
      subtitle="What we do"
      title="Programs that bring people together"
      description="From youth mentoring to newcomer support, our programs are built around the real needs of the Glen Eira community."
    />
  </div>
);

export const LeftAligned = () => (
  <div style={wrap}>
    <SectionHeader
      align="left"
      subtitle="Our story"
      title="Rooted in community"
      description="MARRA began as a small group of neighbours and has grown into a hub for connection and care."
    />
  </div>
);

export const TitleOnly = () => (
  <div style={wrap}>
    <SectionHeader title="Get in touch" />
  </div>
);
