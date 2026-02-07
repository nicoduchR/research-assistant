'use client';

import React from 'react';
import { Toast } from './Toast';
import { useToastStore } from '@/src/lib/store/toastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-sm max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          description={toast.description}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          autoDismiss={true}
          duration={5000}
        />
      ))}
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';
