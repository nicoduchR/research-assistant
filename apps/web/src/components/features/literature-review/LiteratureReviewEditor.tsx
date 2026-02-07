'use client';

import React from 'react';
import { useLiteratureReviewStore } from '@/src/lib/store/literatureReviewStore';
import { useToastStore } from '@/src/lib/store/toastStore';

interface LiteratureReviewEditorProps {
  reviewId: string;
}

export function LiteratureReviewEditor({ reviewId }: LiteratureReviewEditorProps) {
  const {
    editTitle,
    editContent,
    isSaving,
    setEditTitle,
    setEditContent,
    saveEdits,
    cancelEditing,
  } = useLiteratureReviewStore();
  const addToast = useToastStore((s) => s.addToast);

  const handleSave = async () => {
    try {
      await saveEdits(reviewId);
      addToast('Changes saved', 'success');
    } catch {
      addToast('Failed to save changes', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Title input */}
      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Title
        </label>
        <input
          id="review-title"
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-4 py-2 text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isSaving}
        />
      </div>

      {/* Content textarea */}
      <div>
        <label
          htmlFor="review-content"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Content (Markdown)
        </label>
        <textarea
          id="review-content"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full min-h-[500px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          disabled={isSaving}
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Citation markers appear as [document-id:page]. These will be rendered as inline citations in view mode.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save
            </>
          )}
        </button>
        <button
          onClick={cancelEditing}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
