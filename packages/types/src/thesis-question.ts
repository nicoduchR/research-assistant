export type ThesisQuestionStatus =
  | 'a_traiter'
  | 'en_cours'
  | 'brouillon'
  | 'validee';

export type EvidenceConfidence = 'low' | 'medium' | 'high';

export interface EvidenceRow {
  claim: string;
  documentId: string;
  fileName: string;
  pageNumber: number | null;
  sourceSnippet: string;
  limitation: string;
  confidence: EvidenceConfidence;
}

export interface ThesisQuestion {
  id: string;
  userId: string;
  researchScopeId: string;
  code: string;
  section: string;
  title: string;
  questionText: string;
  targetReferences: string[];
  status: ThesisQuestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ThesisAnswerDraft {
  id: string;
  questionId: string;
  answerMarkdown: string;
  evidenceRows: EvidenceRow[];
  gaps: string[];
  confidenceScore: number;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EbscoQuerySuggestion {
  label: string;
  query: string;
  rationale: string;
  intent: 'broaden' | 'deepen' | 'complementary' | 'methodology' | 'emerging';
}

export interface EbscoQueryResponse {
  generatedAt: string;
  basedOn: {
    documentCount: number;
    analyzedDocumentCount: number;
    citationCount: number;
  };
  queries: EbscoQuerySuggestion[];
}
