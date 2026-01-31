import React from 'react';
import { Button, ButtonProps } from '@/src/components/atoms/Button';

export interface IconButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
  icon: React.ReactNode;
  ariaLabel: string;
}

/**
 * IconButton - Icon-only action button
 *
 * IMPORTANT: Must always have ariaLabel for accessibility
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<span className="material-symbols-outlined">delete</span>}
 *   ariaLabel="Delete document"
 *   onClick={handleDelete}
 * />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="icon"
        icon={icon}
        aria-label={ariaLabel}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';
