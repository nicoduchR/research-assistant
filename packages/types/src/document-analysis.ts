export interface KeyCitation {
  text: string;
  pageNumber: number | null;
  relevance: 'high' | 'medium' | 'low';
  context: string;
}

export interface RelevanceAssessment {
  score: number; // 1-10
  explanation: string;
  alignedObjectives: string[];
  recommendation: 'keep' | 'maybe' | 'skip';
}

export interface MethodologyAnalysis {
  type: string;
  description: string;
  strengths: string[];
  limitations: string[];
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  userId: string;
  summary: string;
  keyCitations: KeyCitation[];
  relevance: RelevanceAssessment;
  methodology: MethodologyAnalysis;
  errorMessage: string | null;
  analyzedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAnalysisResult {
  summary: string;
  keyCitations: KeyCitation[];
  relevance: RelevanceAssessment;
  methodology: MethodologyAnalysis;
}
