// Shared TypeScript types for the monorepo
// Types are added as entities are implemented in the backend

// User entity (Story 1.2)
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Research Scope (Story 2.0)
export type { ResearchScope, CreateResearchScopeDto } from './research';

// Document types (Story 2.1+)
export type {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  BibliographicMetadata,
} from './document';

// Bibliography export types (Story 3.10)
export type {
  BibliographyExportFormat,
  BibliographyExportResponse,
  BibliographyEntry,
} from './bibliography';

// Processing Job types (Story 3.1)
export type {
  ProcessingJob,
  CreateProcessingJobDto,
  ProcessingJobResponse,
} from './processing';
export { ProcessingJobStatus } from './processing';

// AI types (Story 3.2)
export type {
  DocumentMetadata,
  GenerateLiteratureReviewInput,
  CitationResult,
  LiteratureReviewResult,
  AiHealthResponse,
} from './ai';

// Literature Review types (Story 3.3)
export type {
  LiteratureReview,
  LiteratureReviewResponse,
} from './literature-review';

// Citation types (Story 3.4)
export type {
  Citation,
  CitationResponse,
} from './citation';

// WebSocket types (Story 3.5)
export type {
  ProgressEvent,
  CompleteEvent,
  ErrorEvent,
  AnalysisProgressEvent,
  AnalysisCompleteEvent,
  AnalysisErrorEvent,
} from './websocket';
export { WS_EVENTS } from './websocket';

// Document Analysis types
export type {
  KeyCitation,
  RelevanceAssessment,
  MethodologyAnalysis,
  DocumentAnalysis,
  DocumentAnalysisResult,
} from './document-analysis';
