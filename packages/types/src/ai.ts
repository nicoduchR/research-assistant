export interface DocumentMetadata {
  id: string;
  fileName: string;
  pageCount: number | null;
}

export interface GenerateLiteratureReviewInput {
  documents: DocumentMetadata[];
  extractedTexts: Record<string, string>;
}

export interface CitationResult {
  text: string;
  sourceDocumentId: string;
  pageNumber: number | null;
}

export interface LiteratureReviewResult {
  title: string;
  content: string;
  citations: CitationResult[];
}

export interface AiHealthResponse {
  status: string;
  model: string;
}
