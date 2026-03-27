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

export type KeywordSuggestionIntent =
  | 'broaden'
  | 'deepen'
  | 'complementary'
  | 'methodology'
  | 'emerging';

export interface KeywordSuggestion {
  keyword: string;
  intent: KeywordSuggestionIntent;
  rationale: string;
  ebscoQuery: string;
  relatedQuestion: string;
}

export interface KeywordSuggestionContextDocument {
  id: string;
  fileName: string;
  title?: string;
  year?: number;
  journal?: string;
  methodologyType?: string;
  summary?: string;
  keyCitations?: Array<{
    text: string;
    context: string;
    relevance: 'high' | 'medium' | 'low';
  }>;
  limitations?: string[];
  alignedObjectives?: string[];
}

export interface KeywordSuggestionsResponse {
  generatedAt: string;
  basedOn: {
    scopeTitle: string;
    documentCount: number;
    analyzedDocumentCount: number;
    citationCount: number;
  };
  suggestions: KeywordSuggestion[];
}
