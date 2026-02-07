import { create } from 'zustand';
import { WS_EVENTS, type ProgressEvent, type CompleteEvent, type ErrorEvent } from '@repo/types';
import { connectSocket, disconnectSocket, getSocket } from '../websocket-client';
import * as processingApi from '../api/processing';

type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';

interface ProcessingState {
  activeJobId: string | null;
  status: ProcessingStatus;
  progressPercentage: number;
  progressMessage: string | null;
  resultId: string | null;
  errorMessage: string | null;
  lastDocumentIds: string[];
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
          });
        }
      });

      socket.on(WS_EVENTS.PROCESSING_ERROR, (payload: ErrorEvent) => {
        if (payload.jobId === get().activeJobId) {
          set({
            status: 'failed',
            errorMessage: payload.errorMessage,
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
