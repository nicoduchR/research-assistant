export type BibliographyExportFormat = 'apa' | 'mla' | 'chicago' | 'bibtex';

export interface BibliographyExportResponse {
  content: string;
  filename: string;
  warnings: string[];
}

export interface BibliographyEntry {
  documentId: string;
  fileName: string;
  authors?: Array<{ given: string; family: string }>;
  title?: string;
  year?: number;
  journal?: string;
  doi?: string;
}
