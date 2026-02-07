'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiteratureReviewStore } from '@/src/lib/store/literatureReviewStore';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { LiteratureReviewContent } from '@/src/components/features/literature-review/LiteratureReviewContent';
import { LiteratureReviewEditor } from '@/src/components/features/literature-review/LiteratureReviewEditor';
import { ToastContainer } from '@/src/components/molecules/Toast/ToastContainer';
import Header from '@/src/components/Header';
import { MethodologyProgressTracker } from '@/src/components/features/literature-review/MethodologyProgressTracker';

export default function LiteratureReviewPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const { review, isLoading, error, isEditing, fetchReview, startEditing, reset } =
    useLiteratureReviewStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId);
      fetchDocuments();
    }
    return () => {
      reset();
    };
  }, [reviewId, fetchReview, fetchDocuments, reset]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      router.push('/dashboard');
    }
  }, [error, addToast, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading literature review...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Map documents for citation tooltips
  const documentInfos = documents.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Primary column: review content */}
          <div className="flex-1 max-w-4xl">
            {/* Back to Dashboard link */}
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Dashboard
            </button>

            {/* Review header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {review.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formattedDate}
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit
                </button>
              )}
            </div>

            {/* Content or Editor */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              {isEditing ? (
                <LiteratureReviewEditor reviewId={reviewId} />
              ) : (
                <LiteratureReviewContent review={review} documents={documentInfos} />
              )}
            </div>
          </div>

          {/* Secondary column: methodology tracker */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-6 lg:mt-0" aria-label="Methodology progress">
            <div className="lg:sticky lg:top-8">
              <MethodologyProgressTracker />
            </div>
          </aside>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
