import { create } from 'zustand';
import { Document } from '@repo/types';
import * as documentsApi from '../api/documents';

export interface UploadState {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  file?: File;
}

interface DocumentState {
  documents: Document[];
  uploads: Record<string, UploadState>;
  isLoading: boolean;
  error: string | null;
}

interface DocumentActions {
  fetchDocuments: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  removeUpload: (fileId: string) => void;
  retryUpload: (fileId: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

type DocumentStore = DocumentState & DocumentActions;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const useDocumentStore = create<DocumentStore>()((set, get) => ({
  documents: [],
  uploads: {},
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await documentsApi.listDocuments();
      set({ documents, isLoading: false, error: null });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to load documents';
      console.error('Failed to fetch documents:', error);
      set({ isLoading: false, error: message });
    }
  },

  uploadFiles: async (files: File[]) => {
    const validFiles: File[] = [];
    const rejections: string[] = [];

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        rejections.push(`non-pdf:${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejections.push(`too-large:${file.name}`);
        continue;
      }
      validFiles.push(file);
    }

    // Initialize upload states for valid files
    const newUploads: Record<string, UploadState> = {};
    for (const file of validFiles) {
      const fileId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      newUploads[fileId] = {
        fileId,
        fileName: file.name,
        progress: 0,
        status: 'pending',
        file,
      };
    }

    set((state) => ({
      uploads: { ...state.uploads, ...newUploads },
    }));

    // Upload all valid files in parallel
    const uploadPromises = Object.entries(newUploads).map(
      async ([fileId, uploadState]) => {
        set((state) => ({
          uploads: {
            ...state.uploads,
            [fileId]: { ...state.uploads[fileId]!, status: 'uploading', progress: 0 },
          },
        }));

        try {
          const document = await documentsApi.uploadDocument(
            uploadState.file!,
            (progress) => {
              set((state) => ({
                uploads: {
                  ...state.uploads,
                  [fileId]: { ...state.uploads[fileId]!, progress },
                },
              }));
            },
          );

          set((state) => ({
            documents: [document, ...state.documents],
            uploads: {
              ...state.uploads,
              [fileId]: {
                ...state.uploads[fileId]!,
                status: 'completed',
                progress: 100,
                file: undefined,
              },
            },
          }));

          return { status: 'fulfilled' as const, fileId };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Upload failed';
          set((state) => ({
            uploads: {
              ...state.uploads,
              [fileId]: {
                ...state.uploads[fileId]!,
                status: 'error',
                error: message,
              },
            },
          }));

          return { status: 'rejected' as const, fileId, reason: message };
        }
      },
    );

    await Promise.allSettled(uploadPromises);

    // Refetch documents to get latest state (extraction status may have changed)
    await get().fetchDocuments();
  },

  removeUpload: (fileId: string) => {
    set((state) => {
      const { [fileId]: _, ...rest } = state.uploads;
      return { uploads: rest };
    });
  },

  retryUpload: async (fileId: string) => {
    const upload = get().uploads[fileId];
    if (!upload || !upload.file) return;

    const file = upload.file;

    // Reset upload state
    set((state) => ({
      uploads: {
        ...state.uploads,
        [fileId]: { ...state.uploads[fileId]!, status: 'uploading', progress: 0, error: undefined },
      },
    }));

    try {
      const document = await documentsApi.uploadDocument(file, (progress) => {
        set((state) => ({
          uploads: {
            ...state.uploads,
            [fileId]: { ...state.uploads[fileId]!, progress },
          },
        }));
      });

      set((state) => ({
        documents: [document, ...state.documents],
        uploads: {
          ...state.uploads,
          [fileId]: {
            ...state.uploads[fileId]!,
            status: 'completed',
            progress: 100,
            file: undefined,
          },
        },
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Upload failed';
      set((state) => ({
        uploads: {
          ...state.uploads,
          [fileId]: {
            ...state.uploads[fileId]!,
            status: 'error',
            error: message,
          },
        },
      }));
    }
  },

  deleteDocument: async (id: string) => {
    set({ error: null });
    try {
      await documentsApi.deleteDocument(id);
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete document';
      console.error('Failed to delete document:', error);
      set({ error: message });
      throw error;
    }
  },
}));
