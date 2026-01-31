import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    const baseStyles =
      'w-full rounded-md border border-border bg-white text-text-primary text-body transition-all duration-fast placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted py-sm px-md resize-vertical';

    const errorStyles = error
      ? 'border-error focus:ring-error focus:border-error'
      : '';

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
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

Textarea.displayName = 'Textarea';
