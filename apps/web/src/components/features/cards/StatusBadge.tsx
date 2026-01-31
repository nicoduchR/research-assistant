import React from 'react';
import { Badge, BadgeProps } from '@/src/components/atoms/Badge';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'failed';

export interface StatusBadgeProps {
  status: ProcessingStatus;
  text?: string;
  className?: string;
}

/**
 * StatusBadge - Status indicator with color coding
 *
 * @example
 * ```tsx
 * <StatusBadge status="processing" text="Processing..." />
 * <StatusBadge status="completed" />
 * <StatusBadge status="failed" text="Failed" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  className = '',
}) => {
  const statusConfig: Record<ProcessingStatus, { variant: BadgeProps['variant']; label: string; icon?: string }> = {
    idle: {
      variant: 'neutral',
      label: 'Idle',
      icon: 'radio_button_unchecked',
    },
    processing: {
      variant: 'neutral',
      label: 'Processing',
      icon: 'sync',
    },
    completed: {
      variant: 'success',
      label: 'Completed',
      icon: 'check_circle',
    },
    failed: {
      variant: 'error',
      label: 'Failed',
      icon: 'error',
    },
  };

  const config = statusConfig[status];
  const displayText = text || config.label;

  return (
    <Badge variant={config.variant} className={className}>
      <div className="flex items-center gap-xs">
        {config.icon && (
          <span className="material-symbols-outlined text-sm">
            {config.icon}
          </span>
        )}
        <span>{displayText}</span>
      </div>
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';
