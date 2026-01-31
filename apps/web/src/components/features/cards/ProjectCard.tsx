import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/atoms/Card';
import { Badge } from '@/src/components/atoms/Badge';
import { cn, formatDate } from '@/src/lib/utils';

export interface ProjectCardProps {
  title: string;
  description?: string;
  createdAt: Date | string;
  status?: 'active' | 'archived' | 'draft';
  documentCount?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * ProjectCard - Project/scope display card
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   title="Climate Change Literature Review"
 *   description="Systematic review of climate adaptation strategies"
 *   createdAt={new Date()}
 *   status="active"
 *   documentCount={12}
 *   onClick={handleProjectClick}
 * />
 * ```
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  createdAt,
  status = 'active',
  documentCount,
  onClick,
  className = '',
}) => {
  const statusVariant = {
    active: 'success' as const,
    draft: 'neutral' as const,
    archived: 'neutral' as const,
  };

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-medium transition-all duration-fast',
        'hover:border-primary/30',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Project: ${title}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-sm">
          <CardTitle className="flex-1 line-clamp-2">{title}</CardTitle>
          <Badge variant={statusVariant[status]} size="sm">
            {status}
          </Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-2 mt-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-md text-small text-text-secondary">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          {documentCount !== undefined && (
            <>
              <span className="text-border">•</span>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-lg">description</span>
                <span>{documentCount} {documentCount === 1 ? 'document' : 'documents'}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

ProjectCard.displayName = 'ProjectCard';
