'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Document, DocumentAnalysis } from '@repo/types';
import { getDocumentAnalysis, listDocuments } from '@/src/lib/api/documents';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';
import { AnalysisPanel } from '@/src/components/features/document-analysis/AnalysisPanel';
import { PdfViewer } from '@/src/components/features/pdf-viewer/PdfViewer';
import { Spinner } from '@/src/components/atoms/Spinner';
import Header from '@/src/components/Header';
import { ToastContainer } from '@/src/components/molecules/Toast/ToastContainer';
import { WS_EVENTS } from '@repo/types';
import { connectSocket, getSocket } from '@/src/lib/websocket-client';
import type { AnalysisCompleteEvent, AnalysisErrorEvent } from '@repo/types';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openViewer = usePdfViewerStore((s) => s.openViewer);
  const setPage = usePdfViewerStore((s) => s.setPage);
  const setHighlightText = usePdfViewerStore((s) => s.setHighlightText);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Fetch document data
  useEffect(() => {
    async function loadDocument() {
      setIsLoadingDoc(true);
      try {
        const docs = await listDocuments();
        const doc = docs.find((d) => d.id === documentId);
        if (!doc) {
          setError('Document not found');
          setIsLoadingDoc(false);
          return;
        }
        setDocument(doc);
        openViewer(documentId, doc.fileName);
        setIsLoadingDoc(false);

        // Load analysis if available
        if (doc.analysisStatus === 'completed') {
          setIsLoadingAnalysis(true);
          try {
            const analysisData = await getDocumentAnalysis(documentId);
            setAnalysis(analysisData);
          } catch {
            // Analysis may not exist yet
          } finally {
            setIsLoadingAnalysis(false);
          }
        }
      } catch {
        setError('Failed to load document');
        setIsLoadingDoc(false);
      }
    }

    if (documentId) {
      loadDocument();
    }
  }, [documentId, openViewer]);

  // Listen for analysis completion via WebSocket
  useEffect(() => {
    const socket = connectSocket();

    const handleAnalysisComplete = async (payload: AnalysisCompleteEvent) => {
      if (payload.documentId === documentId) {
        setDocument((prev) =>
          prev ? { ...prev, analysisStatus: 'completed' } : prev,
        );
        try {
          const analysisData = await getDocumentAnalysis(documentId);
          setAnalysis(analysisData);
        } catch {
          // Ignore
        }
      }
    };

    const handleAnalysisError = (payload: AnalysisErrorEvent) => {
      if (payload.documentId === documentId) {
        setDocument((prev) =>
          prev ? { ...prev, analysisStatus: 'failed' } : prev,
        );
        setError(payload.error);
      }
    };

    socket.on(WS_EVENTS.ANALYSIS_COMPLETE, handleAnalysisComplete);
    socket.on(WS_EVENTS.ANALYSIS_ERROR, handleAnalysisError);

    return () => {
      socket.off(WS_EVENTS.ANALYSIS_COMPLETE, handleAnalysisComplete);
      socket.off(WS_EVENTS.ANALYSIS_ERROR, handleAnalysisError);
    };
  }, [documentId]);

  const handleCitationClick = useCallback(
    (pageNumber: number, text: string) => {
      setPage(pageNumber);
      setHighlightText(text);
      // Scroll the PDF viewer into view (especially useful on mobile where it's below)
      pdfContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [setPage, setHighlightText],
  );

  if (isLoadingDoc) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex items-center justify-center py-xxl">
          <Spinner size="lg" text="Chargement du document..." />
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex flex-col items-center justify-center py-xxl text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-md">
            error
          </span>
          <p className="text-body text-text-secondary mb-md">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Header />

      {/* Back button */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Retour
        </button>
      </div>

      {/* Main content: Split view on desktop, stacked on mobile */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 lg:gap-4 px-4 sm:px-6 lg:px-8 py-4 min-h-0">
        {/* Analysis Panel - Left side (desktop) / Top (mobile) */}
        <div className="w-full lg:w-[60%] overflow-y-auto pb-4 lg:pb-0">
          <AnalysisPanel
            analysis={analysis}
            isLoading={isLoadingAnalysis}
            error={error}
            analysisStatus={document?.analysisStatus ?? null}
            documentName={document?.fileName ?? ''}
            onCitationClick={handleCitationClick}
          />
        </div>

        {/* PDF Viewer - Right side (desktop) / Bottom (mobile) */}
        <div ref={pdfContainerRef} className="w-full lg:w-[40%] bg-white dark:bg-slate-800 rounded-xl border border-border overflow-y-auto min-h-[400px] lg:min-h-0">
          {/* PDF Controls */}
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-border px-md py-sm flex items-center justify-between">
            <span className="text-small text-text-secondary truncate flex-1" title={document?.fileName}>
              {document?.fileName}
            </span>
            <PdfControls />
          </div>
          <PdfViewer />
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}

function PdfControls() {
  const currentPage = usePdfViewerStore((s) => s.currentPage);
  const totalPages = usePdfViewerStore((s) => s.totalPages);
  const setPage = usePdfViewerStore((s) => s.setPage);
  const zoom = usePdfViewerStore((s) => s.zoom);
  const setZoom = usePdfViewerStore((s) => s.setZoom);

  return (
    <div className="flex items-center gap-sm">
      {/* Page navigation */}
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-xs text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>
      <span className="text-small text-text-secondary whitespace-nowrap">
        {currentPage} / {totalPages ?? '...'}
      </span>
      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={totalPages !== null && currentPage >= totalPages}
        className="p-xs text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>

      {/* Zoom controls */}
      <div className="border-l border-border pl-sm flex items-center gap-xs">
        <button
          onClick={() => setZoom(zoom - 10)}
          disabled={zoom <= 50}
          className="p-xs text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
          aria-label="Zoom out"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="text-small text-text-secondary w-10 text-center">
          {zoom}%
        </span>
        <button
          onClick={() => setZoom(zoom + 10)}
          disabled={zoom >= 200}
          className="p-xs text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
          aria-label="Zoom in"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  );
}
