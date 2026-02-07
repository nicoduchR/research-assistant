import { ProcessingJobStatus } from '../../../entities/processing-job.entity';

export class ProcessingJobResponseDto {
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
  skippedDocuments?: Array<{
    documentId: string;
    fileName: string;
    reason: string;
  }>;
  processedDocumentCount?: number;
  failureType?: 'no_documents' | 'ai_error' | 'unknown';
}
