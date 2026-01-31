import React from 'react';
import { Spinner } from '@/src/components/atoms/Spinner';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * LoadingSpinner - Async operation feedback component
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" text="Loading documents..." />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  return <Spinner {...props} />;
};

LoadingSpinner.displayName = 'LoadingSpinner';
