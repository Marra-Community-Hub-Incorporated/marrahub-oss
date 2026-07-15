import React from 'react';

interface AuroraBackgroundProps {
  /** Extra classes on the wrapper (e.g. opacity/masking for a subtler instance). */
  className?: string;
}

// Ambient, slowly drifting colour wash in the Marra palette — a nod to the
// "digital community centre" identity. Purely decorative and aria-hidden; the
// drift is CSS-driven and stops entirely under prefers-reduced-motion (see
// styles/index.css). Blobs echo the sibling Marra Hub portal's gold→clay "sun".
export function AuroraBackground({ className = '' }: AuroraBackgroundProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Golden sand → clay "sun" */}
      <div
        className="marra-aurora__blob marra-aurora__blob--1"
        style={{
          top: '-18%',
          left: '-8%',
          width: '55%',
          height: '55%',
          background:
            'radial-gradient(circle at 35% 35%, rgba(240,194,122,0.55), rgba(224,160,95,0.28) 45%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Terracotta */}
      <div
        className="marra-aurora__blob marra-aurora__blob--2"
        style={{
          top: '-12%',
          right: '-12%',
          width: '52%',
          height: '52%',
          background: 'radial-gradient(circle at 60% 40%, rgba(176,94,69,0.40), transparent 68%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Deep teal grounding glow */}
      <div
        className="marra-aurora__blob marra-aurora__blob--3"
        style={{
          bottom: '-22%',
          left: '22%',
          width: '58%',
          height: '58%',
          background: 'radial-gradient(circle at 50% 50%, rgba(30,69,58,0.32), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}
