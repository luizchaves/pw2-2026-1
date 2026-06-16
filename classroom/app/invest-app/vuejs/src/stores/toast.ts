import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error';

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
  }),
  actions: {
    showToast(message: string, type: ToastType) {
      const id = crypto.randomUUID();
      this.messages.push({ id, message, type });
      window.setTimeout(() => this.dismiss(id), 3200);
    },
    dismiss(id: string) {
      this.messages = this.messages.filter((toast) => toast.id !== id);
    },
  },
});
