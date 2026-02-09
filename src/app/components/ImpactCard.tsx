import React from 'react';

interface ImpactCardProps {
  number: string;
  label: string;
  description: string;
}

export function ImpactCard({ number, label, description }: ImpactCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center border border-primary/5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="text-5xl font-serif font-bold text-primary mb-4 tabular-nums transition-transform group-hover:scale-110 duration-500">
        {number}
      </div>
      <div className="h-0.5 w-12 bg-secondary/30 mx-auto mb-4 group-hover:w-20 transition-all duration-500"></div>
      <div className="text-lg font-semibold text-foreground mb-2 px-2">{label}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
