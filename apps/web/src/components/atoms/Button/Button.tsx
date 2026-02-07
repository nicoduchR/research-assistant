import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      loading = false,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-sm rounded-md font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover active:shadow-medium',
      secondary:
        'bg-white text-primary border-2 border-primary hover:bg-primary/5 active:bg-primary/10',
      destructive:
        'bg-error text-white shadow-subtle hover:bg-error/90 active:shadow-medium',
      icon: 'bg-transparent text-text-primary hover:bg-muted active:bg-muted/80',
    };

    const sizeStyles = {
      sm: variant === 'icon' ? 'p-xs' : 'px-sm py-xs text-small',
      md: variant === 'icon' ? 'p-sm' : 'px-md py-sm text-body',
      lg: variant === 'icon' ? 'p-md' : 'px-lg py-md text-body',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children && <span>Loading...</span>}
          </>
        ) : (
          <>
            {icon && <span className="inline-flex items-center">{icon}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
