import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';
import { ResearchDocument } from '../entities/research-document.entity';
import * as fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

interface PdfExtractionJobPayload {
  documentId: string;
  userId: string;
  storagePath: string;
}

@Processor('pdf-extraction')
export class PdfExtractionProcessor {
  private readonly logger = new Logger(PdfExtractionProcessor.name);
  private readonly SCANNED_PDF_THRESHOLD = 100; // Characters

  constructor(
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
  ) {}

  @Process('extract-text')
  async handleExtraction(job: Job<PdfExtractionJobPayload>): Promise<void> {
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
