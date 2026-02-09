import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  outcomes?: string[];
}

export function ProgramCard({ icon: Icon, title, description, outcomes }: ProgramCardProps) {
  return (
    <div className="group bg-card rounded-2xl p-8 border border-primary/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
      
      <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <Icon size={32} className="text-primary group-hover:text-white transition-colors" />
      </div>
      
      <h3 className="text-2xl font-serif font-semibold text-primary mb-4 leading-tight">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed font-sans">
        {description}
      </p>
      
      {outcomes && outcomes.length > 0 && (
        <div className="pt-6 border-t border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Expected Outcomes</p>
          <ul className="space-y-2">
            {outcomes.map((outcome, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3"></div>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
