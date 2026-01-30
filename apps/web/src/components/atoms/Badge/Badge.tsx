import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'processing';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-fast';

  const variantStyles = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error: 'bg-error/10 text-error border border-error/20',
    processing: 'bg-processing/10 text-processing border border-processing/20',
    neutral: 'bg-muted text-text-secondary border border-border',
  };

  const sizeStyles = {
    sm: 'px-sm py-xs text-small',
    md: 'px-md py-sm text-body',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      role="status"
      aria-label={`${variant} badge`}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
