/**
 * Document entity type (Story 2.1+)
 * Represents an uploaded PDF document
 */
export interface Document {
  id: string;
  filename: string;
  fileSize: number;
  pageCount?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadedAt: Date | string;
  updatedAt?: Date | string;
  userId: string;
  projectId?: string;
  extractedText?: string;
  errorMessage?: string;
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
 * DTO for updating document status
 */
export interface UpdateDocumentDto {
  status?: Document['status'];
  pageCount?: number;
  extractedText?: string;
  errorMessage?: string;
}
