'use client';

import { create } from 'zustand';

type VisibilityStore = {
  showValues: boolean;
  handleToggleShowValues: () => void;
};

export const useVisibility = create<VisibilityStore>((set) => ({
  showValues: true,
  handleToggleShowValues: () => set((state) => ({ showValues: !state.showValues })),
}));
