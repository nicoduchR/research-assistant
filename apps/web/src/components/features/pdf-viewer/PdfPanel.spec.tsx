import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { PdfPanel } from './PdfPanel';

// Mock PdfViewer — it depends on react-pdf which needs a worker
jest.mock('./PdfViewer', () => ({
  PdfViewer: () => <div data-testid="pdf-viewer-mock">PDF Viewer</div>,
}));

// Reset stores between tests
beforeEach(() => {
  usePdfViewerStore.getState().reset();
  useToastStore.setState({ toasts: [] });
});

function openTestDocument(page = 1, totalPages = 24) {
  usePdfViewerStore.getState().openViewer('doc-1', 'test-document.pdf', page);
  usePdfViewerStore.getState().setTotalPages(totalPages);
}

describe('PdfPanel', () => {
  it('renders nothing when viewer is closed', () => {
    const { container } = render(<PdfPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders panel with document name when viewer is open', () => {
    openTestDocument();
    render(<PdfPanel />);
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });

  it('hides navigation toolbar while loading (totalPages is null)', () => {
    usePdfViewerStore.getState().openViewer('doc-1', 'test.pdf');
    // totalPages is null — toolbar should not render
    render(<PdfPanel />);
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  describe('page navigation', () => {
    beforeEach(() => {
      openTestDocument(5, 24);
    });

    it('shows current page and total pages', () => {
      render(<PdfPanel />);
      expect(screen.getByLabelText('Go to page')).toHaveTextContent('5');
      expect(screen.getByText('/ 24')).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      render(<PdfPanel />);
      await userEvent.click(screen.getByLabelText('Next page'));
      expect(usePdfViewerStore.getState().currentPage).toBe(6);
    });

    it('navigates to previous page', async () => {
      render(<PdfPanel />);
      await userEvent.click(screen.getByLabelText('Previous page'));
      expect(usePdfViewerStore.getState().currentPage).toBe(4);
    });

    it('disables previous button on first page', () => {
      openTestDocument(1, 24);
      render(<PdfPanel />);
      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });

    it('disables next button on last page', () => {
      openTestDocument(24, 24);
      render(<PdfPanel />);
      expect(screen.getByLabelText('Next page')).toBeDisabled();
    });

    it('enables both buttons on middle page', () => {
      render(<PdfPanel />);
      expect(screen.getByLabelText('Previous page')).toBeEnabled();
      expect(screen.getByLabelText('Next page')).toBeEnabled();
    });
  });

  describe('page input', () => {
    beforeEach(() => {
      openTestDocument(5, 24);
    });

    it('opens input on click and navigates on Enter', async () => {
      const user = userEvent.setup();
      render(<PdfPanel />);

      await user.click(screen.getByLabelText('Go to page'));
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();

      await user.clear(input);
      await user.type(input, '15');
      await user.keyboard('{Enter}');

      expect(usePdfViewerStore.getState().currentPage).toBe(15);
    });

    it('shows error toast for out-of-range page number', async () => {
      const user = userEvent.setup();
      render(<PdfPanel />);

      await user.click(screen.getByLabelText('Go to page'));
      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '99');
      await user.keyboard('{Enter}');

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0]!.message).toBe('Invalid page number');
      expect(toasts[0]!.type).toBe('error');
      // Page should remain unchanged
      expect(usePdfViewerStore.getState().currentPage).toBe(5);
    });

    it('shows error toast for zero page number', async () => {
      const user = userEvent.setup();
      render(<PdfPanel />);

      await user.click(screen.getByLabelText('Go to page'));
      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '0');
      await user.keyboard('{Enter}');

      expect(useToastStore.getState().toasts).toHaveLength(1);
      expect(usePdfViewerStore.getState().currentPage).toBe(5);
    });

    it('cancels editing on Escape', async () => {
      const user = userEvent.setup();
      render(<PdfPanel />);

      await user.click(screen.getByLabelText('Go to page'));
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Go to page')).toBeInTheDocument();
    });
  });

  describe('zoom controls', () => {
    beforeEach(() => {
      openTestDocument(1, 24);
    });

    it('shows zoom percentage', () => {
      render(<PdfPanel />);
      expect(screen.getByLabelText('Reset zoom')).toHaveTextContent('100%');
    });

    it('zooms in by 25', async () => {
      render(<PdfPanel />);
      await userEvent.click(screen.getByLabelText('Zoom in'));
      expect(usePdfViewerStore.getState().zoom).toBe(125);
    });

    it('zooms out by 25', async () => {
      render(<PdfPanel />);
      await userEvent.click(screen.getByLabelText('Zoom out'));
      expect(usePdfViewerStore.getState().zoom).toBe(75);
    });

    it('resets zoom to 100', async () => {
      usePdfViewerStore.getState().setZoom(150);
      render(<PdfPanel />);
      await userEvent.click(screen.getByLabelText('Reset zoom'));
      expect(usePdfViewerStore.getState().zoom).toBe(100);
    });

    it('disables zoom out at minimum (50)', () => {
      usePdfViewerStore.getState().setZoom(50);
      render(<PdfPanel />);
      expect(screen.getByLabelText('Zoom out')).toBeDisabled();
    });

    it('disables zoom in at maximum (200)', () => {
      usePdfViewerStore.getState().setZoom(200);
      render(<PdfPanel />);
      expect(screen.getByLabelText('Zoom in')).toBeDisabled();
    });
  });

  describe('close button', () => {
    it('closes the viewer and resets state', async () => {
      openTestDocument(5, 24);
      usePdfViewerStore.getState().setZoom(150);
      render(<PdfPanel />);

      await userEvent.click(screen.getByLabelText('Close PDF viewer'));
      const state = usePdfViewerStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.zoom).toBe(100);
      expect(state.currentPage).toBe(1);
    });
  });
});
