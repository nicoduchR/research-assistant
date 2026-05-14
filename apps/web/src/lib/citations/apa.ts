import type { BibliographicMetadata, KeyCitation } from '@repo/types';

function formatAuthors(authors?: BibliographicMetadata['authors']): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) return authors[0].family;
  if (authors.length === 2) return `${authors[0].family} & ${authors[1].family}`;
  return `${authors[0].family} et al.`;
}

function stripExtension(name: string): string {
  return name.replace(/\.[^.]+$/, '').trim();
}

/**
 * Builds an APA 7th Edition in-text citation for a direct quote:
 *   "quoted text" (Author, Year, p. X).
 * Falls back to title or filename when authors are missing, and "n.d." when year is missing.
 */
export function formatApaInTextCitation(
  citation: KeyCitation,
  metadata?: BibliographicMetadata | null,
  fallbackTitle?: string,
): string {
  const author = formatAuthors(metadata?.authors);
  const subject =
    author ||
    metadata?.title?.trim() ||
    (fallbackTitle ? stripExtension(fallbackTitle) : '');
  const year = metadata?.year ? String(metadata.year) : 'n.d.';
  const page = citation.pageNumber ? `p. ${citation.pageNumber}` : '';

  const segments = [subject, year, page].filter(Boolean);
  const parenthetical = segments.length > 0 ? ` (${segments.join(', ')})` : '';
  const main = `"${citation.text}"${parenthetical}.`;
  const context = citation.context?.trim();

  return context ? `${main}\n${context}` : main;
}
