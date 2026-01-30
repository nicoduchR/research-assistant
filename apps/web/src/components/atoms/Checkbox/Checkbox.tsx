import React, { useEffect, useRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      indeterminate = false,
      onChange,
      label,
      disabled = false,
      error,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, checkboxRef]);

    const baseStyles =
      'w-5 h-5 rounded border-2 border-border bg-white text-primary transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const checkedStyles = checked || indeterminate
      ? 'bg-primary border-primary'
      : 'bg-white hover:border-primary/50';

    const errorStyles = error
      ? 'border-error focus:ring-error'
      : '';

    return (
      <div className="flex items-start gap-sm">
        <div className="relative flex items-center">
          <input
            ref={checkboxRef}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`${baseStyles} ${checkedStyles} ${errorStyles} ${className}`}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          {checked && !indeterminate && (
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {indeterminate && (
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 12h12"
              />
            </svg>
          )}
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={`text-body text-text-primary cursor-pointer select-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {label}
          </label>
        )}
        {error && (
          <p
            id={`${checkboxId}-error`}
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

Checkbox.displayName = 'Checkbox';
