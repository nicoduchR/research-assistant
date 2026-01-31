import React from 'react';
import { Button, ButtonProps } from '@/src/components/atoms/Button';

export type SecondaryButtonProps = Omit<ButtonProps, 'variant'>;

/**
 * SecondaryButton - Secondary action button
 *
 * @example
 * ```tsx
 * <SecondaryButton onClick={handleCancel}>
 *   Cancel
 * </SecondaryButton>
 * ```
 */
export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="secondary" {...props} />;
  }
);

SecondaryButton.displayName = 'SecondaryButton';
