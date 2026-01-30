import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      disabled = false,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-md border border-border bg-white text-text-primary text-body py-sm px-md pr-10 transition-all duration-fast appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted cursor-pointer';

    const errorStyles = error
      ? 'border-error focus:ring-error focus:border-error'
      : '';

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseStyles} ${errorStyles} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div
          className="absolute top-1/2 right-md -translate-y-1/2 pointer-events-none text-text-secondary"
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
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

Select.displayName = 'Select';
