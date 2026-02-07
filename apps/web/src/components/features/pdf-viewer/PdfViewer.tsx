'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getDocumentFileUrl } from '@/src/lib/api/documents';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer() {
  const documentId = usePdfViewerStore((s) => s.documentId);
  const currentPage = usePdfViewerStore((s) => s.currentPage);
  const setTotalPages = usePdfViewerStore((s) => s.setTotalPages);
  const setPage = usePdfViewerStore((s) => s.setPage);
  const clearTargetPage = usePdfViewerStore((s) => s.clearTargetPage);
  const zoom = usePdfViewerStore((s) => s.zoom);
  const storeError = usePdfViewerStore((s) => s.error);
  const setError = usePdfViewerStore((s) => s.setError);
  const retryCount = usePdfViewerStore((s) => s.retryCount);
  const retryLoad = usePdfViewerStore((s) => s.retryLoad);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width - 32);
      }
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const fileSource = useMemo(
    () =>
      documentId
        ? {
            url: getDocumentFileUrl(documentId),
            withCredentials: true,
          }
        : null,
    [documentId],
  );

  const handleRetry = () => {
    retryLoad();
  };

  if (!fileSource) {
    return null;
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      <Document
        key={`${documentId}-${retryCount}`}
        file={fileSource}
        onLoadSuccess={({ numPages }) => {
          setTotalPages(numPages);
          const tp = usePdfViewerStore.getState().targetPage;
          if (tp !== null) {
            setPage(Math.min(tp, numPages));
            clearTargetPage();
          }
        }}
        onLoadError={(error) => {
          const status = 'status' in error ? (error as { status: number }).status : undefined;
          const isNotFound = status === 404 || error.message?.toLowerCase().includes('404');
          if (isNotFound) {
            setError('Source document not found');
          } else {
            setError('Unable to load PDF. Please try again.');
          }
        }}
        loading={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-red-400 mb-4">
              error
            </span>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {storeError || 'Unable to load PDF. Please try again.'}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Retry
            </button>
          </div>
        }
      >
        {containerWidth > 0 && (
          <Page pageNumber={currentPage} width={containerWidth * (zoom / 100)} />
        )}
      </Document>
    </div>
  );
}
