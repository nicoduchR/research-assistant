'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getDocumentFileUrl } from '@/src/lib/api/documents';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const HIGHLIGHT_CLASS = 'citation-highlight';

/**
 * Normalize text for fuzzy matching: collapse whitespace, trim, lowercase.
 */
function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Search the text layer spans for the target text and apply a highlight class.
 * The text layer renders each text fragment as a separate <span>. A citation
 * may span multiple spans, so we concatenate text content and use index mapping.
 */
function highlightTextInLayer(container: HTMLElement, searchText: string): boolean {
  const textLayer = container.querySelector('.react-pdf__Page__textContent');
  if (!textLayer) return false;

  // Clear previous highlights
  textLayer.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });

  if (!searchText) return false;

  const spans = Array.from(textLayer.querySelectorAll('span[role="presentation"]'));
  if (spans.length === 0) return false;

  const normalizedSearch = normalizeText(searchText);
  // Try progressively shorter prefixes (AI may have slightly different text)
  const minLength = Math.min(40, normalizedSearch.length);

  for (let len = normalizedSearch.length; len >= minLength; len -= 10) {
    const searchFragment = normalizedSearch.slice(0, len);

    // Build concatenated text with span boundaries
    const spanTexts = spans.map((s) => s.textContent || '');
    const concatenated = normalizeText(spanTexts.join(' '));

    const matchIndex = concatenated.indexOf(searchFragment);
    if (matchIndex === -1) continue;

    // Map the match position back to spans
    let charCount = 0;
    let matched = false;
    for (let i = 0; i < spans.length; i++) {
      const spanText = normalizeText(spanTexts[i]);
      const spanStart = charCount;
      const spanEnd = charCount + spanText.length;

      // Add 1 for the space between spans
      charCount = spanEnd + 1;

      // Check if this span overlaps with the match
      const matchEnd = matchIndex + searchFragment.length;
      if (spanEnd > matchIndex && spanStart < matchEnd && spanText.length > 0) {
        (spans[i] as HTMLElement).classList.add(HIGHLIGHT_CLASS);
        matched = true;
      }
    }

    if (matched) {
      // Scroll the first highlighted span into view within the PDF container
      const firstHighlight = textLayer.querySelector(`.${HIGHLIGHT_CLASS}`) as HTMLElement;
      firstHighlight?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
  }

  return false;
}

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
  const highlightText = usePdfViewerStore((s) => s.highlightText);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageRendered, setPageRendered] = useState(false);

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

  // Apply highlight when text layer is rendered or highlight text changes
  useEffect(() => {
    if (!highlightText || !containerRef.current || !pageRendered) return;

    // Text layer may render slightly after the page — poll briefly
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      const found = highlightTextInLayer(containerRef.current!, highlightText);
      if (found || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [highlightText, currentPage, pageRendered]);

  // Clear highlights when page changes without a new highlight
  useEffect(() => {
    setPageRendered(false);
  }, [currentPage]);

  const handleRenderTextLayerSuccess = useCallback(() => {
    setPageRendered(true);
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
          <Page
            pageNumber={currentPage}
            width={containerWidth * (zoom / 100)}
            onRenderTextLayerSuccess={handleRenderTextLayerSuccess}
          />
        )}
      </Document>
    </div>
  );
}
