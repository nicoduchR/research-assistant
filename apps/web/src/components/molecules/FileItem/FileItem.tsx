import React, { useState } from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

export interface FileItemProps {
  fileName: string;
  fileSize: string;
  status: 'ready' | 'processing' | 'error';
  onDelete?: () => void;
  className?: string;
}

export const FileItem: React.FC<FileItemProps> = ({
  fileName,
  fileSize,
  status,
  onDelete,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    ready: {
      variant: 'success' as const,
      icon: 'check_circle',
      label: 'Ready',
    },
    processing: {
      variant: 'processing' as const,
      icon: 'sync',
      label: 'Processing',
    },
    error: {
      variant: 'error' as const,
      icon: 'error',
      label: 'Error',
    },
  };

  const config = statusConfig[status];

  // Truncate filename if too long
  const truncateFileName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 4);
    return `${truncated}...${extension}`;
  };

  return (
    <div
      className={`flex items-center gap-md p-md bg-white border border-border rounded-md hover:border-primary/30 transition-all duration-fast ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="listitem"
    >
      {/* PDF Icon with colored background */}
      <div className="flex-shrink-0 w-10 h-10 bg-error/10 rounded-md flex items-center justify-center">
        <span className="material-symbols-outlined text-error text-2xl">
          picture_as_pdf
        </span>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-body font-medium text-text-primary truncate"
          title={fileName}
        >
          {truncateFileName(fileName)}
        </p>
        <p className="text-small text-text-secondary">{fileSize}</p>
      </div>

      {/* Status Badge */}
      <Badge variant={config.variant} size="sm" className="flex items-center gap-xs">
        <span
          className={`material-symbols-outlined text-sm ${
            status === 'processing' ? 'animate-spin' : ''
          }`}
        >
          {config.icon}
        </span>
        <span>{config.label}</span>
      </Badge>

      {/* Delete Button (shown on hover) */}
      {onDelete && (
        <Button
          variant="icon"
          size="sm"
          onClick={onDelete}
          className={`transition-opacity duration-fast ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label={`Delete ${fileName}`}
          icon={
            <span className="material-symbols-outlined text-error">delete</span>
          }
        />
      )}
    </div>
  );
};

FileItem.displayName = 'FileItem';
