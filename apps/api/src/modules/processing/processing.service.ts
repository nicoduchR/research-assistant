import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ProcessingJob,
  ProcessingJobStatus,
} from '../../entities/processing-job.entity';
import { ResearchDocument } from '../../entities/research-document.entity';

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);

  constructor(
    @InjectRepository(ProcessingJob)
    private processingJobRepository: Repository<ProcessingJob>,
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    @InjectQueue('literature-processing')
    private literatureQueue: Queue,
  ) {}

  async createJob(
    userId: string,
    documentIds: string[],
  ): Promise<ProcessingJob> {
    // Check for existing active processing job
    const activeJob = await this.processingJobRepository.findOne({
      where: {
        userId,
        status: In([ProcessingJobStatus.QUEUED, ProcessingJobStatus.PROCESSING]),
      },
    });

    if (activeJob) {
      throw new BadRequestException(
        'A processing job is already in progress. Please wait for it to complete.',
      );
    }

    // Verify all documents belong to user
    const documents = await this.documentRepository.find({
      where: { id: In(documentIds), userId },
    });

    if (documents.length !== documentIds.length) {
      throw new BadRequestException(
        'One or more documents not found or do not belong to you',
      );
    }

    // Require at least one document with extracted text, but allow mixed sets
    const extractedDocs = documents.filter((doc) => doc.textExtracted);
    if (extractedDocs.length === 0) {
      throw new BadRequestException(
        'At least one document must have completed text extraction',
      );
    }

    // Pass ALL document IDs to the processor — it will partition and track skipped docs
    const allDocIds = documents.map((doc) => doc.id);

    // Create ProcessingJob entity with status QUEUED (all selected docs)
    const job = this.processingJobRepository.create({
      userId,
      status: ProcessingJobStatus.QUEUED,
      documentIds: allDocIds,
    });

    const savedJob = await this.processingJobRepository.save(job);

    this.logger.log(
      `Created processing job ${savedJob.id} for user ${userId.substring(0, 8)}... with ${allDocIds.length} documents (${extractedDocs.length} with text)`,
    );

    // Add to BullMQ queue with all document IDs — processor handles partitioning
    await this.literatureQueue.add('generate-review', {
      processingJobId: savedJob.id,
      userId: userId,
      documentIds: allDocIds,
    });

    this.logger.log(
      `Queued literature processing job ${savedJob.id}`,
    );

    return savedJob;
  }

  async getJob(jobId: string, userId: string): Promise<ProcessingJob> {
    const job = await this.processingJobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Processing job not found');
    }

    if (job.userId !== userId) {
      throw new ForbiddenException('You do not have access to this job');
    }

    return job;
  }

  async getJobsByUser(userId: string): Promise<ProcessingJob[]> {
    return this.processingJobRepository.find({
      where: { userId },
      order: { queuedAt: 'DESC' },
    });
  }
}
