import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'success') {
    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    this.messages.update((messages) => [...messages, toast]);
    window.setTimeout(() => this.dismiss(toast.id), 3500);
  }

  dismiss(id: string) {
    this.messages.update((messages) => messages.filter((toast) => toast.id !== id));
  }
}
