'use client';

import React, { useState } from 'react';
import type { Document } from '@repo/types';
import { Card, CardContent } from '@/src/components/atoms/Card';
import { Badge } from '@/src/components/atoms/Badge';
import { Spinner } from '@/src/components/atoms/Spinner';
import { cn } from '@/src/lib/utils';

export interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  isProcessing?: boolean;
  className?: string;
}

/**
 * DocumentCard - Uploaded PDF display with metadata
 *
 * @example
 * ```tsx
 * <DocumentCard
 *   document={pdfDoc}
 *   onDelete={handleDelete}
 *   onSelect={handleSelect}
 *   isProcessing={false}
 * />
 * ```
 */
export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onSelect,
  isProcessing = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = () => {
    if (isProcessing) {
      return <Spinner size="sm" />;
    }
    if (document.status === 'error') {
      return <span className="material-symbols-outlined text-error">warning</span>;
    }
    return <span className="material-symbols-outlined text-primary">description</span>;
  };

  const getStatusBadge = () => {
    if (isProcessing) {
      return <Badge variant="neutral" size="sm">Processing</Badge>;
    }
    if (document.status === 'error') {
      return <Badge variant="error" size="sm">Error</Badge>;
    }
    if (document.status === 'completed') {
      return <Badge variant="success" size="sm">Ready</Badge>;
    }
    return null;
  };

  return (
    <Card
      className={cn(
        'relative group',
        onSelect && 'cursor-pointer hover:shadow-medium hover:border-primary/30',
        'transition-all duration-fast',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isProcessing && onSelect?.(document.id)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyPress={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(document.id);
        }
      }}
      aria-label={`Document: ${document.filename}`}
    >
      <CardContent className="p-md">
        <div className="flex gap-md">
          {/* File Icon */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-md">
            {getStatusIcon()}
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-sm mb-xs">
              <h3
                className="text-body font-medium text-text-primary truncate flex-1"
                title={document.filename}
              >
                {document.filename}
              </h3>
              {getStatusBadge()}
            </div>

            <div className="flex flex-wrap items-center gap-md text-small text-text-secondary">
              {document.uploadedAt && (
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{formatDate(document.uploadedAt)}</span>
                </div>
              )}

              {document.pageCount !== undefined && (
                <>
                  <span className="text-border">•</span>
                  <span>{document.pageCount} pages</span>
                </>
              )}

              {document.fileSize !== undefined && (
                <>
                  <span className="text-border">•</span>
                  <span>{formatFileSize(document.fileSize)}</span>
                </>
              )}
            </div>
          </div>

          {/* Delete Button (shown on hover) */}
          {onDelete && isHovered && !isProcessing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document.id);
              }}
              className="flex-shrink-0 p-xs text-text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors duration-fast"
              aria-label={`Delete ${document.filename}`}
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
