import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  value: string;
  name: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      onChange,
      label,
      disabled = false,
      error,
      className = '',
      id,
      value,
      name,
      ...props
    },
    ref
  ) => {
    const radioId = id || `radio-${value}-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      'w-5 h-5 rounded-full border-2 border-border bg-white transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const checkedStyles = checked
      ? 'border-primary'
      : 'bg-white hover:border-primary/50';

    const errorStyles = error
      ? 'border-error focus:ring-error'
      : '';

    return (
      <div className="flex items-start gap-sm">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`${baseStyles} ${checkedStyles} ${errorStyles} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${radioId}-error` : undefined}
            {...props}
          />
          {checked && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
        {label && (
          <label
            htmlFor={radioId}
            className={`text-body text-text-primary cursor-pointer select-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {label}
          </label>
        )}
        {error && (
          <p
            id={`${radioId}-error`}
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

Radio.displayName = 'Radio';
