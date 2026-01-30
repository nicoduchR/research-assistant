import React from 'react';
import { StatusLabel } from '../../molecules/StatusLabel';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

export interface ThemeCardData {
  title: string;
  relevance: number;
  consensus?: {
    label: string;
    description: string;
  };
  conflicts?: {
    label: string;
    description: string;
  };
  citations: number;
  authors?: string[];
  id?: string;
}

export interface ThemeCardProps {
  theme: ThemeCardData;
  onViewDetails?: (id?: string) => void;
  onExport?: (id?: string) => void;
  className?: string;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onViewDetails,
  onExport,
  className = '',
}) => {
  const getRelevanceBadge = (score: number) => {
    if (score >= 80) return { variant: 'success' as const, label: 'High' };
    if (score >= 50) return { variant: 'warning' as const, label: 'Medium' };
    return { variant: 'neutral' as const, label: 'Low' };
  };

  const relevanceBadge = getRelevanceBadge(theme.relevance);

  return (
    <article
      className={`bg-white border border-border rounded-lg shadow-subtle hover:shadow-medium transition-shadow duration-fast ${className}`}
      role="article"
      aria-label={`Research theme: ${theme.title}`}
    >
      {/* Header */}
      <div className="p-lg border-b border-border">
        <div className="flex items-start justify-between gap-md mb-sm">
          <h3 className="text-h6 font-bold text-text-primary flex-1">
            {theme.title}
          </h3>
          <Badge variant={relevanceBadge.variant} size="md">
            {relevanceBadge.label}
          </Badge>
        </div>
        <div className="flex items-center gap-xs text-small text-text-neutral">
          <span>Relevance Score:</span>
          <span className="font-semibold text-text-primary">
            {theme.relevance}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-lg space-y-md">
        {/* Consensus Section */}
        {theme.consensus && (
          <div>
            <StatusLabel
              type="consensus"
              title={theme.consensus.label}
              className="mb-sm"
            >
              <p className="text-body text-text-neutral">
                {theme.consensus.description}
              </p>
            </StatusLabel>
          </div>
        )}

        {/* Conflicts Section */}
        {theme.conflicts && (
          <div>
            <StatusLabel
              type="conflict"
              title={theme.conflicts.label}
              className="mb-sm"
            >
              <p className="text-body text-text-neutral">
                {theme.conflicts.description}
              </p>
            </StatusLabel>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-lg border-t border-border">
        <div className="flex items-center justify-between mb-md">
          {/* Authors */}
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-text-neutral text-lg">
              groups
            </span>
            <span className="text-small text-text-neutral">
              {theme.authors && theme.authors.length > 0 ? (
                <>
                  <span className="font-medium text-text-primary">
                    {theme.authors[0]}
                  </span>
                  {theme.authors.length > 1 && (
                    <span> +{theme.authors.length - 1} others</span>
                  )}
                </>
              ) : (
                'No authors listed'
              )}
            </span>
          </div>

          {/* Citations */}
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-text-neutral text-lg">
              format_quote
            </span>
            <Badge variant="neutral" size="sm">
              {theme.citations}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-sm">
          <Button
            variant="primary"
            size="md"
            onClick={() => onViewDetails?.(theme.id)}
            className="flex-1"
            icon={<span className="material-symbols-outlined">visibility</span>}
          >
            View Details
          </Button>
          <Button
            variant="icon"
            size="md"
            onClick={() => onExport?.(theme.id)}
            aria-label="Export theme"
            icon={<span className="material-symbols-outlined">download</span>}
          />
        </div>
      </div>
    </article>
  );
};

ThemeCard.displayName = 'ThemeCard';
