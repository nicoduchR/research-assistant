import React from 'react';
import { Button } from '@/src/components/atoms/Button';
import { cn } from '@/src/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-xxl px-lg',
        className
      )}
      role="status"
      aria-label="Empty state"
    >
      {icon && (
        <div className="mb-lg text-text-secondary opacity-60">
          {icon}
        </div>
      )}

      <h3 className="text-h3 font-semibold text-text-primary mb-sm">
        {title}
      </h3>

      {description && (
        <p className="text-body text-text-secondary max-w-md mb-lg">
          {description}
        </p>
      )}

      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
