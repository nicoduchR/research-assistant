'use client';

import React from 'react';
import type { RelevanceAssessment } from '@repo/types';
import { cn } from '@/src/lib/utils';

interface RelevanceBadgeProps {
  relevance: RelevanceAssessment;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 7) return 'text-success bg-success/10 border-success/20';
  if (score >= 4) return 'text-warning bg-warning/10 border-warning/20';
  return 'text-error bg-error/10 border-error/20';
}

function getRecommendationLabel(rec: string): string {
  switch (rec) {
    case 'keep': return 'Conserver';
    case 'maybe': return 'A evaluer';
    case 'skip': return 'Ignorer';
    default: return rec;
  }
}

function getRecommendationColor(rec: string): string {
  switch (rec) {
    case 'keep': return 'text-success';
    case 'maybe': return 'text-warning';
    case 'skip': return 'text-error';
    default: return 'text-text-secondary';
  }
}

export const RelevanceBadge: React.FC<RelevanceBadgeProps> = ({
  relevance,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center gap-md', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center w-12 h-12 rounded-lg border text-xl font-bold',
          getScoreColor(relevance.score),
        )}
      >
        {relevance.score}
      </div>
      <div>
        <span className="text-small text-text-secondary">/10</span>
        <span className={cn('ml-md text-body font-medium', getRecommendationColor(relevance.recommendation))}>
          {getRecommendationLabel(relevance.recommendation)}
        </span>
      </div>
    </div>
  );
};

RelevanceBadge.displayName = 'RelevanceBadge';
