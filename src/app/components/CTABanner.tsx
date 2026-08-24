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
      {/* Decorative layers: cultural weave pattern + gradient glows */}
      {variant === 'default' && (
        <>
          <div className="absolute inset-0 bg-cultural-fusion pointer-events-none" aria-hidden="true"></div>
          <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-accent/60 rounded-full blur-[130px]"></div>
          </div>
          <div
            className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none"
            aria-hidden="true"
          ></div>
          {/* Corner flourishes echoing the decorative frames used on the home page */}
          <div
            className="absolute top-6 left-6 w-14 h-14 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl pointer-events-none"
            aria-hidden="true"
          ></div>
          <div
            className="absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 border-accent/30 rounded-br-2xl pointer-events-none"
            aria-hidden="true"
          ></div>
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          className={`h-1 w-16 mx-auto mb-8 rounded-full ${
            variant === 'default' ? 'bg-accent/70' : 'bg-secondary/30'
          }`}
          aria-hidden="true"
        ></div>
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
