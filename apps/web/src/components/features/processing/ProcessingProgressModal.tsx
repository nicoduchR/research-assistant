'use client';

import React, { useState } from 'react';
import { useProcessingStore } from '@/src/lib/store/processingStore';
import { Dialog } from '@/src/components/atoms/Dialog';
import { Button } from '@/src/components/atoms/Button';
import { useRouter } from 'next/navigation';

export const ProcessingProgressModal: React.FC = () => {
  const router = useRouter();
  const [skippedExpanded, setSkippedExpanded] = useState(false);
  const {
    status,
    progressPercentage,
    progressMessage,
    resultId,
    errorMessage,
    lastDocumentIds,
    skippedDocuments,
    processedDocumentCount,
    failureType,
    startProcessing,
    resetProcessing,
  } = useProcessingStore();

  const isOpen = status !== 'idle';
  const isInProgress = status === 'queued' || status === 'processing';

  const handleClose = () => {
    resetProcessing();
  };

  const handleViewReview = () => {
    if (resultId) {
      resetProcessing();
      router.push(`/literature-review/${resultId}`);
    }
  };

  const handleTryAgain = () => {
    if (lastDocumentIds.length > 0) {
      startProcessing(lastDocumentIds);
    } else {
      resetProcessing();
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'queued':
        return 'Generating Literature Review';
      case 'processing':
        return 'Generating Literature Review';
      case 'completed':
        return 'Literature Review Ready';
      case 'failed':
        return 'Processing Failed';
      default:
        return '';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={isInProgress ? () => {} : handleClose}
      title={getTitle()}
      showCloseButton={!isInProgress}
      size="md"
    >
      <div className="space-y-lg">
        {/* Progress Bar */}
        {(status === 'queued' || status === 'processing') && (
          <div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-sm">
              <p className="text-sm text-text-secondary">
                {status === 'queued'
                  ? 'Queued - waiting to start...'
                  : progressMessage || 'Processing...'}
              </p>
              <p className="text-sm font-medium text-text-primary">
                {progressPercentage}%
              </p>
            </div>
          </div>
        )}

        {/* Completed State */}
        {status === 'completed' && (
          <div className="text-center space-y-md">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full w-full" />
            </div>
            <div className="flex items-center justify-center gap-sm text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-body font-medium">
                Complete! Loading your literature review...
              </p>
            </div>
            {skippedDocuments.length > 0 && processedDocumentCount != null && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-left">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-medium">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
                  Literature review generated from {processedDocumentCount} of{' '}
                  {processedDocumentCount + skippedDocuments.length} documents
                </div>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <button
                    type="button"
                    className="font-medium underline cursor-pointer"
                    onClick={() => setSkippedExpanded(!skippedExpanded)}
                  >
                    {skippedExpanded ? 'Hide' : 'Show'} skipped documents ({skippedDocuments.length})
                  </button>
                  {skippedExpanded && (
                    <ul className="mt-1 space-y-1">
                      {skippedDocuments.map((doc) => (
                        <li key={doc.documentId}>
                          &bull; {doc.fileName} &mdash; {doc.reason}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-amber-600 dark:text-amber-400 italic">
                    Consider re-scanning with OCR or finding text-based versions of skipped documents.
                  </p>
                </div>
              </div>
            )}
            <Button variant="primary" onClick={handleViewReview}>
              View Literature Review
            </Button>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="space-y-md">
            <div className="flex items-start gap-sm text-error">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <div className="text-body">
                {failureType === 'no_documents' ? (
                  <p>No documents with extracted text available. Please upload text-based PDFs.</p>
                ) : failureType === 'ai_error' ? (
                  <p>AI service unavailable. Please try again later.</p>
                ) : (
                  <p>{errorMessage || 'An unexpected error occurred'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-sm">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleTryAgain}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

ProcessingProgressModal.displayName = 'ProcessingProgressModal';
