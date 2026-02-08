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

/**
 * Document List Item DTO
 *
 * Extended response for listing documents, includes extraction status fields.
 * Used by GET /documents endpoint.
 */
export class DocumentListItemDto extends DocumentResponseDto {
  /**
   * Number of pages in the document (null if not yet extracted)
   */
  pageCount: number | null;

  /**
   * Whether text has been successfully extracted
   */
  textExtracted: boolean;

  /**
   * Extraction error message (null if no error)
   */
  extractionError: string | null;

  /**
   * AI analysis status (null if not yet triggered)
   */
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed' | null;

  /**
   * Last update timestamp (ISO 8601 string)
   */
  updatedAt: string;
}
