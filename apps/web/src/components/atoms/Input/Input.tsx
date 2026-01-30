import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  type?: 'text' | 'search' | 'email' | 'password' | 'number' | 'url' | 'tel';
  variant?: 'input' | 'textarea';
  placeholder?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      type = 'text',
      variant = 'input',
      placeholder,
      icon,
      iconPosition = 'left',
      error,
      disabled = false,
      className = '',
      rows = 3,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-md border border-border bg-white text-text-primary text-body transition-all duration-fast placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted';

    const inputStyles = variant === 'textarea' ? 'py-sm px-md resize-vertical' : 'py-sm px-md';

    const errorStyles = error
      ? 'border-error focus:ring-error focus:border-error'
      : '';

    const withIconStyles = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    const InputElement = variant === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="relative w-full">
        {icon && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none ${
              iconPosition === 'left' ? 'left-md' : 'right-md'
            }`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <InputElement
          ref={ref as any}
          type={variant === 'input' ? type : undefined}
          placeholder={placeholder}
          disabled={disabled}
          rows={variant === 'textarea' ? rows : undefined}
          className={`${baseStyles} ${inputStyles} ${withIconStyles} ${errorStyles} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...(props as any)}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-xs text-small text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
