'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Document } from '@repo/types';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { EmptyState } from '@/src/components/features/layout/EmptyState';
import { DocumentCard } from '@/src/components/features/cards/DocumentCard';
import { Modal } from '@/src/components/features/layout/Modal';
import { Spinner } from '@/src/components/atoms/Spinner';
import { cn } from '@/src/lib/utils';

export const DocumentList: React.FC<{ className?: string }> = ({ className = '' }) => {
  const router = useRouter();
  const { documents, isLoading, fetchDocuments, deleteDocument } = useDocumentStore();
  const addToast = useToastStore((state) => state.addToast);
  const [pendingDeleteDoc, setPendingDeleteDoc] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSelectDocument = useCallback(
    (id: string) => {
      router.push(`/document/${id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (doc) setPendingDeleteDoc(doc);
    },
    [documents],
  );

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteDoc(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteDoc) return;

    setIsDeleting(true);
    try {
      await deleteDocument(pendingDeleteDoc.id);
      setPendingDeleteDoc(null);
      addToast('Document deleted successfully', 'success');
    } catch {
      addToast('Failed to delete document. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDeleteDoc, deleteDocument, addToast]);

  if (isLoading && documents.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-xxl', className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (documents.length === 0 && !pendingDeleteDoc) {
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

  return (
    <div className={cn('space-y-sm', className)}>
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-h3 font-semibold text-text-primary">
          Documents ({documents.length})
        </h2>
      </div>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onDelete={handleDeleteClick}
          onSelect={handleSelectDocument}
        />
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!pendingDeleteDoc}
        onClose={handleCancelDelete}
        title="Delete Document"
        actions={[
          { label: 'Cancel', onClick: handleCancelDelete, variant: 'secondary' },
          { label: 'Delete', onClick: handleConfirmDelete, variant: 'destructive', loading: isDeleting },
        ]}
      >
        <p className="text-body text-text-secondary">
          Are you sure you want to delete <strong>{pendingDeleteDoc?.fileName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

DocumentList.displayName = 'DocumentList';
