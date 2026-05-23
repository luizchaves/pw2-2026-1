'use client';

import { createContext, useContext, useState } from 'react';

type VisibilityContextValue = {
  showValues: boolean;
  handleToggleShowValues: () => void;
};

const VisibilityContext = createContext<VisibilityContextValue | null>(null);

export function VisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showValues, setShowValues] = useState(true);

  const handleToggleShowValues = () => setShowValues((v) => !v);

  return (
    <VisibilityContext.Provider value={{ showValues, handleToggleShowValues }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const ctx = useContext(VisibilityContext);
  if (!ctx)
    throw new Error('useVisibility must be used within VisibilityProvider');
  return ctx;
}
