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
export type { Document, CreateDocumentDto, UpdateDocumentDto } from './document';

// Processing Job types (Story 3.1)
export type {
  ProcessingJob,
  CreateProcessingJobDto,
  ProcessingJobResponse,
} from './processing';
export { ProcessingJobStatus } from './processing';
