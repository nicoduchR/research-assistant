'use client';

import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';
import { PdfViewer } from './PdfViewer';

export function PdfPanel() {
  const { isOpen, documentName, closeViewer } = usePdfViewerStore();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-full lg:w-[40%] lg:sticky lg:top-0 lg:h-screen border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">
          {documentName ?? 'PDF Viewer'}
        </h3>
        <button
          onClick={closeViewer}
          className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Close PDF viewer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* PDF viewer */}
      <div className="p-4">
        <PdfViewer />
      </div>
    </div>
  );
}
