'use client';

import React from 'react';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useProcessingStore } from '@/src/lib/store/processingStore';
import { Button } from '@/src/components/atoms/Button';

export const GenerateReviewButton: React.FC = () => {
  const documents = useDocumentStore((s) => s.documents);
  const status = useProcessingStore((s) => s.status);
  const startProcessing = useProcessingStore((s) => s.startProcessing);

  const readyDocuments = documents.filter((doc) => doc.textExtracted);
  const hasReadyDocuments = readyDocuments.length > 0;
  const isProcessing = status !== 'idle';
  const isDisabled = !hasReadyDocuments || isProcessing;

  const handleClick = () => {
    const documentIds = readyDocuments.map((doc) => doc.id);
    startProcessing(documentIds);
  };

  const getTooltip = () => {
    if (isProcessing) return 'Processing in progress...';
    if (!hasReadyDocuments)
      return 'Upload documents with text extraction first';
    return undefined;
  };

  return (
    <div className="flex items-center gap-md">
      <Button
        variant="primary"
        size="lg"
        disabled={isDisabled}
        onClick={handleClick}
        title={getTooltip()}
        icon={
          <span className="material-symbols-outlined">auto_awesome</span>
        }
      >
        Generate Literature Review
      </Button>
      {hasReadyDocuments && !isProcessing && (
        <p className="text-sm text-text-secondary">
          {readyDocuments.length} document{readyDocuments.length !== 1 ? 's' : ''} ready
        </p>
      )}
      {!hasReadyDocuments && (
        <p className="text-sm text-text-secondary">
          Upload documents with text extraction first
        </p>
      )}
    </div>
  );
};

GenerateReviewButton.displayName = 'GenerateReviewButton';
