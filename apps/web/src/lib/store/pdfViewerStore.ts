import { create } from 'zustand';

interface PdfViewerState {
  isOpen: boolean;
  documentId: string | null;
  documentName: string | null;
  currentPage: number;
  totalPages: number | null;
  isLoading: boolean;
  error: string | null;
  targetPage: number | null;
}

interface PdfViewerActions {
  openViewer: (documentId: string, documentName: string, page?: number) => void;
  closeViewer: () => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type PdfViewerStore = PdfViewerState & PdfViewerActions;

const initialState: PdfViewerState = {
  isOpen: false,
  documentId: null,
  documentName: null,
  currentPage: 1,
  totalPages: null,
  isLoading: false,
  error: null,
  targetPage: null,
};

export const usePdfViewerStore = create<PdfViewerStore>()((set) => ({
  ...initialState,

  openViewer: (documentId: string, documentName: string, page?: number) => {
    set({
      isOpen: true,
      documentId,
      documentName,
      currentPage: page ?? 1,
      targetPage: page ?? null,
      totalPages: null,
      isLoading: true,
      error: null,
    });
  },

  closeViewer: () => {
    set({
      isOpen: false,
      documentId: null,
      documentName: null,
      currentPage: 1,
      totalPages: null,
      isLoading: false,
      error: null,
      targetPage: null,
    });
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  setTotalPages: (totalPages: number) => {
    set({ totalPages, isLoading: false, error: null });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  reset: () => {
    set(initialState);
  },
}));
