// WebSocket event names
export const WS_EVENTS = {
  PROCESSING_PROGRESS: 'processing:progress',
  PROCESSING_COMPLETE: 'processing:complete',
  PROCESSING_ERROR: 'processing:error',
  ANALYSIS_PROGRESS: 'analysis:progress',
  ANALYSIS_COMPLETE: 'analysis:complete',
  ANALYSIS_ERROR: 'analysis:error',
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

// Document analysis WebSocket event payloads
export interface AnalysisProgressEvent {
  documentId: string;
  percentage: number;
  message: string;
  timestamp: string;
}

export interface AnalysisCompleteEvent {
  documentId: string;
  timestamp: string;
}

export interface AnalysisErrorEvent {
  documentId: string;
  error: string;
  timestamp: string;
}
