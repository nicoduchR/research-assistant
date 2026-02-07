'use client';

import { useState, useCallback, useRef } from 'react';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { PdfViewer } from './PdfViewer';

export function PdfPanel() {
  const isOpen = usePdfViewerStore((s) => s.isOpen);
  const documentName = usePdfViewerStore((s) => s.documentName);
  const closeViewer = usePdfViewerStore((s) => s.closeViewer);
  const currentPage = usePdfViewerStore((s) => s.currentPage);
  const totalPages = usePdfViewerStore((s) => s.totalPages);
  const setPage = usePdfViewerStore((s) => s.setPage);
  const zoom = usePdfViewerStore((s) => s.zoom);
  const setZoom = usePdfViewerStore((s) => s.setZoom);

  const [pageInput, setPageInput] = useState('');
  const [isEditingPage, setIsEditingPage] = useState(false);
  const isSubmittingRef = useRef(false);

  const handlePageInputSubmit = useCallback(() => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // Read fresh totalPages from store to avoid stale closure on document switch
    const currentTotalPages = usePdfViewerStore.getState().totalPages;

    // Skip if toolbar is no longer visible (e.g., document switch in progress)
    if (currentTotalPages === null) {
      setIsEditingPage(false);
      return;
    }

    const parsed = parseInt(pageInput, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > currentTotalPages) {
      useToastStore.getState().addToast('Invalid page number', 'error');
      setPageInput('');
      setIsEditingPage(false);
      return;
    }
    setPage(parsed);
    setIsEditingPage(false);
  }, [pageInput, setPage]);

  if (!isOpen) {
    return null;
  }

  const navButtonClass =
    'p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

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

      {/* Navigation toolbar */}
      {totalPages !== null && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={navButtonClass}
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {isEditingPage ? (
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePageInputSubmit();
                  if (e.key === 'Escape') setIsEditingPage(false);
                }}
                onBlur={handlePageInputSubmit}
                autoFocus
                className="w-12 text-center text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <button
                onClick={() => {
                  isSubmittingRef.current = false;
                  setPageInput(String(currentPage));
                  setIsEditingPage(true);
                }}
                className="w-12 text-center text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded px-1 py-0.5 transition-colors"
                aria-label="Go to page"
              >
                {currentPage}
              </button>
            )}

            <span className="text-sm text-slate-500 dark:text-slate-400">/ {totalPages}</span>

            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={navButtonClass}
              aria-label="Next page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              disabled={zoom <= 50}
              className={navButtonClass}
              aria-label="Zoom out"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_out</span>
            </button>

            <button
              onClick={() => setZoom(100)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors min-w-[3rem] text-center"
              aria-label="Reset zoom"
            >
              {zoom}%
            </button>

            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
              className={navButtonClass}
              aria-label="Zoom in"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_in</span>
            </button>
          </div>
        </div>
      )}

      {/* PDF viewer */}
      <div className="p-4">
        <PdfViewer />
      </div>
    </div>
  );
}
