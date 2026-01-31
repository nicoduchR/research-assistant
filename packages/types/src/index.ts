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

// Future types to be implemented:
// - Document (Story 2.3+)
// - LiteratureReview (Story 3.x+)
// - ProcessingJob (Story 3.x+)
