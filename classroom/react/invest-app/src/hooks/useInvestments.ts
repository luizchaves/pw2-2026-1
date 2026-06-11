'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Investment } from '@/schemas/investment';
import {
  deleteInvestment as deleteStoredInvestment,
  getInvestments,
  getInvestmentTypes,
  saveInvestment as saveStoredInvestment,
} from '@/services/api/investments';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/stores/toast';

export function useInvestments() {
  const queryClient = useQueryClient();
  const userId = useAuth((state) => state.user?.id ?? '');
  const showToast = useToast((state) => state.showToast);

  const investmentTypesQuery = useQuery({
    queryKey: queryKeys.investmentTypes,
    queryFn: getInvestmentTypes,
  });

  const investmentsQuery = useQuery({
    queryKey: queryKeys.investments(userId),
    queryFn: getInvestments,
    enabled: Boolean(userId),
  });

  const saveMutation = useMutation({
    mutationFn: saveStoredInvestment,
    onSuccess: (storedInvestment) => {
      queryClient.setQueryData<Investment[]>(queryKeys.investments(userId), (prev = []) =>
        prev.some((i) => i.id === storedInvestment.id)
          ? prev.map((i) => (i.id === storedInvestment.id ? storedInvestment : i))
          : [...prev, storedInvestment],
      );
      showToast('Investimento salvo com sucesso', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStoredInvestment,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Investment[]>(queryKeys.investments(userId), (prev = []) =>
        prev.filter((i) => i.id !== id),
      );
      showToast('Investimento removido com sucesso', 'success');
    },
  });

  const loadError = investmentsQuery.error ?? investmentTypesQuery.error;

  return {
    investments: investmentsQuery.data ?? [],
    investmentTypes: investmentTypesQuery.data ?? [],
    isLoading: investmentsQuery.isLoading || investmentTypesQuery.isLoading,
    error: loadError instanceof Error ? loadError.message : null,
    saveInvestment: (investment: Investment) => saveMutation.mutateAsync(investment),
    deleteInvestment: (id: string) => deleteMutation.mutateAsync(id),
  };
}
