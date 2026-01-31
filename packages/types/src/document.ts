/**
 * Document entity type (Story 2.2)
 * Represents an uploaded PDF document with metadata
 * Aligned with ResearchDocument entity in apps/api/src/entities/research-document.entity.ts
 */
export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  pageCount: number | null;
  textExtracted: boolean;
  extractionError: string | null;
  extractedText: string | null;
  uploadedAt: Date | string;
  updatedAt: Date | string;
}

/**
 * DTO for creating a new document
 */
export interface CreateDocumentDto {
  filename: string;
  fileSize: number;
  pageCount?: number;
  projectId?: string;
}

/**
 * DTO for updating document metadata
 */
export interface UpdateDocumentDto {
  pageCount?: number;
  textExtracted?: boolean;
  extractionError?: string;
}
