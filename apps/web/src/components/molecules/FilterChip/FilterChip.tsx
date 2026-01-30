import React from 'react';
import { Button } from '../../atoms/Button/Button';

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active = false,
  onRemove,
  onClick,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center gap-xs px-md py-sm rounded-full text-small font-medium transition-all duration-fast border';

  const activeStyles = active
    ? 'bg-primary/10 text-primary border-primary/20'
    : 'bg-white text-text-secondary border-border hover:border-primary/30';

  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const handleClick = () => {
    if (onClick && !onRemove) {
      onClick();
    }
  };

  return (
    <span
      className={`${baseStyles} ${activeStyles} ${clickableStyles} ${className}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${active ? 'Active' : 'Inactive'} filter: ${label}`}
    >
      <span>{label}</span>

      {onRemove && (
        <Button
          variant="icon"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0 h-4 w-4 hover:bg-transparent"
          icon={
            <span className="material-symbols-outlined text-base">close</span>
          }
          aria-label={`Remove ${label} filter`}
        />
      )}
    </span>
  );
};

FilterChip.displayName = 'FilterChip';
