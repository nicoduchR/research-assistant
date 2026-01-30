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

// Future types to be implemented:
// - Document (Story 1.4+)
// - LiteratureReview (Story 2.x+)
// - ProcessingJob (Story 2.x+)
