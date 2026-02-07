import { create } from 'zustand';
import { WS_EVENTS, type ProgressEvent, type CompleteEvent, type ErrorEvent } from '@repo/types';
import { connectSocket, disconnectSocket, getSocket } from '../websocket-client';
import * as processingApi from '../api/processing';

type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';

interface SkippedDocument {
  documentId: string;
  fileName: string;
  reason: string;
}

interface ProcessingState {
  activeJobId: string | null;
  status: ProcessingStatus;
  progressPercentage: number;
  progressMessage: string | null;
  resultId: string | null;
  errorMessage: string | null;
  lastDocumentIds: string[];
  skippedDocuments: SkippedDocument[];
  processedDocumentCount: number | null;
  failureType: 'no_documents' | 'ai_error' | 'unknown' | null;
}

interface ProcessingActions {
  startProcessing: (documentIds: string[]) => Promise<void>;
  syncJobStatus: (jobId: string) => Promise<void>;
  resetProcessing: () => void;
}

type ProcessingStore = ProcessingState & ProcessingActions;

const initialState: ProcessingState = {
  activeJobId: null,
  status: 'idle',
  progressPercentage: 0,
  progressMessage: null,
  resultId: null,
  errorMessage: null,
  lastDocumentIds: [],
  skippedDocuments: [],
  processedDocumentCount: null,
  failureType: null,
};

export const useProcessingStore = create<ProcessingStore>()((set, get) => ({
  ...initialState,

  startProcessing: async (documentIds: string[]) => {
    set({ ...initialState, status: 'queued', lastDocumentIds: documentIds });

    try {
      const job = await processingApi.createProcessingJob(documentIds);
      set({ activeJobId: job.id, status: 'queued' });

      // Connect WebSocket and subscribe to events
      const socket = connectSocket();

      // Remove previous listeners to prevent accumulation on repeated calls
      socket.off(WS_EVENTS.PROCESSING_PROGRESS);
      socket.off(WS_EVENTS.PROCESSING_COMPLETE);
      socket.off(WS_EVENTS.PROCESSING_ERROR);
      socket.io.off('reconnect');

      socket.on(WS_EVENTS.PROCESSING_PROGRESS, (payload: ProgressEvent) => {
        if (payload.jobId === get().activeJobId) {
          set({
            status: 'processing',
            progressPercentage: payload.progressPercentage,
            progressMessage: payload.progressMessage,
          });
        }
      });

      socket.on(WS_EVENTS.PROCESSING_COMPLETE, (payload: CompleteEvent) => {
        if (payload.jobId === get().activeJobId) {
          set({
            status: 'completed',
            progressPercentage: 100,
            progressMessage: 'Complete',
            resultId: payload.resultId,
            skippedDocuments: payload.skippedDocuments || [],
            processedDocumentCount: payload.processedDocumentCount ?? null,
          });
        }
      });

      socket.on(WS_EVENTS.PROCESSING_ERROR, (payload: ErrorEvent) => {
        if (payload.jobId === get().activeJobId) {
          set({
            status: 'failed',
            errorMessage: payload.errorMessage,
            failureType: payload.failureType || null,
          });
        }
      });

      // Sync state on reconnection to recover missed events
      socket.io.on('reconnect', () => {
        const { activeJobId } = get();
        if (activeJobId) {
          get().syncJobStatus(activeJobId);
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to start processing';
      set({ status: 'failed', errorMessage: message });
    }
  },

  syncJobStatus: async (jobId: string) => {
    try {
      const job = await processingApi.getProcessingJob(jobId);
      set({
        activeJobId: job.id,
        status: job.status === 'completed' ? 'completed'
          : job.status === 'failed' ? 'failed'
          : job.status === 'processing' ? 'processing'
          : 'queued',
        progressPercentage: job.progressPercentage,
        progressMessage: job.progressMessage,
        resultId: job.resultId,
        errorMessage: job.errorMessage,
        skippedDocuments: job.skippedDocuments || [],
        processedDocumentCount: job.processedDocumentCount ?? null,
        failureType: job.failureType ?? null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sync job status';
      set({ status: 'failed', errorMessage: message });
    }
  },

  resetProcessing: () => {
    const socket = getSocket();
    socket.off(WS_EVENTS.PROCESSING_PROGRESS);
    socket.off(WS_EVENTS.PROCESSING_COMPLETE);
    socket.off(WS_EVENTS.PROCESSING_ERROR);
    socket.io.off('reconnect');
    disconnectSocket();
    set(initialState);
  },
}));
