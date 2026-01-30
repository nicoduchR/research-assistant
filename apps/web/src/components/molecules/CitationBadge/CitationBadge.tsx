import React from 'react';

export interface CitationBadgeProps {
  author: string;
  year: string | number;
  page?: string | number;
  onClick?: () => void;
  className?: string;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({
  author,
  year,
  page,
  onClick,
  className = '',
}) => {
  const citationText = page
    ? `${author}, ${year}, p.${page}`
    : `${author}, ${year}`;

  const baseStyles =
    'inline-flex items-center gap-xs px-md py-xs rounded-md text-citation font-medium transition-all duration-fast border';

  const interactiveStyles = onClick
    ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/30 cursor-pointer active:bg-primary/15'
    : 'bg-muted text-text-secondary border-border';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <span
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Citation: ${citationText}`}
    >
      <span>{citationText}</span>

      {onClick && (
        <span className="material-symbols-outlined text-sm">link</span>
      )}
    </span>
  );
};

CitationBadge.displayName = 'CitationBadge';
