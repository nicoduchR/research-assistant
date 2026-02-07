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
  zoom: number;
  retryCount: number;
}

interface PdfViewerActions {
  openViewer: (documentId: string, documentName: string, page?: number) => void;
  closeViewer: () => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setZoom: (zoom: number) => void;
  clearTargetPage: () => void;
  retryLoad: () => void;
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
  zoom: 100,
  retryCount: 0,
};

export const usePdfViewerStore = create<PdfViewerStore>()((set) => ({
  ...initialState,

  openViewer: (documentId: string, documentName: string, page?: number) => {
    const state = usePdfViewerStore.getState();
    if (state.isOpen && state.documentId === documentId) {
      // Same document — just switch page, no reload needed
      if (state.totalPages !== null) {
        set({
          currentPage: Math.min(page ?? 1, state.totalPages),
          targetPage: null,
        });
      } else {
        // Still loading — queue page for onLoadSuccess
        set({ targetPage: page ?? 1 });
      }
      return;
    }
    set({
      isOpen: true,
      documentId,
      documentName,
      currentPage: page ?? 1,
      targetPage: page ?? null,
      totalPages: null,
      isLoading: true,
      error: null,
      zoom: 100,
      retryCount: 0,
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
      zoom: 100,
      retryCount: 0,
    });
  },

  setPage: (page: number) => {
    const { totalPages } = usePdfViewerStore.getState();
    const clamped = Math.max(1, totalPages !== null ? Math.min(page, totalPages) : page);
    set({ currentPage: clamped });
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

  setZoom: (zoom: number) => {
    const clamped = Math.max(50, Math.min(200, zoom));
    set({ zoom: clamped });
  },

  clearTargetPage: () => {
    set({ targetPage: null });
  },

  retryLoad: () => {
    set((state) => ({
      error: null,
      isLoading: true,
      retryCount: state.retryCount + 1,
    }));
  },

  reset: () => {
    set(initialState);
  },
}));
