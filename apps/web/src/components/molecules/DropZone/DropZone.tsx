import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

export interface DropZoneProps {
  onDrop: (files: FileList) => void;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  disabled = false,
  accept = '.pdf',
  multiple = true,
  maxSize = 10,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files && e.target.files.length > 0) {
      onDrop(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  const baseStyles =
    'relative flex flex-col items-center justify-center p-xl border-2 border-dashed rounded-lg transition-all duration-fast cursor-pointer';

  const stateStyles = disabled
    ? 'border-border bg-muted opacity-50 cursor-not-allowed'
    : isDragOver
    ? 'border-primary bg-primary/5'
    : 'border-border hover:border-primary/50 hover:bg-primary/5';

  return (
    <div
      className={`${baseStyles} ${stateStyles} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="File upload drop zone"
      aria-disabled={disabled}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Upload Icon */}
      <div className="mb-md">
        <span
          className={`material-symbols-outlined text-6xl ${
            isDragOver ? 'text-primary' : 'text-text-secondary'
          }`}
        >
          cloud_upload
        </span>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-body font-medium text-text-primary mb-xs">
          {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-small text-text-secondary mb-xs">or</p>
        <p className="text-small text-primary font-medium">Browse files</p>
      </div>

      {/* File requirements */}
      <div className="mt-md text-center">
        <p className="text-small text-text-secondary">
          Accepted formats: {accept.split(',').join(', ')}
        </p>
        <p className="text-small text-text-secondary">
          Max size: {maxSize}MB {multiple ? '(Multiple files allowed)' : ''}
        </p>
      </div>
    </div>
  );
};

DropZone.displayName = 'DropZone';
