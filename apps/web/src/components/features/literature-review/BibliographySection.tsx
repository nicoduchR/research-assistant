'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useToastStore } from '@/src/lib/store/toastStore';
import {
  exportBibliography,
  downloadAsFile,
  copyToClipboard,
} from '@/src/lib/api/literature-reviews';
import type { BibliographicMetadata } from '@repo/types';

interface CitationInfo {
  documentId: string;
  pageNumber: number | null;
  positionInReview: number;
}

interface DocumentInfo {
  id: string;
  fileName: string;
  bibliographicMetadata?: BibliographicMetadata | null;
}

interface BibliographySectionProps {
  reviewId: string;
  citations: CitationInfo[];
  documents: DocumentInfo[];
}

const FORMAT_OPTIONS = [
  {
    value: 'apa',
    label: 'APA 7th Edition',
    description: 'Author-date format, commonly used in social sciences',
  },
  {
    value: 'mla',
    label: 'MLA 9th Edition',
    description: 'Author-page format, commonly used in humanities',
  },
  {
    value: 'chicago',
    label: 'Chicago 17th',
    description: 'Notes-bibliography format, widely accepted in academia',
  },
  {
    value: 'bibtex',
    label: 'BibTeX',
    description: 'LaTeX/reference manager format (.bib file)',
  },
] as const;

function formatAuthors(
  authors: Array<{ given: string; family: string }>,
): string {
  if (authors.length === 0) return '[No author]';
  if (authors.length === 1) {
    const a = authors[0];
    return a.given ? `${a.family}, ${a.given}` : a.family;
  }
  if (authors.length === 2) {
    return `${authors[0].family}, ${authors[0].given || ''} & ${authors[1].family}, ${authors[1].given || ''}`.trim();
  }
  const first = authors[0];
  return `${first.family}, ${first.given || ''} et al.`.trim();
}

function formatBibliographyEntry(
  doc: DocumentInfo,
): string {
  const meta = doc.bibliographicMetadata;
  if (!meta) {
    return doc.fileName;
  }

  const parts: string[] = [];

  // Authors
  if (meta.authors && meta.authors.length > 0) {
    parts.push(formatAuthors(meta.authors));
  } else {
    parts.push('[No author]');
  }

  // Year
  if (meta.year) {
    parts.push(`(${meta.year}).`);
  } else {
    parts.push('([Unknown year]).');
  }

  // Title
  if (meta.title) {
    parts.push(`${meta.title}.`);
  }

  // Journal / publication source
  if (meta.journal) {
    let source = meta.journal;
    if (meta.volume) {
      source += `, ${meta.volume}`;
      if (meta.issue) {
        source += `(${meta.issue})`;
      }
    }
    if (meta.pages) {
      source += `, ${meta.pages}`;
    }
    parts.push(`${source}.`);
  } else if (meta.publisher) {
    parts.push(`${meta.publisher}.`);
  }

  return parts.join(' ') || doc.fileName;
}

export function BibliographySection({
  reviewId,
  citations,
  documents,
}: BibliographySectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const addToast = useToastStore((s) => s.addToast);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, handleClickOutside]);

  // Build bibliography entries: one per unique document, ordered by first citation
  const bibliographyEntries = useMemo(() => {
    const seen = new Set<string>();
    const entries: {
      index: number;
      documentId: string;
      fileName: string;
      doc: DocumentInfo;
    }[] = [];
    let idx = 1;

    const sorted = [...citations].sort(
      (a, b) => a.positionInReview - b.positionInReview,
    );
    const docMap = new Map(documents.map((d) => [d.id, d]));

    for (const c of sorted) {
      if (!seen.has(c.documentId)) {
        seen.add(c.documentId);
        const doc = docMap.get(c.documentId);
        entries.push({
          index: idx++,
          documentId: c.documentId,
          fileName: doc?.fileName ?? 'Unknown document',
          doc: doc ?? { id: c.documentId, fileName: 'Unknown document' },
        });
      }
    }
    return entries;
  }, [citations, documents]);

  const handleExport = async (
    format: string,
    action: 'download' | 'copy',
  ) => {
    const key = `${format}-${action}`;
    setLoadingFormat(key);
    try {
      const result = await exportBibliography(reviewId, format);

      // Always update warnings (clears stale warnings from previous exports)
      setWarnings(result.warnings);

      if (action === 'download') {
        downloadAsFile(result.content, result.filename);
        addToast('Bibliography downloaded successfully', 'success');
      } else {
        const success = await copyToClipboard(result.content);
        if (success) {
          addToast('Bibliography copied to clipboard', 'success');
        } else {
          addToast('Failed to copy to clipboard', 'error');
        }
      }
    } catch {
      addToast('Failed to export bibliography. Please try again.', 'error');
    } finally {
      setLoadingFormat(null);
    }
  };

  if (bibliographyEntries.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            format_quote
          </span>
          Bibliography
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export Bibliography
            <span className="material-symbols-outlined text-[18px]">
              {isDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
              {FORMAT_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleExport(opt.value, 'download')}
                        disabled={loadingFormat !== null}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                      >
                        {loadingFormat === `${opt.value}-download` ? (
                          <span className="animate-spin inline-block w-3 h-3 border border-slate-400 border-t-transparent rounded-full" />
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">
                            download
                          </span>
                        )}
                        Download
                      </button>
                      <button
                        onClick={() => handleExport(opt.value, 'copy')}
                        disabled={loadingFormat !== null}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                      >
                        {loadingFormat === `${opt.value}-copy` ? (
                          <span className="animate-spin inline-block w-3 h-3 border border-slate-400 border-t-transparent rounded-full" />
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">
                            content_copy
                          </span>
                        )}
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {opt.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Incomplete metadata warning */}
      {warnings.length > 0 && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">
              warning
            </span>
            <span className="text-sm font-medium">
              Some citations have incomplete metadata. Please verify manually.
            </span>
          </div>
          <button
            type="button"
            className="mt-1 text-xs text-amber-700 dark:text-amber-300 underline cursor-pointer"
            onClick={() => setShowWarnings(!showWarnings)}
          >
            {showWarnings ? 'Hide details' : 'Show details'}
          </button>
          {showWarnings && (
            <ul className="mt-2 text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
              {warnings.map((w, i) => (
                <li key={i}>&bull; {w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Bibliography entries */}
      <ol className="space-y-3">
        {bibliographyEntries.map((entry) => (
          <li
            key={entry.documentId}
            className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
          >
            <span className="flex-shrink-0 font-medium text-slate-500 dark:text-slate-400 min-w-[1.5rem] text-right">
              [{entry.index}]
            </span>
            <span>{formatBibliographyEntry(entry.doc)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
