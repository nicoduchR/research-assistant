'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DropZone } from '@/src/components/molecules/DropZone/DropZone';
import { ProgressIndicator } from '@/src/components/molecules/ProgressIndicator/ProgressIndicator';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useToastStore } from '@/src/lib/store/toastStore';

export const UploadZone: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { uploads, uploadFiles, removeUpload, retryUpload } = useDocumentStore();
  const addToast = useToastStore((state) => state.addToast);
  const [isDragOverWindow, setIsDragOverWindow] = useState(false);

  // Full-page drag overlay
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragOverWindow(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragOverWindow(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragOverWindow(false);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleDrop = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      const pdfFiles: File[] = [];
      const nonPdfFiles: File[] = [];
      const oversizedFiles: File[] = [];

      for (const file of files) {
        if (file.type !== 'application/pdf') {
          nonPdfFiles.push(file);
        } else if (file.size > 50 * 1024 * 1024) {
          oversizedFiles.push(file);
        } else {
          pdfFiles.push(file);
        }
      }

      // Show error toasts for rejected files
      if (nonPdfFiles.length > 0) {
        addToast('Only PDF files are supported', 'error');
      }
      if (oversizedFiles.length > 0) {
        for (const file of oversizedFiles) {
          addToast(`File size exceeds maximum limit of 50MB`, 'error', file.name);
        }
      }

      if (pdfFiles.length === 0) return;

      // Snapshot current upload keys before starting this batch
      const previousUploadIds = new Set(
        Object.keys(useDocumentStore.getState().uploads),
      );

      // Upload valid PDFs
      await uploadFiles(pdfFiles);

      // Check upload results - only count uploads from THIS batch
      const currentUploads = useDocumentStore.getState().uploads;
      const batchUploads = Object.values(currentUploads).filter(
        (u) => !previousUploadIds.has(u.fileId),
      );
      const completed = batchUploads.filter((u) => u.status === 'completed').length;
      const failed = batchUploads.filter((u) => u.status === 'error');

      if (failed.length > 0) {
        for (const upload of failed) {
          addToast(`Failed to upload ${upload.fileName}`, 'error');
        }
      }

      if (completed > 0) {
        addToast(
          `${completed} of ${pdfFiles.length} documents uploaded successfully`,
          'success',
        );
      }
    },
    [addToast, uploadFiles],
  );

  const activeUploads = Object.values(uploads).filter(
    (u) => u.status === 'uploading' || u.status === 'pending',
  );

  const errorUploads = Object.values(uploads).filter((u) => u.status === 'error');

  return (
    <div className={className}>
      {/* Full-page drag overlay - acts as a functional drop target */}
      {isDragOverWindow && (
        <div
          className="fixed inset-0 z-50 bg-primary/10 border-4 border-dashed border-primary flex items-center justify-center"
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOverWindow(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleDrop(e.dataTransfer.files);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="bg-white rounded-xl p-8 shadow-lg text-center pointer-events-none">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
              cloud_upload
            </span>
            <p className="text-xl font-semibold text-text-primary">
              Drop PDFs here to upload
            </p>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <DropZone
        onDrop={handleDrop}
        accept=".pdf"
        multiple={true}
        maxSize={50}
      />

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="mt-md space-y-sm">
          {activeUploads.map((upload) => (
            <ProgressIndicator
              key={upload.fileId}
              label={upload.fileName}
              percentage={upload.progress}
              status={upload.status === 'uploading' ? 'processing' : 'default'}
            />
          ))}
        </div>
      )}

      {/* Error Uploads with Retry */}
      {errorUploads.length > 0 && (
        <div className="mt-md space-y-sm">
          {errorUploads.map((upload) => (
            <div
              key={upload.fileId}
              className="flex items-center justify-between p-md bg-error/5 border border-error/20 rounded-md"
            >
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-text-primary truncate">
                  {upload.fileName}
                </p>
                <p className="text-small text-error">{upload.error || 'Upload failed'}</p>
              </div>
              <div className="flex gap-sm ml-md">
                <button
                  onClick={() => retryUpload(upload.fileId)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Retry
                </button>
                <button
                  onClick={() => removeUpload(upload.fileId)}
                  className="text-sm font-medium text-text-secondary hover:text-error"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

UploadZone.displayName = 'UploadZone';
