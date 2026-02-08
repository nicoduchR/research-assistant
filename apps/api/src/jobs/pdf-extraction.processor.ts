import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Repository } from 'typeorm';
import { Job, Queue } from 'bullmq';
import { ResearchDocument } from '../entities/research-document.entity';
import { BibliographyMetadataService } from '../modules/documents/bibliography-metadata.service';
import * as fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

interface PdfExtractionJobPayload {
  documentId: string;
  userId: string;
  storagePath: string;
}

@Processor('pdf-extraction')
export class PdfExtractionProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfExtractionProcessor.name);
  private readonly SCANNED_PDF_THRESHOLD = 100; // Characters

  constructor(
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    private readonly bibliographyMetadataService: BibliographyMetadataService,
    @InjectQueue('document-analysis')
    private documentAnalysisQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<PdfExtractionJobPayload>): Promise<void> {
    switch (job.name) {
      case 'extract-text':
        return await this.handleExtraction(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`PDF extraction job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `PDF extraction job ${job.id} failed: ${error.message}`,
      error.stack,
    );
  }

  private async handleExtraction(job: Job<PdfExtractionJobPayload>): Promise<void> {
    const { documentId, userId, storagePath } = job.data;

    this.logger.log(
      `Starting PDF extraction for document ${documentId} (user: ${userId})`,
    );

    try {
      // Step 1: Read PDF file from filesystem
      const pdfBuffer = await fs.readFile(storagePath);

      // Step 2: Parse PDF using pdf-parse v2 API
      const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
      try {
        const textResult = await parser.getText();

        // Step 3: Extract text and page count
        const extractedText = textResult.text;
        const pageCount = textResult.total;

        // Step 4: Detect scanned PDFs (heuristic: very little text extracted)
        const isScanned =
          extractedText.trim().length < this.SCANNED_PDF_THRESHOLD;

        if (isScanned) {
          this.logger.warn(
            `Scanned PDF detected for document ${documentId} (user: ${userId}) - ` +
              `only ${extractedText.trim().length} characters extracted`,
          );

          await this.documentRepository.update(documentId, {
            textExtracted: false,
            extractionError:
              'Scanned PDF detected - text extraction not possible',
            pageCount: pageCount,
          });

          return; // Job completes successfully but marks as scanned
        }

        // Step 5: Save extracted text and metadata to database
        await this.documentRepository.update(documentId, {
          extractedText: extractedText,
          pageCount: pageCount,
          textExtracted: true,
          extractionError: null,
        });

        this.logger.log(
          `PDF extraction completed for document ${documentId}: ` +
            `${pageCount} pages, ${extractedText.length} characters`,
        );

        // Step 6: Extract bibliographic metadata (non-blocking)
        try {
          const pdfInfo = await parser.getInfo();
          const info = pdfInfo?.info;
          const metadata =
            await this.bibliographyMetadataService.extractMetadataFromPdf(
              {
                Title: info?.Title,
                Author: info?.Author,
                CreationDate: info?.CreationDate,
              },
              extractedText,
            );
          await this.documentRepository.update(documentId, {
            bibliographicMetadata: metadata,
          });
          this.logger.log(
            `Bibliographic metadata extracted for document ${documentId}`,
          );
        } catch (metadataError) {
          this.logger.warn(
            `Bibliographic metadata extraction failed for document ${documentId}: ${metadataError instanceof Error ? metadataError.message : String(metadataError)}`,
          );
          // Non-fatal — PDF extraction itself succeeded
        }

        // Step 7: Queue document analysis job
        try {
          await this.documentRepository.update(documentId, {
            analysisStatus: 'pending',
          });
          await this.documentAnalysisQueue.add('analyze-document', {
            documentId,
            userId,
          });
          this.logger.log(
            `Queued document analysis for document ${documentId}`,
          );
        } catch (analysisQueueError) {
          this.logger.warn(
            `Failed to queue document analysis for document ${documentId}: ${analysisQueueError instanceof Error ? analysisQueueError.message : String(analysisQueueError)}`,
          );
          // Non-fatal — PDF extraction itself succeeded
        }
      } finally {
        await parser.destroy();
      }
    } catch (error) {
      // Step 6: Handle extraction errors with type narrowing
      const err =
        error instanceof Error
          ? error
          : new Error(String(error));
      const errCode = (error as NodeJS.ErrnoException)?.code;

      this.logger.error(
        `PDF extraction failed for document ${documentId} (user: ${userId}): ${err.message}`,
        err.stack,
      );

      // Determine error type for user-friendly message
      let errorMessage = 'Unknown extraction error';

      if (errCode === 'ENOENT') {
        errorMessage = 'PDF file not found on server';
      } else if (errCode === 'EACCES') {
        errorMessage = 'Permission denied reading PDF file';
      } else if (err.message.includes('Invalid PDF')) {
        errorMessage = 'Invalid or corrupted PDF file';
      } else if (err.message.includes('Encrypted')) {
        errorMessage = 'Encrypted PDF - password required';
      } else {
        errorMessage = `Extraction failed: ${err.message}`;
      }

      // Save error to database (do NOT delete document record)
      try {
        await this.documentRepository.update(documentId, {
          textExtracted: false,
          extractionError: errorMessage,
        });
      } catch (dbError) {
        this.logger.error(
          `Failed to save extraction error to database for document ${documentId}: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
        );
      }

      // Rethrow error for Bull retry logic
      throw err;
    }
  }
}
