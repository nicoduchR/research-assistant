import React from 'react';

export interface StatusLabelProps {
  type: 'consensus' | 'conflict' | 'info' | 'warning';
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({
  type,
  title,
  children,
  className = '',
}) => {
  const typeConfig = {
    consensus: {
      borderColor: 'border-l-success',
      bgColor: 'bg-success/5',
      textColor: 'text-success',
      icon: 'verified',
    },
    conflict: {
      borderColor: 'border-l-warning',
      bgColor: 'bg-warning/5',
      textColor: 'text-warning',
      icon: 'warning',
    },
    info: {
      borderColor: 'border-l-primary',
      bgColor: 'bg-primary/5',
      textColor: 'text-primary',
      icon: 'info',
    },
    warning: {
      borderColor: 'border-l-error',
      bgColor: 'bg-error/5',
      textColor: 'text-error',
      icon: 'error',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`border-l-4 ${config.borderColor} ${config.bgColor} p-md rounded-md ${className}`}
      role="status"
      aria-label={`${type} status`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-sm mb-xs">
        <span className={`material-symbols-outlined ${config.textColor}`}>
          {config.icon}
        </span>
        <h4 className={`text-body font-semibold ${config.textColor}`}>
          {title}
        </h4>
      </div>

      {/* Content */}
      {children && (
        <div className="text-small text-text-primary ml-8">
          {children}
        </div>
      )}
    </div>
  );
};

StatusLabel.displayName = 'StatusLabel';
