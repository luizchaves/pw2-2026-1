'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteInvestment as deleteStoredInvestment,
  getInvestments,
  getInvestmentTypes,
  saveInvestment as saveStoredInvestment,
} from '@/service/storage';
import type { Investment, InvestmentType } from '@/types/investment';

type InvestmentsContextValue = {
  investments: Investment[];
  investmentTypes: InvestmentType[];
  isLoading: boolean;
  error: string | null;
  saveInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
};

const InvestmentsContext = createContext<InvestmentsContextValue | null>(null);

export function InvestmentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [types, storedInvestments] = await Promise.all([
          getInvestmentTypes(),
          getInvestments(),
        ]);

        if (!isMounted) return;

        setInvestmentTypes(types);
        setInvestments(storedInvestments);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os investimentos',
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveInvestment = async (investment: Investment) => {
    const storedInvestment = await saveStoredInvestment(investment);
    setInvestments((prev) =>
      prev.some((i) => i.id === storedInvestment.id)
        ? prev.map((i) => (i.id === storedInvestment.id ? storedInvestment : i))
        : [...prev, storedInvestment],
    );
  };

  const deleteInvestment = async (id: string) => {
    await deleteStoredInvestment(id);
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InvestmentsContext.Provider
      value={{
        investments,
        investmentTypes,
        isLoading,
        error,
        saveInvestment,
        deleteInvestment,
      }}
    >
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
