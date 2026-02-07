'use client';

import React, { useEffect } from 'react';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { EmptyState } from '@/src/components/features/layout/EmptyState';
import { Badge } from '@/src/components/atoms/Badge';
import { Spinner } from '@/src/components/atoms/Spinner';
import { cn, formatDate, formatFileSize } from '@/src/lib/utils';
import type { Document } from '@repo/types';

function getExtractionStatus(doc: Document): 'processing' | 'success' | 'error' {
  if (doc.extractionError) return 'error';
  if (doc.textExtracted) return 'success';
  return 'processing';
}

const DocumentListItem: React.FC<{
  document: Document;
  onDelete?: (id: string) => void;
}> = ({ document, onDelete }) => {
  const status = getExtractionStatus(document);

  return (
    <div className="flex items-center gap-md p-md bg-white dark:bg-slate-800 border border-border rounded-lg hover:shadow-md transition-all duration-fast">
      {/* File Icon / Status */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-md">
        {status === 'processing' ? (
          <Spinner size="sm" />
        ) : status === 'error' ? (
          <span className="material-symbols-outlined text-error">warning</span>
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
          {status === 'processing' && (
            <Badge variant="processing" size="sm">Processing</Badge>
          )}
          {status === 'error' && (
            <Badge variant="error" size="sm">Error</Badge>
          )}
          {status === 'success' && (
            <Badge variant="success" size="sm">Ready</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-md text-small text-text-secondary">
          {document.uploadedAt && (
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              <span>{formatDate(document.uploadedAt)}</span>
            </div>
          )}
          {document.pageCount != null && (
            <>
              <span className="text-border">&bull;</span>
              <span>{document.pageCount} pages</span>
            </>
          )}
          <span className="text-border">&bull;</span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(document.id)}
          className="flex-shrink-0 p-xs text-text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors duration-fast opacity-0 group-hover:opacity-100"
          aria-label={`Delete ${document.fileName}`}
        >
          <span className="material-symbols-outlined text-xl">delete</span>
        </button>
      )}
    </div>
  );
};

export const DocumentList: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { documents, isLoading, fetchDocuments, deleteDocument } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (isLoading && documents.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-xxl', className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={
          <span className="material-symbols-outlined text-6xl">library_books</span>
        }
        title="No documents yet"
        description="Drag and drop PDFs to get started."
        className={className}
      />
    );
  }

  // Sort by upload date (newest first)
  const sortedDocuments = [...documents].sort((a, b) => {
    const dateA = new Date(a.uploadedAt).getTime();
    const dateB = new Date(b.uploadedAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className={cn('space-y-sm', className)}>
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-h3 font-semibold text-text-primary">
          Documents ({documents.length})
        </h2>
      </div>
      {sortedDocuments.map((doc) => (
        <div key={doc.id} className="group">
          <DocumentListItem
            document={doc}
            onDelete={deleteDocument}
          />
        </div>
      ))}
    </div>
  );
};

DocumentList.displayName = 'DocumentList';
