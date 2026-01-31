import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadBasePath: string;

  constructor(private configService: ConfigService) {
    this.uploadBasePath = this.configService.get<string>(
      'UPLOAD_BASE_PATH',
      './uploads',
    );
  }

  /**
   * Ensure base uploads directory exists
   */
  async ensureBaseDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadBasePath, { recursive: true });
      this.logger.log(`Base upload directory ensured: ${this.uploadBasePath}`);
    } catch (error) {
      this.logger.error(
        `Failed to create base upload directory: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Ensure user-specific upload directory exists
   * Creates: /uploads/{userId}/
   * @throws Error if userId is invalid or contains path traversal
   */
  async ensureUserUploadDirectory(userId: string): Promise<string> {
    // Validate userId to prevent path traversal attacks
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId: must be a non-empty string');
    }

    // Check for path traversal attempts
    if (userId.includes('..') || userId.includes('/') || userId.includes('\\')) {
      throw new Error('Invalid userId: path traversal detected');
    }

    // Validate UUID format (loose check - basic pattern matching)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(userId)) {
      throw new Error('Invalid userId: must be a valid UUID format');
    }

    const userDir = path.join(this.uploadBasePath, userId);

    try {
      await fs.mkdir(userDir, { recursive: true });
      return userDir;
    } catch (error) {
      this.logger.error(
        `Failed to create user directory for ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get full storage path for a document
   * Pattern: /uploads/{userId}/{documentId}.pdf
   */
  getStoragePath(userId: string, documentId: string): string {
    return path.join(this.uploadBasePath, userId, `${documentId}.pdf`);
  }

  /**
   * Get absolute storage path
   */
  getAbsoluteStoragePath(userId: string, documentId: string): string {
    return path.resolve(this.getStoragePath(userId, documentId));
  }

  /**
   * Get the configured upload base path
   * Useful for debugging and testing
   */
  getUploadBasePath(): string {
    return this.uploadBasePath;
  }
}
