'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { investments as initialInvestments } from '@/data/investments';
import type { Investment } from '@/types/investment';

type InvestmentsContextValue = {
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
};

const InvestmentsContext = createContext<InvestmentsContextValue | null>(null);

export function InvestmentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    setInvestments(initialInvestments);
  }, []);

  return (
    <InvestmentsContext.Provider value={{ investments, setInvestments }}>
      {children}
    </InvestmentsContext.Provider>
  );
}

export function useInvestments() {
  const ctx = useContext(InvestmentsContext);
  if (!ctx)
    throw new Error('useInvestments must be used within InvestmentsProvider');
  return ctx;
}
