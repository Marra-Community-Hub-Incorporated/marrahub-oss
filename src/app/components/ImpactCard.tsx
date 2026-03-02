import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ImpactCardProps {
  number: string;
  label: string;
  description: string;
  icon?: LucideIcon;
}

export function ImpactCard({ number, label, description, icon: Icon }: ImpactCardProps) {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-8 text-center border border-primary/5 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col items-center">
      {Icon ? (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 duration-500">
          <Icon size={32} />
        </div>
      ) : (
        <div className="text-5xl font-serif font-bold text-primary mb-4 tabular-nums transition-transform group-hover:scale-110 duration-500">
          {number}
        </div>
      )}
      <div className="h-0.5 w-12 bg-secondary/30 mx-auto mb-4 group-hover:w-20 transition-all duration-500"></div>
      <div className="text-lg font-semibold text-foreground mb-2 px-2 text-center w-full leading-tight">{label}</div>
      <p className="text-sm text-muted-foreground leading-relaxed mt-auto text-justify [text-align-last:center] w-full">{description}</p>
    </div>
  );
}
