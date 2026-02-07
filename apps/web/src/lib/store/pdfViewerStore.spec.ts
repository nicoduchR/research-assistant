import { usePdfViewerStore } from './pdfViewerStore';

// Reset store between tests
beforeEach(() => {
  usePdfViewerStore.getState().reset();
});

describe('pdfViewerStore', () => {
  describe('setZoom', () => {
    it('sets zoom to valid value', () => {
      usePdfViewerStore.getState().setZoom(150);
      expect(usePdfViewerStore.getState().zoom).toBe(150);
    });

    it('clamps zoom to minimum of 50', () => {
      usePdfViewerStore.getState().setZoom(10);
      expect(usePdfViewerStore.getState().zoom).toBe(50);
    });

    it('clamps zoom to maximum of 200', () => {
      usePdfViewerStore.getState().setZoom(999);
      expect(usePdfViewerStore.getState().zoom).toBe(200);
    });

    it('clamps negative zoom to 50', () => {
      usePdfViewerStore.getState().setZoom(-100);
      expect(usePdfViewerStore.getState().zoom).toBe(50);
    });

    it('allows exact boundary values 50 and 200', () => {
      usePdfViewerStore.getState().setZoom(50);
      expect(usePdfViewerStore.getState().zoom).toBe(50);
      usePdfViewerStore.getState().setZoom(200);
      expect(usePdfViewerStore.getState().zoom).toBe(200);
    });
  });

  describe('setPage', () => {
    beforeEach(() => {
      // Open a document and set totalPages
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 1);
      usePdfViewerStore.getState().setTotalPages(24);
    });

    it('sets page to valid value', () => {
      usePdfViewerStore.getState().setPage(10);
      expect(usePdfViewerStore.getState().currentPage).toBe(10);
    });

    it('clamps page to minimum of 1', () => {
      usePdfViewerStore.getState().setPage(0);
      expect(usePdfViewerStore.getState().currentPage).toBe(1);
    });

    it('clamps negative page to 1', () => {
      usePdfViewerStore.getState().setPage(-5);
      expect(usePdfViewerStore.getState().currentPage).toBe(1);
    });

    it('clamps page to totalPages maximum', () => {
      usePdfViewerStore.getState().setPage(99);
      expect(usePdfViewerStore.getState().currentPage).toBe(24);
    });

    it('allows exact boundary values 1 and totalPages', () => {
      usePdfViewerStore.getState().setPage(1);
      expect(usePdfViewerStore.getState().currentPage).toBe(1);
      usePdfViewerStore.getState().setPage(24);
      expect(usePdfViewerStore.getState().currentPage).toBe(24);
    });
  });

  describe('openViewer', () => {
    it('opens viewer with default page 1 and zoom 100', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
      const state = usePdfViewerStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.documentId).toBe('doc-1');
      expect(state.currentPage).toBe(1);
      expect(state.zoom).toBe(100);
      expect(state.isLoading).toBe(true);
    });

    it('opens viewer at specified page', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 5);
      expect(usePdfViewerStore.getState().currentPage).toBe(5);
    });

    it('resets zoom to 100 when opening a new document', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
      usePdfViewerStore.getState().setTotalPages(10);
      usePdfViewerStore.getState().setZoom(150);
      expect(usePdfViewerStore.getState().zoom).toBe(150);

      usePdfViewerStore.getState().openViewer('doc-2', 'other.pdf', 3);
      expect(usePdfViewerStore.getState().zoom).toBe(100);
    });

    it('preserves zoom when switching pages in the same document', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
      usePdfViewerStore.getState().setTotalPages(10);
      usePdfViewerStore.getState().setZoom(150);

      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 5);
      expect(usePdfViewerStore.getState().zoom).toBe(150);
      expect(usePdfViewerStore.getState().currentPage).toBe(5);
    });

    it('clamps page to totalPages on same-document switch', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
      usePdfViewerStore.getState().setTotalPages(10);

      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 99);
      expect(usePdfViewerStore.getState().currentPage).toBe(10);
    });

    it('queues targetPage when same document is still loading', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
      // totalPages is still null (loading)

      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 5);
      expect(usePdfViewerStore.getState().targetPage).toBe(5);
    });
  });

  describe('closeViewer', () => {
    it('resets all state including zoom', () => {
      usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf', 5);
      usePdfViewerStore.getState().setTotalPages(24);
      usePdfViewerStore.getState().setZoom(150);

      usePdfViewerStore.getState().closeViewer();
      const state = usePdfViewerStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.documentId).toBeNull();
      expect(state.currentPage).toBe(1);
      expect(state.zoom).toBe(100);
      expect(state.totalPages).toBeNull();
    });
  });
});
