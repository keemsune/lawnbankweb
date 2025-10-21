import React from 'react';

type ShadowVariant = 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl';
type ShadowColorVariant = 'default' | 'emerald' | 'indigo' | 'violet' | 'pink' | 'red' | 'amber';

interface ShadowProps {
  variant?: ShadowVariant;
  colorVariant?: ShadowColorVariant;
  children: React.ReactNode;
  className?: string;
}

const shadowStyles: Record<ShadowVariant, string> = {
  sm: 'shadow-sm-custom',
  default: 'shadow-custom',
  md: 'shadow-md-custom',
  lg: 'shadow-lg-custom',
  xl: 'shadow-xl-custom',
  '2xl': 'shadow-2xl-custom',
};

const colorShadowStyles: Record<ShadowColorVariant, string> = {
  default: '',
  emerald: 'shadow-emerald-600',
  indigo: 'shadow-indigo-600',
  violet: 'shadow-violet-600',
  pink: 'shadow-pink-500',
  red: 'shadow-red-500',
  amber: 'shadow-amber-500',
};

export const Shadow: React.FC<ShadowProps> = ({ 
  variant = 'default', 
  colorVariant = 'default',
  children, 
  className = '' 
}) => {
  const shadowClass = colorVariant === 'default' ? shadowStyles[variant] : colorShadowStyles[colorVariant];
  
  return (
    <div className={`${shadowClass} ${className}`}>
      {children}
    </div>
  );
}; 