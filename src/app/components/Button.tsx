import React from 'react';
import { Link } from 'react-router';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl transition-all duration-300 font-medium active:scale-95 hover:scale-[1.02] active:duration-75';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20',
    outline: 'border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5'
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  if (href) {
    if (href.startsWith('http')) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
