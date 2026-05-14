'use client';

import React from 'react';
import type { BibliographicMetadata, DocumentAnalysis } from '@repo/types';
import { Card, CardContent } from '@/src/components/atoms/Card';
import { Spinner } from '@/src/components/atoms/Spinner';
import { Badge } from '@/src/components/atoms/Badge';
import { RelevanceBadge } from './RelevanceBadge';
import { CitationList } from './CitationList';
import { MethodologyCard } from './MethodologyCard';
import { cn } from '@/src/lib/utils';

interface AnalysisPanelProps {
  analysis: DocumentAnalysis | null;
  isLoading: boolean;
  error: string | null;
  analysisStatus: string | null;
  documentName: string;
  onCitationClick?: (pageNumber: number, text: string) => void;
  onDiscardCitation?: (citationIndex: number) => void;
  discardingCitationIndex?: number | null;
  bibliographicMetadata?: BibliographicMetadata | null;
  className?: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  isLoading,
  error,
  analysisStatus,
  documentName,
  onCitationClick,
  onDiscardCitation,
  discardingCitationIndex = null,
  bibliographicMetadata,
  className = '',
}) => {
  if (isLoading || analysisStatus === 'analyzing' || analysisStatus === 'pending') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-xxl', className)}>
        <Spinner size="lg" text={analysisStatus === 'pending' ? 'Analyse en attente...' : 'Analyse en cours...'} />
      </div>
    );
  }

  if (error || analysisStatus === 'failed') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-xxl text-center', className)}>
        <span className="material-symbols-outlined text-[48px] text-error mb-md">error</span>
        <p className="text-body text-text-secondary mb-sm">
          L&apos;analyse a echoue
        </p>
        <p className="text-small text-text-secondary">
          {error || 'Une erreur est survenue lors de l&apos;analyse.'}
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-xxl text-center', className)}>
        <span className="material-symbols-outlined text-[48px] text-text-secondary mb-md">analytics</span>
        <p className="text-body text-text-secondary">
          Aucune analyse disponible pour ce document.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-lg overflow-y-auto', className)}>
      {/* Header */}
      <div>
        <h1 className="text-h3 font-bold text-text-primary mb-xs truncate" title={documentName}>
          {documentName}
        </h1>
        <Badge variant="success" size="sm">Analyse terminee</Badge>
      </div>

      {/* Resume */}
      <Card>
        <CardContent className="p-md">
          <h2 className="text-body font-semibold text-text-primary mb-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">summarize</span>
            Resume
          </h2>
          <p className="text-body text-text-secondary leading-relaxed whitespace-pre-wrap">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* Pertinence */}
      <Card>
        <CardContent className="p-md">
          <h2 className="text-body font-semibold text-text-primary mb-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">target</span>
            Pertinence
          </h2>
          <RelevanceBadge relevance={analysis.relevance} className="mb-md" />
          <p className="text-body text-text-secondary mb-md">{analysis.relevance.explanation}</p>
          {analysis.relevance.alignedObjectives.length > 0 && (
            <div>
              <h4 className="text-small font-medium text-text-primary mb-xs">Objectifs alignes :</h4>
              <ul className="space-y-xs">
                {analysis.relevance.alignedObjectives.map((obj, i) => (
                  <li key={i} className="text-small text-text-secondary flex items-start gap-xs">
                    <span className="material-symbols-outlined text-sm text-primary mt-0.5">check</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Citations cles */}
      <Card>
        <CardContent className="p-md">
          <h2 className="text-body font-semibold text-text-primary mb-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">format_quote</span>
            Citations cles ({analysis.keyCitations.length})
          </h2>
          <CitationList
            citations={analysis.keyCitations}
            onCitationClick={onCitationClick}
            onDiscardCitation={onDiscardCitation}
            discardingCitationIndex={discardingCitationIndex}
            bibliographicMetadata={bibliographicMetadata}
            documentName={documentName}
          />
        </CardContent>
      </Card>

      {/* Methodologie */}
      <Card>
        <CardContent className="p-md">
          <h2 className="text-body font-semibold text-text-primary mb-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">science</span>
            Methodologie
          </h2>
          <MethodologyCard methodology={analysis.methodology} />
        </CardContent>
      </Card>
    </div>
  );
};

AnalysisPanel.displayName = 'AnalysisPanel';
