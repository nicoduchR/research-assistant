'use client';

import React from 'react';
import type { Document } from '@repo/types';
import { Card, CardContent } from '@/src/components/atoms/Card';
import { Badge } from '@/src/components/atoms/Badge';
import { Spinner } from '@/src/components/atoms/Spinner';
import { cn, formatDate, formatFileSize, formatPageCount } from '@/src/lib/utils';

export interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  className?: string;
}

type DocStatus = 'processing' | 'error' | 'analyzing' | 'analyzed' | 'ready';

function getDocumentStatus(doc: Document): DocStatus {
  if (doc.extractionError) return 'error';
  if (!doc.textExtracted) return 'processing';
  if (doc.analysisStatus === 'pending' || doc.analysisStatus === 'analyzing') return 'analyzing';
  if (doc.analysisStatus === 'completed') return 'analyzed';
  if (doc.analysisStatus === 'failed') return 'ready'; // Analysis failed but doc is still usable
  return 'ready';
}

function getStatusBadge(status: DocStatus) {
  switch (status) {
    case 'processing':
      return <Badge variant="processing" size="sm">Processing</Badge>;
    case 'error':
      return <Badge variant="error" size="sm">Error</Badge>;
    case 'analyzing':
      return <Badge variant="processing" size="sm">Analyse...</Badge>;
    case 'analyzed':
      return <Badge variant="success" size="sm">Analyse</Badge>;
    case 'ready':
      return <Badge variant="success" size="sm">Ready</Badge>;
  }
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onSelect,
  className = '',
}) => {
  const status = getDocumentStatus(document);
  const isClickable = onSelect && status !== 'processing';

  return (
    <Card
      className={cn(
        'relative group',
        isClickable && 'cursor-pointer hover:shadow-medium hover:border-primary/30',
        isClickable && 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-all duration-fast',
        className
      )}
      padding="none"
      onClick={() => isClickable && onSelect?.(document.id)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect!(document.id);
        }
      }}
      aria-label={`Document: ${document.fileName}`}
      aria-disabled={onSelect && status === 'processing' ? true : undefined}
    >
      <CardContent className="p-md">
        <div className="flex gap-md">
          {/* File Icon / Status */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-md">
            {(status === 'processing' || status === 'analyzing') ? (
              <Spinner size="sm" />
            ) : status === 'error' ? (
              <span className="material-symbols-outlined text-error">warning</span>
            ) : status === 'analyzed' ? (
              <span className="material-symbols-outlined text-primary">analytics</span>
            ) : (
              <span className="material-symbols-outlined text-primary">description</span>
            )}
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-sm mb-xs">
              <h3
                className="text-body font-medium text-text-primary truncate flex-1"
                title={document.fileName}
              >
                {document.fileName}
              </h3>
              {getStatusBadge(status)}
            </div>

            <div className="flex flex-wrap items-center gap-md text-small text-text-secondary">
              {document.uploadedAt && (
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{formatDate(document.uploadedAt)}</span>
                </div>
              )}
              <span className="text-border">&bull;</span>
              <span>{formatPageCount(document.pageCount)}</span>
              <span className="text-border">&bull;</span>
              <span>{formatFileSize(document.fileSize)}</span>
            </div>

            {status === 'error' && document.extractionError && (
              <p className="mt-xs text-small text-error" title={document.extractionError}>
                {document.extractionError}
              </p>
            )}
          </div>

          {/* Delete Button (shown on hover) */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document.id);
              }}
              className="flex-shrink-0 p-xs text-text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors duration-fast opacity-0 group-hover:opacity-100"
              aria-label={`Delete ${document.fileName}`}
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

DocumentCard.displayName = 'DocumentCard';
