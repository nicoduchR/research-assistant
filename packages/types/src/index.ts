// Shared TypeScript types for the monorepo
// This file will be populated with types as features are developed

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Document {
  id: string;
  userId: string;
  filename: string;
  uploadedAt: Date;
}

export interface LiteratureReview {
  id: string;
  userId: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}
