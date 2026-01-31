import {
  Injectable,
  Logger,
  BadRequestException,
  PayloadTooLargeException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResearchDocument } from '../../entities/research-document.entity';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_MIME_TYPES = ['application/pdf'];

  constructor(
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    private storageService: StorageService,
  ) {}

  /**
   * Sanitize filename to prevent injection and ensure safe storage
   * Removes special characters, limits length, preserves extension
   */
  private sanitizeFilename(originalName: string): string {
    // Remove path separators and null bytes
    let safe = originalName.replace(/[\/\\:\0]/g, '_');

    // Remove control characters and other problematic chars
    safe = safe.replace(/[<>:"|?*\x00-\x1f]/g, '');

    // Limit length (keep extension)
    const maxLength = 255;
    if (safe.length > maxLength) {
      const ext = safe.substring(safe.lastIndexOf('.'));
      const name = safe.substring(0, maxLength - ext.length);
      safe = name + ext;
    }

    // Ensure filename is not empty after sanitization
    if (!safe || safe.trim().length === 0) {
      safe = 'document.pdf';
    }

    return safe.trim();
  }

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ResearchDocument> {
    // Step 1: Validate file exists
    if (!file || !file.buffer) {
      this.logger.error(
        `Upload failed: No file provided (userId: ${userId.substring(0, 8)}...)`,
      );
      throw new BadRequestException('No file uploaded');
    }

    // Step 2: Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.logger.warn(
        `Upload rejected: File size ${file.size} bytes exceeds limit (userId: ${userId.substring(0, 8)}...)`,
      );
      throw new PayloadTooLargeException(
        'File size exceeds maximum limit of 50MB',
      );
    }

    // Step 3: Validate MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      this.logger.warn(
        `Upload rejected: Invalid MIME type "${file.mimetype}" (userId: ${userId.substring(0, 8)}...)`,
      );
      throw new BadRequestException('Only PDF files are supported');
    }

    // Step 4: Sanitize filename and generate document ID
    const sanitizedFilename = this.sanitizeFilename(file.originalname);
    const documentId = randomUUID();
    const storagePath = this.storageService.getStoragePath(userId, documentId);

    this.logger.log(
      `Starting upload: documentId=${documentId}, size=${file.size} bytes, originalName="${file.originalname}"`,
    );

    try {
      // Step 5: Ensure user directory exists
      await this.storageService.ensureUserUploadDirectory(userId);

      // Step 6: Save file to disk
      await fs.writeFile(storagePath, file.buffer);
      this.logger.log(
        `File saved: documentId=${documentId}, size=${file.size} bytes`,
      );

      // Step 7: Create database record
      const document = this.documentRepository.create({
        id: documentId,
        userId: userId,
        fileName: sanitizedFilename,
        fileSize: file.size,
        mimeType: file.mimetype,
        storagePath: storagePath,
        pageCount: null,
        textExtracted: false,
        extractionError: null,
      });

      const savedDocument = await this.documentRepository.save(document);
      this.logger.log(
        `Document created successfully: documentId=${documentId}, fileName="${sanitizedFilename}"`,
      );

      return savedDocument;
    } catch (error) {
      // Rollback: Delete file if database save failed
      try {
        await fs.unlink(storagePath);
        this.logger.warn(
          `Rollback successful: Deleted file for documentId=${documentId}`,
        );
      } catch (unlinkError) {
        this.logger.error(
          `Rollback failed: Could not delete file for documentId=${documentId}`,
          unlinkError,
        );
      }

      // Log full error details for debugging
      this.logger.error(
        `Upload failed: documentId=${documentId}, error=${error.message}`,
        error.stack,
      );

      // Determine appropriate error message
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new InternalServerErrorException(
          'Document with this ID already exists',
        );
      } else if (error.name === 'QueryFailedError') {
        throw new InternalServerErrorException(
          'Database error during upload - please try again',
        );
      } else if (error.code === 'ENOSPC') {
        throw new InternalServerErrorException(
          'Server storage full - please contact support',
        );
      }

      throw new InternalServerErrorException(
        'Failed to upload document - please try again',
      );
    }
  }
}
