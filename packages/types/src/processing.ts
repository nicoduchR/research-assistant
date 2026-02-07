export enum ProcessingJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface SkippedDocument {
  documentId: string;
  fileName: string;
  reason: string;
}

export interface ProcessingJob {
  id: string;
  userId: string;
  status: ProcessingJobStatus;
  documentIds: string[];
  resultId: string | null;
  errorMessage: string | null;
  progressPercentage: number;
  progressMessage: string | null;
  queuedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date;
  skippedDocuments?: SkippedDocument[];
  processedDocumentCount?: number;
}

export interface CreateProcessingJobDto {
  documentIds: string[];
}

export interface ProcessingJobResponse {
  id: string;
  status: ProcessingJobStatus;
  documentIds: string[];
  resultId: string | null;
  errorMessage: string | null;
  progressPercentage: number;
  progressMessage: string | null;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  skippedDocuments?: SkippedDocument[];
  processedDocumentCount?: number;
  failureType?: 'no_documents' | 'ai_error' | 'unknown';
}
