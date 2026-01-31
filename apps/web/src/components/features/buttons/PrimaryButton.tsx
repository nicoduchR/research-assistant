import React from 'react';
import { Button, ButtonProps } from '@/src/components/atoms/Button';

export type PrimaryButtonProps = Omit<ButtonProps, 'variant'>;

/**
 * PrimaryButton - High contrast CTA button
 *
 * @example
 * ```tsx
 * <PrimaryButton onClick={handleSubmit} loading={isLoading}>
 *   Generate Literature Review
 * </PrimaryButton>
 * ```
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="primary" {...props} />;
  }
);

PrimaryButton.displayName = 'PrimaryButton';
