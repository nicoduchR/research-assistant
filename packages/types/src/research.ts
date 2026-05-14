// Research Scope types (Story 2.0)

export interface ResearchScope {
  id: string;
  userId: string;
  title: string;
  problematique: string;
  objectives?: string | null;
  personalTheme?: string | null;
  createdAt: string; // ISO 8601 format
  updatedAt: string;
}

export interface CreateResearchScopeDto {
  title: string; // Required, max 200 chars
  problematique: string; // Required, min 50 chars, max 2000 chars
  objectives?: string | null; // Optional, max 1000 chars
  personalTheme?: string | null; // Optional, max 200 chars — only influences keyword suggestions
}
