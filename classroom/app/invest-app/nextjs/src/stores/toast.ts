'use client';

import { toast as sonnerToast } from 'sonner';
import { create } from 'zustand';

export type Toast = {
  message: string;
  type: 'success' | 'error';
};

type ToastStore = {
  showToast: (message: string, type: Toast['type']) => void;
};

export const useToast = create<ToastStore>(() => ({
  showToast: (message, type) => {
    sonnerToast[type](message);
  },
}));
