import React from 'react';
import { Textarea, TextareaProps } from '@/src/components/atoms/Textarea';

export interface TextareaWithCounterProps extends TextareaProps {
  maxLength?: number;
  minLength?: number;
  showCounter?: boolean;
}

export const TextareaWithCounter = React.forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({ maxLength, minLength, showCounter = false, className = '', value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;
    const showMinWarning = minLength && currentLength > 0 && currentLength < minLength;
    const showMaxWarning = maxLength && currentLength > maxLength;

    return (
      <div className="w-full">
        <Textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={className}
          {...props}
        />
        {showCounter && (
          <div className="mt-1 flex justify-between items-center text-sm">
            <div className="text-text-secondary">
              {showMinWarning && minLength && (
                <span className="text-orange-500">
                  Minimum {minLength} characters required ({minLength - currentLength} remaining)
                </span>
              )}
              {showMaxWarning && maxLength && (
                <span className="text-error">
                  Maximum {maxLength} characters exceeded
                </span>
              )}
            </div>
            <div className={`text-text-secondary ${showMaxWarning ? 'text-error font-medium' : ''}`}>
              {currentLength}
              {maxLength && ` / ${maxLength}`}
            </div>
          </div>
        )}
      </div>
    );
  }
);

TextareaWithCounter.displayName = 'TextareaWithCounter';
