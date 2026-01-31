/**
 * Document Response DTO
 *
 * Defines the response structure for document upload endpoints.
 * This ensures type safety and consistent API responses.
 *
 * Fields are in camelCase to match API naming convention.
 * Internal fields (storagePath, userId) are excluded from responses for security.
 */
export class DocumentResponseDto {
  /**
   * Unique document identifier (UUID)
   */
  id: string;

  /**
   * Original filename (sanitized for security)
   */
  fileName: string;

  /**
   * File size in bytes
   */
  fileSize: number;

  /**
   * MIME type (e.g., "application/pdf")
   */
  mimeType: string;

  /**
   * Upload timestamp (ISO 8601 string)
   */
  uploadedAt: string;
}
