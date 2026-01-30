import React, { useState } from 'react';
import { Button } from '../../atoms/Button/Button';

export interface PDFViewerProps {
  fileName: string;
  currentPage?: number;
  totalPages?: number;
  pdfUrl?: string;
  onPageChange?: (page: number) => void;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileName,
  currentPage: controlledPage,
  totalPages = 1,
  pdfUrl,
  onPageChange,
  onClose,
  onDownload,
  className = '',
}) => {
  const [zoom, setZoom] = useState(100);
  const [internalPage, setInternalPage] = useState(1);

  const currentPage = controlledPage ?? internalPage;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (onPageChange) {
        onPageChange(newPage);
      } else {
        setInternalPage(newPage);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  return (
    <div
      className={`flex flex-col bg-white border border-border rounded-lg shadow-subtle h-full ${className}`}
      role="region"
      aria-label="PDF viewer"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-md border-b border-border bg-muted">
        <div className="flex items-center gap-md flex-1 min-w-0">
          <span className="material-symbols-outlined text-error text-2xl flex-shrink-0">
            picture_as_pdf
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="text-body font-medium text-text-primary truncate"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="text-small text-text-secondary">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="icon"
            size="sm"
            onClick={onClose}
            aria-label="Close PDF viewer"
            icon={<span className="material-symbols-outlined">close</span>}
          />
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-sm border-b border-border bg-white">
        {/* Pagination Controls */}
        <div className="flex items-center gap-xs">
          <Button
            variant="icon"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            icon={
              <span className="material-symbols-outlined">chevron_left</span>
            }
          />
          <div className="flex items-center gap-xs px-sm">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
              className="w-12 text-center text-small border border-border rounded px-xs py-xs focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Current page"
            />
            <span className="text-small text-text-secondary">/ {totalPages}</span>
          </div>
          <Button
            variant="icon"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            icon={
              <span className="material-symbols-outlined">chevron_right</span>
            }
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-xs">
          <Button
            variant="icon"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            aria-label="Zoom out"
            icon={<span className="material-symbols-outlined">zoom_out</span>}
          />
          <button
            onClick={handleZoomReset}
            className="px-sm py-xs text-small text-text-primary hover:text-primary transition-colors duration-fast"
            aria-label={`Zoom level: ${zoom}%`}
          >
            {zoom}%
          </button>
          <Button
            variant="icon"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            aria-label="Zoom in"
            icon={<span className="material-symbols-outlined">zoom_in</span>}
          />
        </div>

        {/* Download Button */}
        {onDownload && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownload}
            icon={<span className="material-symbols-outlined">download</span>}
          >
            Download
          </Button>
        )}
      </div>

      {/* PDF Preview Area */}
      <div className="flex-1 overflow-auto bg-muted p-lg">
        <div
          className="mx-auto bg-white shadow-medium"
          style={{
            width: `${zoom}%`,
            minHeight: '100%',
          }}
        >
          {pdfUrl ? (
            <div className="relative w-full h-full">
              {/* Placeholder for PDF rendering */}
              {/* In production, this would use react-pdf or similar library */}
              <div className="flex items-center justify-center h-full min-h-[600px] text-text-secondary">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-md">
                    description
                  </span>
                  <p className="text-body">
                    PDF rendering will be implemented with react-pdf library
                  </p>
                  <p className="text-small mt-sm">URL: {pdfUrl}</p>
                  <p className="text-small">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[600px] text-text-secondary">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl mb-md">
                  insert_drive_file
                </span>
                <p className="text-body">No PDF loaded</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PDFViewer.displayName = 'PDFViewer';
