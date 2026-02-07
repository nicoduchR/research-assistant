'use client';

import React, { useMemo, useState } from 'react';
import { LiteratureReviewResponse } from '@/src/lib/api/literature-reviews';

interface DocumentInfo {
  id: string;
  fileName: string;
}

interface LiteratureReviewContentProps {
  review: LiteratureReviewResponse;
  documents: DocumentInfo[];
}

// Escape HTML entities to prevent XSS when using dangerouslySetInnerHTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Simple markdown to HTML renderer — no heavy library needed
// Content is escaped first to prevent XSS, then markdown patterns are converted
function renderMarkdown(content: string): string {
  return escapeHtml(content)
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
}

// Citation marker pattern: [uuid:page] or [uuid:null]
const CITATION_MARKER_REGEX = /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):(\d+|null)\]/g;

interface ParsedSegment {
  type: 'text' | 'citation';
  content: string;
  citationIndex?: number;
  documentId?: string;
  pageNumber?: number | null;
}

function parseContentWithCitations(
  content: string,
  citations: LiteratureReviewResponse['citations'],
): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;

  // Build a map of documentId -> citation for quick lookup
  const citationByDocAndPage = new Map<string, { index: number; citation: typeof citations[0] }>();
  citations.forEach((c, i) => {
    const key = `${c.documentId}:${c.pageNumber ?? 'null'}`;
    if (!citationByDocAndPage.has(key)) {
      citationByDocAndPage.set(key, { index: i + 1, citation: c });
    }
  });

  let match;
  const regex = new RegExp(CITATION_MARKER_REGEX.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    // Add text before this citation
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    const documentId = match[1]!;
    const pageStr = match[2]!;
    const pageNumber = pageStr === 'null' ? null : parseInt(pageStr, 10);
    const key = `${documentId}:${pageStr}`;
    const citationData = citationByDocAndPage.get(key);

    segments.push({
      type: 'citation',
      content: match[0],
      citationIndex: citationData?.index ?? 0,
      documentId,
      pageNumber,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return segments;
}

interface CitationTooltipProps {
  index: number;
  documentName: string;
  pageNumber: number | null;
}

function InlineCitation({ index, documentName, pageNumber }: CitationTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const pageLabel = pageNumber !== null ? `p. ${pageNumber}` : 'page unknown';

  return (
    <span className="relative inline-block">
      <sup
        className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 mx-0.5 text-xs font-bold text-primary bg-primary/10 border border-primary/30 rounded cursor-pointer hover:bg-primary/20 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="button"
        tabIndex={0}
        aria-label={`Citation ${index}: ${documentName}, ${pageLabel}`}
      >
        {index}
      </sup>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none">
          <span className="font-medium">{documentName}</span>
          <br />
          <span className="text-slate-300">{pageLabel}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 dark:border-t-slate-700" />
        </span>
      )}
    </span>
  );
}

export function LiteratureReviewContent({ review, documents }: LiteratureReviewContentProps) {
  const documentMap = useMemo(() => {
    const map = new Map<string, string>();
    documents.forEach((doc) => map.set(doc.id, doc.fileName));
    return map;
  }, [documents]);

  const segments = useMemo(
    () => parseContentWithCitations(review.content, review.citations),
    [review.content, review.citations],
  );

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {segments.map((segment, i) => {
        if (segment.type === 'citation') {
          const docName = segment.documentId
            ? documentMap.get(segment.documentId) ?? 'Unknown document'
            : 'Unknown document';
          return (
            <InlineCitation
              key={i}
              index={segment.citationIndex ?? 0}
              documentName={docName}
              pageNumber={segment.pageNumber ?? null}
            />
          );
        }

        // Render text segment as HTML (markdown converted)
        const html = renderMarkdown(segment.content);
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}
