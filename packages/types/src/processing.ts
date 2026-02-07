export enum ProcessingJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
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
}
