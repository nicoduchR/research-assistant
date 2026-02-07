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
}
