import React, { useEffect, useState } from 'react';
import { Button } from '../../atoms/Button/Button';

export interface ToastProps {
  message: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  autoDismiss?: boolean;
  duration?: number; // in milliseconds
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  type = 'info',
  onClose,
  autoDismiss = true,
  duration = 5000,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto dismiss
    if (autoDismiss && onClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onClose, handleClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      textColor: 'text-success',
      icon: 'check_circle',
    },
    error: {
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      textColor: 'text-error',
      icon: 'error',
    },
    info: {
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      textColor: 'text-primary',
      icon: 'info',
    },
    warning: {
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      textColor: 'text-warning',
      icon: 'warning',
    },
  };

  const config = typeConfig[type];

  const animationClasses = isExiting
    ? 'animate-out opacity-0 translate-y-4'
    : isVisible
    ? 'animate-in opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4';

  return (
    <div
      className={`flex items-start gap-md p-md bg-white border ${config.borderColor} rounded-lg shadow-medium transition-all duration-standard ${animationClasses} ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <span className={`material-symbols-outlined ${config.textColor}`}>
          {config.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-text-primary">{message}</p>
        {description && (
          <p className="text-small text-text-secondary mt-xs">{description}</p>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          variant="icon"
          size="sm"
          onClick={handleClose}
          className="flex-shrink-0"
          icon={
            <span className="material-symbols-outlined text-text-secondary">
              close
            </span>
          }
          aria-label="Close notification"
        />
      )}
    </div>
  );
};

Toast.displayName = 'Toast';
