import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import {
  ProcessingJob,
  ProcessingJobStatus,
} from '../entities/processing-job.entity';

interface LiteratureProcessingJobPayload {
  processingJobId: string;
  userId: string;
  documentIds: string[];
}

@Processor('literature-processing')
export class LiteratureProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(LiteratureProcessingProcessor.name);

  constructor(
    @InjectRepository(ProcessingJob)
    private processingJobRepository: Repository<ProcessingJob>,
  ) {
    super();
  }

  async process(job: Job<LiteratureProcessingJobPayload>): Promise<void> {
    const { processingJobId } = job.data;

    this.logger.log(
      `Starting literature processing job ${job.id} (${job.name}), processingJobId: ${processingJobId}`,
    );

    // Transition: queued -> processing
    await this.processingJobRepository.update(processingJobId, {
      status: ProcessingJobStatus.PROCESSING,
      startedAt: new Date(),
    });

    try {
      // Actual processing logic will be added in Story 3.3
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error(String(error));

      // Transition: processing -> failed
      try {
        await this.processingJobRepository.update(processingJobId, {
          status: ProcessingJobStatus.FAILED,
          errorMessage: err.message,
          completedAt: new Date(),
        });
      } catch (dbError) {
        this.logger.error(
          `Failed to update processing job status for ${processingJobId}: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
        );
      }

      throw err;
    }

    // Transition: processing -> completed
    await this.processingJobRepository.update(processingJobId, {
      status: ProcessingJobStatus.COMPLETED,
      progressPercentage: 100,
      completedAt: new Date(),
    });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Literature processing job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Literature processing job ${job.id} failed: ${error.message}`,
      error.stack,
    );
  }
}
