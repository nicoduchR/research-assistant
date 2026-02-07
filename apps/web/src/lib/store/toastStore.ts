import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  message: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type'], description?: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (message, type, description) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type, description }] }));
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
