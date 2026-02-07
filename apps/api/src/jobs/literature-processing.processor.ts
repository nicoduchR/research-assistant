import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Job } from 'bullmq';
import {
  ProcessingJob,
  ProcessingJobStatus,
} from '../entities/processing-job.entity';
import { ResearchDocument } from '../entities/research-document.entity';
import { LiteratureReview } from '../entities/literature-review.entity';
import { Citation } from '../entities/citation.entity';
import { AiService } from '../modules/ai/ai.service';
import { ProcessingGateway } from '../gateways/processing.gateway';
import type { DocumentMetadata } from '@repo/types';

interface LiteratureProcessingJobPayload {
  processingJobId: string;
  userId: string;
  documentIds: string[];
}

@Processor('literature-processing', {
  lockDuration: 300000, // 5 minutes — AI calls can take 4+ minutes
})
export class LiteratureProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(LiteratureProcessingProcessor.name);

  constructor(
    @InjectRepository(ProcessingJob)
    private processingJobRepository: Repository<ProcessingJob>,
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    @InjectRepository(LiteratureReview)
    private literatureReviewRepository: Repository<LiteratureReview>,
    @InjectRepository(Citation)
    private citationRepository: Repository<Citation>,
    private aiService: AiService,
    private processingGateway: ProcessingGateway,
  ) {
    super();
  }

  async process(job: Job<LiteratureProcessingJobPayload>): Promise<void> {
    const { processingJobId, userId, documentIds } = job.data;

    this.logger.log(
      `Starting literature processing job ${job.id} (${job.name}), processingJobId: ${processingJobId}`,
    );

    // Transition: queued -> processing
    await this.processingJobRepository.update(processingJobId, {
      status: ProcessingJobStatus.PROCESSING,
      startedAt: new Date(),
    });

    try {
      // 0. Validate input
      if (!documentIds || documentIds.length === 0) {
        throw new Error('No document IDs provided for processing');
      }

      // 1. Fetch documents from database
      const documents = await this.documentRepository.find({
        where: { id: In(documentIds) },
      });

      // 2. Filter to documents with extracted text
      const validDocs = documents.filter(
        (d) => d.textExtracted && d.extractedText,
      );

      this.logger.log(
        `Found ${documents.length} documents, ${validDocs.length} with extracted text`,
      );

      // 3. Fail if no documents have extracted text
      if (validDocs.length === 0) {
        throw new Error('No documents with extracted text available');
      }

      const skippedCount = documents.length - validDocs.length;
      if (skippedCount > 0) {
        const skippedIds = documents
          .filter((d) => !d.textExtracted || !d.extractedText)
          .map((d) => d.id);
        this.logger.warn(
          `Skipped ${skippedCount} documents without extracted text: ${skippedIds.join(', ')}`,
        );
      }

      // 4. Update progress: 10% "Preparing documents..."
      await this.processingJobRepository.update(processingJobId, {
        progressPercentage: 10,
        progressMessage: 'Preparing documents...',
      });
      try {
        this.processingGateway.emitProgress(userId, {
          jobId: processingJobId,
          progressPercentage: 10,
          progressMessage: 'Preparing documents...',
        });
      } catch (wsError) {
        this.logger.warn(`WebSocket emit failed: ${wsError}`);
      }

      // 5. Build AI input
      const docMetadata: DocumentMetadata[] = validDocs.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        pageCount: d.pageCount,
      }));
      const extractedTexts: Record<string, string> = {};
      validDocs.forEach((d) => {
        extractedTexts[d.id] = d.extractedText!;
      });

      // 6. Call AI service
      this.logger.log(
        `Calling AI service with ${validDocs.length} documents...`,
      );
      const result = await this.aiService.generateLiteratureReview(
        docMetadata,
        extractedTexts,
      );

      // 7. Update progress: 80% "Saving literature review..."
      await this.processingJobRepository.update(processingJobId, {
        progressPercentage: 80,
        progressMessage: 'Saving literature review...',
      });
      try {
        this.processingGateway.emitProgress(userId, {
          jobId: processingJobId,
          progressPercentage: 80,
          progressMessage: 'Saving literature review...',
        });
      } catch (wsError) {
        this.logger.warn(`WebSocket emit failed: ${wsError}`);
      }

      // 8. Save literature review
      const review = this.literatureReviewRepository.create({
        userId,
        jobId: processingJobId,
        title: result.title,
        content: result.content,
        documentIds: validDocs.map((d) => d.id),
      });
      const saved = await this.literatureReviewRepository.save(review);

      this.logger.log(
        `Literature review saved: ${saved.id} (title: "${saved.title}")`,
      );

      // 8.5 Save citations
      await this.processingJobRepository.update(processingJobId, {
        progressPercentage: 85,
        progressMessage: 'Saving citations...',
      });
      try {
        this.processingGateway.emitProgress(userId, {
          jobId: processingJobId,
          progressPercentage: 85,
          progressMessage: 'Saving citations...',
        });
      } catch (wsError) {
        this.logger.warn(`WebSocket emit failed: ${wsError}`);
      }

      if (result.citations && result.citations.length > 0) {
        const allDocIds = new Set(documents.map((d) => d.id));
        const validDocIds = new Set(validDocs.map((d) => d.id));

        // Track original indices so positionInReview reflects position in the AI response
        const indexedCitations = result.citations.map((citation, index) => ({
          ...citation,
          originalIndex: index,
        }));

        const validCitations = indexedCitations.filter((citation) => {
          if (!allDocIds.has(citation.sourceDocumentId)) {
            this.logger.warn(
              `Citation ${citation.originalIndex} references unknown document ${citation.sourceDocumentId} — filtering out (document not in database)`,
            );
            return false;
          }
          return true;
        });

        if (validCitations.length < result.citations.length) {
          this.logger.warn(
            `Filtered ${result.citations.length - validCitations.length} citations with invalid document references`,
          );
        }

        if (validCitations.length > 0) {
          const citationEntities = validCitations.map((citation) => {
            if (!validDocIds.has(citation.sourceDocumentId)) {
              this.logger.warn(
                `Citation ${citation.originalIndex} references document ${citation.sourceDocumentId} which exists but had no extracted text`,
              );
            }

            return this.citationRepository.create({
              literatureReviewId: saved.id,
              documentId: citation.sourceDocumentId,
              pageNumber: citation.pageNumber,
              claimText: citation.text,
              positionInReview: citation.originalIndex,
              isVerified: false,
              userNotes: citation.pageNumber === null ? 'Page number uncertain' : null,
            });
          });

          // Save citations individually to prevent one FK violation from losing all citations
          let savedCount = 0;
          for (const citationEntity of citationEntities) {
            try {
              await this.citationRepository.save(citationEntity);
              savedCount++;
            } catch (citationError) {
              this.logger.error(
                `Failed to save citation at position ${citationEntity.positionInReview} for review ${saved.id}: ${citationError}`,
                (citationError as Error).stack,
              );
            }
          }
          if (savedCount > 0) {
            this.logger.log(
              `Saved ${savedCount}/${citationEntities.length} citations for review ${saved.id}`,
            );
          }
        }
      }

      // 9. Complete: link review, update progress, and mark as completed
      await this.processingJobRepository.update(processingJobId, {
        resultId: saved.id,
        status: ProcessingJobStatus.COMPLETED,
        progressPercentage: 100,
        progressMessage: 'Complete',
        completedAt: new Date(),
      });
      try {
        this.processingGateway.emitComplete(userId, {
          jobId: processingJobId,
          resultId: saved.id,
        });
      } catch (wsError) {
        this.logger.warn(`WebSocket emit failed: ${wsError}`);
      }
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

      try {
        this.processingGateway.emitError(userId, {
          jobId: processingJobId,
          errorMessage: err.message,
        });
      } catch (wsError) {
        this.logger.warn(`WebSocket emit failed: ${wsError}`);
      }

      throw err;
    }
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
