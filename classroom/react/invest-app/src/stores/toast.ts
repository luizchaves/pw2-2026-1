'use client';

import { create } from 'zustand';

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error';
};

type ToastStore = {
  toasts: Toast[];
  showToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
};

const TOAST_DURATION_MS = 3000;

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  showToast: (message, type) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, TOAST_DURATION_MS);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
