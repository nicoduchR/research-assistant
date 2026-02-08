import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, UnrecoverableError } from 'bullmq';
import { ResearchDocument } from '../entities/research-document.entity';
import { ResearchScope } from '../entities/research-scope.entity';
import { DocumentAnalysis } from '../entities/document-analysis.entity';
import { AiService } from '../modules/ai/ai.service';
import { ProcessingGateway } from '../gateways/processing.gateway';

interface DocumentAnalysisJobPayload {
  documentId: string;
  userId: string;
}

@Processor('document-analysis', {
  lockDuration: 300000, // 5 minutes for AI calls
})
export class DocumentAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(DocumentAnalysisProcessor.name);

  constructor(
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    @InjectRepository(ResearchScope)
    private researchScopeRepository: Repository<ResearchScope>,
    @InjectRepository(DocumentAnalysis)
    private documentAnalysisRepository: Repository<DocumentAnalysis>,
    private readonly aiService: AiService,
    private readonly processingGateway: ProcessingGateway,
  ) {
    super();
  }

  async process(job: Job<DocumentAnalysisJobPayload>): Promise<void> {
    switch (job.name) {
      case 'analyze-document':
        return await this.handleAnalysis(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Document analysis job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Document analysis job ${job.id} failed: ${error.message}`,
      error.stack,
    );
  }

  private async handleAnalysis(
    job: Job<DocumentAnalysisJobPayload>,
  ): Promise<void> {
    const { documentId, userId } = job.data;

    this.logger.log(
      `Starting document analysis for document ${documentId} (user: ${userId})`,
    );

    try {
      // Step 1: Fetch document with extracted text
      const document = await this.documentRepository.findOne({
        where: { id: documentId, userId },
      });

      if (!document) {
        throw new UnrecoverableError(
          `Document ${documentId} not found`,
        );
      }

      if (!document.extractedText || !document.textExtracted) {
        throw new UnrecoverableError(
          `Document ${documentId} has no extracted text`,
        );
      }

      // Step 2: Fetch research scope for relevance assessment
      const researchScope = await this.researchScopeRepository.findOne({
        where: { userId },
      });

      const scope = researchScope
        ? {
            title: researchScope.title,
            problematique: researchScope.problematique,
            objectives: researchScope.objectives,
          }
        : {
            title: 'General Research',
            problematique: 'General academic analysis',
            objectives: null,
          };

      // Step 3: Set status to analyzing
      await this.documentRepository.update(documentId, {
        analysisStatus: 'analyzing',
      });

      this.processingGateway.emitAnalysisProgress(userId, {
        documentId,
        percentage: 10,
        message: 'Starting AI analysis...',
      });

      // Step 4: Call AI service
      const result = await this.aiService.analyzeDocument(
        {
          id: document.id,
          fileName: document.fileName,
          pageCount: document.pageCount,
        },
        document.extractedText,
        scope,
      );

      this.processingGateway.emitAnalysisProgress(userId, {
        documentId,
        percentage: 80,
        message: 'Saving analysis results...',
      });

      // Step 5: Save or update DocumentAnalysis record
      const existingAnalysis = await this.documentAnalysisRepository.findOne({
        where: { documentId },
      });

      if (existingAnalysis) {
        await this.documentAnalysisRepository.update(existingAnalysis.id, {
          summary: result.summary,
          keyCitations: result.keyCitations,
          relevance: result.relevance,
          methodology: result.methodology,
          errorMessage: null,
          analyzedAt: new Date(),
        });
      } else {
        const analysis = this.documentAnalysisRepository.create({
          documentId,
          userId,
          summary: result.summary,
          keyCitations: result.keyCitations,
          relevance: result.relevance,
          methodology: result.methodology,
          errorMessage: null,
          analyzedAt: new Date(),
        });
        await this.documentAnalysisRepository.save(analysis);
      }

      // Step 6: Update document status
      await this.documentRepository.update(documentId, {
        analysisStatus: 'completed',
      });

      // Step 7: Emit completion event
      this.processingGateway.emitAnalysisComplete(userId, { documentId });

      this.logger.log(
        `Document analysis completed for document ${documentId}`,
      );
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error(String(error));

      this.logger.error(
        `Document analysis failed for document ${documentId}: ${err.message}`,
        err.stack,
      );

      // Save error to analysis record if it exists
      try {
        const existingAnalysis = await this.documentAnalysisRepository.findOne({
          where: { documentId },
        });
        if (existingAnalysis) {
          await this.documentAnalysisRepository.update(existingAnalysis.id, {
            errorMessage: err.message,
          });
        }
      } catch {
        // Ignore secondary errors
      }

      // Update document status to failed
      try {
        await this.documentRepository.update(documentId, {
          analysisStatus: 'failed',
        });
      } catch {
        // Ignore secondary errors
      }

      // Emit error event
      this.processingGateway.emitAnalysisError(userId, {
        documentId,
        error: err.message,
      });

      throw err;
    }
  }
}
