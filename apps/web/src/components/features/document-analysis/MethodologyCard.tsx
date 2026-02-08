'use client';

import React from 'react';
import type { MethodologyAnalysis } from '@repo/types';
import { Badge } from '@/src/components/atoms/Badge';
import { cn } from '@/src/lib/utils';

interface MethodologyCardProps {
  methodology: MethodologyAnalysis;
  className?: string;
}

export const MethodologyCard: React.FC<MethodologyCardProps> = ({
  methodology,
  className = '',
}) => {
  return (
    <div className={cn('space-y-md', className)}>
      <div className="flex items-center gap-sm">
        <Badge variant="primary" size="sm">{methodology.type}</Badge>
      </div>

      <p className="text-body text-text-secondary">{methodology.description}</p>

      {methodology.strengths.length > 0 && (
        <div>
          <h4 className="text-small font-medium text-success mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Forces
          </h4>
          <ul className="space-y-xs">
            {methodology.strengths.map((strength, i) => (
              <li key={i} className="text-small text-text-secondary pl-md">
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {methodology.limitations.length > 0 && (
        <div>
          <h4 className="text-small font-medium text-warning mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">warning</span>
            Limites
          </h4>
          <ul className="space-y-xs">
            {methodology.limitations.map((limitation, i) => (
              <li key={i} className="text-small text-text-secondary pl-md">
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

MethodologyCard.displayName = 'MethodologyCard';
