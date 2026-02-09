import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  align = 'center' 
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <p className="text-secondary font-bold mb-4 uppercase tracking-[0.2em] text-xs">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6 leading-tight">
        {title}
      </h2>
      {description && (
        <p className={`text-xl text-muted-foreground leading-relaxed font-sans ${
          align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'
        }`}>
          {description}
        </p>
      )}
      {align === 'center' && (
        <div className="h-1 w-20 bg-secondary/20 mx-auto mt-8 rounded-full"></div>
      )}
    </div>
  );
}
