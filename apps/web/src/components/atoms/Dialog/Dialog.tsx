'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  className = '',
  size = 'md',
  showCloseButton = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  useEffect(() => {
    if (open) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus dialog
      dialogRef.current?.focus();
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore previous focus
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative bg-white rounded-lg shadow-strong w-full',
          sizeStyles[size],
          'animate-in fade-in zoom-in-95 duration-standard',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-lg border-b border-border">
            {title && (
              <div className="flex-1">
                <h2
                  id="dialog-title"
                  className="text-h3 font-semibold text-text-primary"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id="dialog-description"
                    className="text-body text-text-secondary mt-xs"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-md p-xs rounded-md text-text-secondary hover:bg-muted hover:text-text-primary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-lg">{children}</div>
      </div>
    </div>
  );
};

Dialog.displayName = 'Dialog';
