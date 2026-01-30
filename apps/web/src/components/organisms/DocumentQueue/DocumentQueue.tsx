import React from 'react';
import { FileItem, FileItemProps } from '../../molecules/FileItem';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

export interface DocumentQueueDocument extends Omit<FileItemProps, 'onDelete'> {
  id: string;
}

export interface DocumentQueueProps {
  documents: DocumentQueueDocument[];
  onClearAll?: () => void;
  onDeleteDocument?: (id: string) => void;
  onGenerateReview?: () => void;
  isProcessing?: boolean;
  totalSize?: string;
  estimatedTime?: string;
  className?: string;
}

export const DocumentQueue: React.FC<DocumentQueueProps> = ({
  documents,
  onClearAll,
  onDeleteDocument,
  onGenerateReview,
  isProcessing = false,
  totalSize,
  estimatedTime,
  className = '',
}) => {
  const documentCount = documents.length;
  const readyCount = documents.filter((doc) => doc.status === 'ready').length;
  const processingCount = documents.filter(
    (doc) => doc.status === 'processing'
  ).length;
  const errorCount = documents.filter((doc) => doc.status === 'error').length;

  const canGenerate = readyCount > 0 && !isProcessing;

  return (
    <div
      className={`flex flex-col bg-white border border-border rounded-lg shadow-subtle h-full ${className}`}
      role="region"
      aria-label="Document queue"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-lg border-b border-border">
        <div className="flex items-center gap-md">
          <h2 className="text-h6 font-bold text-text-primary">Document Queue</h2>
          {documentCount > 0 && (
            <Badge variant="primary" size="md">
              {documentCount}
            </Badge>
          )}
        </div>
        {documentCount > 0 && onClearAll && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearAll}
            aria-label="Clear all documents"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-lg" role="list">
        {documentCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-xl">
            <span className="material-symbols-outlined text-6xl text-text-secondary mb-md">
              folder_open
            </span>
            <p className="text-body font-medium text-text-primary mb-sm">
              No documents queued
            </p>
            <p className="text-small text-text-secondary max-w-xs">
              Add documents to start generating your research review
            </p>
          </div>
        ) : (
          <div className="space-y-md">
            {documents.map((doc) => (
              <FileItem
                key={doc.id}
                fileName={doc.fileName}
                fileSize={doc.fileSize}
                status={doc.status}
                onDelete={
                  onDeleteDocument ? () => onDeleteDocument(doc.id) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with Stats and Action */}
      {documentCount > 0 && (
        <div className="border-t border-border p-lg space-y-md">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-md text-small">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Total Size:</span>
              <span className="font-medium text-text-primary">
                {totalSize || 'Calculating...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Est. Time:</span>
              <span className="font-medium text-text-primary">
                {estimatedTime || 'Calculating...'}
              </span>
            </div>
          </div>

          {/* Status Indicators */}
          {(processingCount > 0 || errorCount > 0) && (
            <div className="flex items-center gap-md flex-wrap">
              {processingCount > 0 && (
                <div className="flex items-center gap-xs text-small">
                  <span className="material-symbols-outlined text-sm text-processing animate-spin">
                    sync
                  </span>
                  <span className="text-text-secondary">
                    {processingCount} processing
                  </span>
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center gap-xs text-small">
                  <span className="material-symbols-outlined text-sm text-error">
                    error
                  </span>
                  <span className="text-text-secondary">{errorCount} errors</span>
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={onGenerateReview}
            disabled={!canGenerate}
            loading={isProcessing}
            className="w-full"
            icon={
              !isProcessing ? (
                <span className="material-symbols-outlined">auto_awesome</span>
              ) : undefined
            }
          >
            {isProcessing
              ? 'Generating Review...'
              : `Generate Review (${readyCount})`}
          </Button>
        </div>
      )}
    </div>
  );
};

DocumentQueue.displayName = 'DocumentQueue';
