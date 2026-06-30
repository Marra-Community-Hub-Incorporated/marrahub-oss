import React from 'react';
import { Button } from 'marrahub-website';

const row: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', padding: 24 };

export const Primary = () => (
  <div style={row}><Button variant="primary">Get involved</Button></div>
);

export const Secondary = () => (
  <div style={row}><Button variant="secondary">Donate today</Button></div>
);

export const Outline = () => (
  <div style={row}><Button variant="outline">Learn more</Button></div>
);

export const Sizes = () => (
  <div style={row}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const AsLink = () => (
  <div style={row}>
    <Button href="/programs">Browse programs</Button>
    <Button href="https://marrahub.com.au" variant="outline">Visit main site</Button>
  </div>
);

export const Disabled = () => (
  <div style={row}><Button disabled>Registrations closed</Button></div>
);
