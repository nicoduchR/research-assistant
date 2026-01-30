import React from 'react';

export interface ProgressIndicatorProps {
  label: string;
  percentage: number;
  status?: 'default' | 'success' | 'error' | 'processing';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  label,
  percentage,
  status = 'default',
  showPercentage = true,
  className = '',
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const statusColors = {
    default: 'bg-primary',
    success: 'bg-success',
    error: 'bg-error',
    processing: 'bg-processing',
  };

  const barColor = statusColors[status];

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clampedPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {/* Label and Percentage */}
      <div className="flex items-center justify-between mb-sm">
        <span className="text-body text-text-primary font-medium">{label}</span>
        {showPercentage && (
          <span className="text-small text-text-secondary font-medium">
            {Math.round(clampedPercentage)}%
          </span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        {/* Progress Bar Fill */}
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-standard ease-out-custom`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressIndicator.displayName = 'ProgressIndicator';
