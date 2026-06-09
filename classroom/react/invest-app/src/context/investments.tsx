'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import {
  deleteInvestment as deleteStoredInvestment,
  getInvestments,
  getInvestmentTypes,
  saveInvestment as saveStoredInvestment,
} from '@/service/api/investments';
import type { Investment, InvestmentType } from '@/types/investment';
import { useAuth } from '@/context/auth';

type InvestmentsContextValue = {
  investments: Investment[];
  investmentTypes: InvestmentType[];
  isLoading: boolean;
  error: string | null;
  saveInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
};

const InvestmentsContext = createContext<InvestmentsContextValue | null>(null);

const investmentKeys = {
  all: (userId: string) => ['investments', userId] as const,
  types: ['investment-types'] as const,
};

export function InvestmentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const investmentTypesQuery = useQuery({
    queryKey: investmentKeys.types,
    queryFn: getInvestmentTypes,
  });
  const investmentsQuery = useQuery({
    queryKey: investmentKeys.all(userId),
    queryFn: getInvestments,
    enabled: Boolean(userId),
  });

  const saveMutation = useMutation({
    mutationFn: saveStoredInvestment,
    onSuccess: (storedInvestment) => {
      queryClient.setQueryData<Investment[]>(
        investmentKeys.all(userId),
        (prev = []) =>
          prev.some((i) => i.id === storedInvestment.id)
            ? prev.map((i) =>
                i.id === storedInvestment.id ? storedInvestment : i,
              )
            : [...prev, storedInvestment],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStoredInvestment,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Investment[]>(
        investmentKeys.all(userId),
        (prev = []) => prev.filter((i) => i.id !== id),
      );
    },
  });

  const saveInvestment = async (investment: Investment) => {
    await saveMutation.mutateAsync(investment);
  };

  const deleteInvestment = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const loadError = investmentsQuery.error ?? investmentTypesQuery.error;

  return (
    <InvestmentsContext.Provider
      value={{
        investments: investmentsQuery.data ?? [],
        investmentTypes: investmentTypesQuery.data ?? [],
        isLoading: investmentsQuery.isLoading || investmentTypesQuery.isLoading,
        error: loadError instanceof Error ? loadError.message : null,
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
