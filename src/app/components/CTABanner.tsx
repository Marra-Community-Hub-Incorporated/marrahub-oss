import React from 'react';
import { Button } from './Button';

interface CTABannerProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  variant?: 'default' | 'muted';
}

export function CTABanner({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  variant = 'default'
}: CTABannerProps) {
  return (
    <div className={`rounded-3xl p-12 md:p-16 relative overflow-hidden shadow-2xl shadow-primary/10 border border-primary/5 ${
      variant === 'default' 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-white text-foreground'
    }`}>
      {/* Decorative Gradient Glow */}
      {variant === 'default' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent rounded-full blur-[100px]"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className={`font-serif text-3xl md:text-5xl mb-6 ${
          variant === 'default' ? 'text-white' : 'text-primary'
        }`}>
          {title}
        </h2>
        <p className={`text-lg md:text-xl mb-10 font-sans leading-relaxed ${
          variant === 'default' ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            href={primaryButtonHref}
            variant={variant === 'default' ? 'secondary' : 'primary'}
            size="lg"
            className="w-full sm:w-auto shadow-xl shadow-black/10"
          >
            {primaryButtonText}
          </Button>
          {secondaryButtonText && secondaryButtonHref && (
            <Button 
              href={secondaryButtonHref}
              variant="outline"
              size="lg"
              className={`w-full sm:w-auto ${
                variant === 'default' 
                  ? 'border-white/40 text-white hover:bg-white/10' 
                  : 'border-primary/20 text-primary hover:bg-primary/5'
              }`}
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
