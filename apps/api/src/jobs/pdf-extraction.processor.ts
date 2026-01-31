import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';
import { ResearchDocument } from '../entities/research-document.entity';
import * as fs from 'fs/promises';
const pdfParse = require('pdf-parse');

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

      // Step 2: Parse PDF using pdf-parse
      const pdfData = await pdfParse(pdfBuffer);

      // Step 3: Extract text and page count
      const extractedText = pdfData.text;
      const pageCount = pdfData.numpages;

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
    } catch (error) {
      // Step 6: Handle extraction errors
      this.logger.error(
        `PDF extraction failed for document ${documentId} (user: ${userId}): ${error.message}`,
        error.stack,
      );

      // Determine error type for user-friendly message
      let errorMessage = 'Unknown extraction error';

      if (error.code === 'ENOENT') {
        errorMessage = 'PDF file not found on server';
      } else if (error.code === 'EACCES') {
        errorMessage = 'Permission denied reading PDF file';
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = 'Invalid or corrupted PDF file';
      } else if (error.message.includes('Encrypted')) {
        errorMessage = 'Encrypted PDF - password required';
      } else {
        errorMessage = `Extraction failed: ${error.message}`;
      }

      // Save error to database (do NOT delete document record)
      await this.documentRepository.update(documentId, {
        textExtracted: false,
        extractionError: errorMessage,
      });

      // Rethrow error for BullMQ retry logic
      throw error;
    }
  }
}
