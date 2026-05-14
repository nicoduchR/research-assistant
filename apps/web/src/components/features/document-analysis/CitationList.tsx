'use client';

import React, { useState } from 'react';
import type { BibliographicMetadata, KeyCitation } from '@repo/types';
import { Badge } from '@/src/components/atoms/Badge';
import { cn } from '@/src/lib/utils';
import { formatApaInTextCitation } from '@/src/lib/citations/apa';
import { useToastStore } from '@/src/lib/store/toastStore';

interface CitationListProps {
  citations: KeyCitation[];
  onCitationClick?: (pageNumber: number, text: string) => void;
  onDiscardCitation?: (citationIndex: number) => void;
  discardingCitationIndex?: number | null;
  bibliographicMetadata?: BibliographicMetadata | null;
  documentName?: string;
  className?: string;
}

function getRelevanceVariant(relevance: string): 'success' | 'warning' | 'neutral' {
  switch (relevance) {
    case 'high': return 'success';
    case 'medium': return 'warning';
    default: return 'neutral';
  }
}

export const CitationList: React.FC<CitationListProps> = ({
  citations,
  onCitationClick,
  onDiscardCitation,
  discardingCitationIndex = null,
  bibliographicMetadata,
  documentName,
  className = '',
}) => {
  const addToast = useToastStore((s) => s.addToast);
  const [copiedCitationIndex, setCopiedCitationIndex] = useState<number | null>(
    null,
  );

  const handleCopyCitation = async (
    citation: KeyCitation,
    index: number,
  ): Promise<void> => {
    const formatted = formatApaInTextCitation(
      citation,
      bibliographicMetadata,
      documentName,
    );
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedCitationIndex(index);
      addToast('Citation copiee (APA 7e edition)', 'success');
      window.setTimeout(() => {
        setCopiedCitationIndex((current) => (current === index ? null : current));
      }, 1500);
    } catch {
      addToast(
        'Impossible de copier la citation',
        'error',
        'Verifiez les permissions du presse-papiers.',
      );
    }
  };

  if (citations.length === 0) {
    return (
      <p className="text-small text-text-secondary italic">
        Aucune citation cle identifiee.
      </p>
    );
  }

  return (
    <div className={cn('space-y-sm', className)}>
      {citations.map((citation, index) => (
        <div
          key={index}
          className={cn(
            'p-md rounded-lg border border-border bg-muted/50',
            citation.pageNumber && onCitationClick && 'cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors',
          )}
          onClick={() => {
            if (citation.pageNumber && onCitationClick) {
              onCitationClick(citation.pageNumber, citation.text);
            }
          }}
          role={citation.pageNumber && onCitationClick ? 'button' : undefined}
          tabIndex={citation.pageNumber && onCitationClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (citation.pageNumber && onCitationClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onCitationClick(citation.pageNumber, citation.text);
            }
          }}
        >
          <div className="flex items-start justify-between gap-sm mb-xs">
            <Badge variant={getRelevanceVariant(citation.relevance)} size="sm">
              {citation.relevance}
            </Badge>
            <div className="flex items-center gap-sm">
              {citation.pageNumber && (
                <span className="text-small text-text-secondary flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">description</span>
                  p. {citation.pageNumber}
                </span>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void handleCopyCitation(citation, index);
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                }}
                title="Copier la citation au format APA 7e edition"
                className="inline-flex items-center gap-xs px-sm py-xs rounded-md border border-border text-small text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedCitationIndex === index ? 'check' : 'content_copy'}
                </span>
                {copiedCitationIndex === index ? 'Copie' : 'Copier APA'}
              </button>
              {onDiscardCitation && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDiscardCitation(index);
                  }}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                  disabled={discardingCitationIndex !== null}
                  className="inline-flex items-center gap-xs px-sm py-xs rounded-md border border-border text-small text-text-secondary hover:text-error hover:border-error/50 hover:bg-error/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">
                    {discardingCitationIndex === index ? 'hourglass_top' : 'delete'}
                  </span>
                  {discardingCitationIndex === index ? 'Suppression...' : 'Discard'}
                </button>
              )}
            </div>
          </div>
          <blockquote className="text-body text-text-primary italic border-l-2 border-primary/30 pl-md mb-xs">
            &ldquo;{citation.text}&rdquo;
          </blockquote>
          {citation.context && (
            <p className="text-small text-text-secondary">{citation.context}</p>
          )}
        </div>
      ))}
    </div>
  );
};

CitationList.displayName = 'CitationList';
