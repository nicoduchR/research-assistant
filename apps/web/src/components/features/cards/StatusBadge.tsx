import React from 'react';
import { Badge, BadgeProps } from '@/src/components/atoms/Badge';

// Aligned with Document type status field
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'error';

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
 * <StatusBadge status="error" text="Upload failed" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  className = '',
}) => {
  const statusConfig: Record<ProcessingStatus, { variant: BadgeProps['variant']; label: string; icon?: string }> = {
    pending: {
      variant: 'neutral',
      label: 'Pending',
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
    error: {
      variant: 'error',
      label: 'Error',
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
