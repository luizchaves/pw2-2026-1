'use client';

import { useToast } from '@/stores/toast';

export default function ToastViewport() {
  const toasts = useToast((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
