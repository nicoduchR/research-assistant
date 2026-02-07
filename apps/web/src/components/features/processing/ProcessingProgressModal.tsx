'use client';

import React from 'react';
import { useProcessingStore } from '@/src/lib/store/processingStore';
import { Dialog } from '@/src/components/atoms/Dialog';
import { Button } from '@/src/components/atoms/Button';
import { useRouter } from 'next/navigation';

export const ProcessingProgressModal: React.FC = () => {
  const router = useRouter();
  const {
    status,
    progressPercentage,
    progressMessage,
    resultId,
    errorMessage,
    lastDocumentIds,
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
              <p className="text-body">
                Processing failed: {errorMessage || 'An unexpected error occurred'}
              </p>
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
