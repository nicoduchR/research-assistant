// WebSocket event names
export const WS_EVENTS = {
  PROCESSING_PROGRESS: 'processing:progress',
  PROCESSING_COMPLETE: 'processing:complete',
  PROCESSING_ERROR: 'processing:error',
} as const;

// WebSocket event payloads
export interface ProgressEvent {
  jobId: string;
  progressPercentage: number;
  progressMessage: string;
  timestamp: string;
}

export interface CompleteEvent {
  jobId: string;
  resultId: string;
  timestamp: string;
  skippedDocuments?: Array<{
    documentId: string;
    fileName: string;
    reason: string;
  }>;
  processedDocumentCount?: number;
}

export interface ErrorEvent {
  jobId: string;
  errorMessage: string;
  timestamp: string;
  failureType?: 'no_documents' | 'ai_error' | 'unknown';
}
