'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ title, onClose, children }: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-lg rounded-3xl bg-white p-8 shadow-xl sm:max-w-lg"
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
