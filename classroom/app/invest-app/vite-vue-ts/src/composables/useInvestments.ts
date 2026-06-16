import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { queryKeys } from '@/lib/query-keys';
import type { Investment } from '@/schemas/investment';
import {
  deleteInvestment as deleteStoredInvestment,
  getInvestments,
  getInvestmentTypes,
  saveInvestment as saveStoredInvestment,
} from '@/services/supabase/investments';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

export function useInvestments() {
  const auth = useAuthStore();
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const userId = computed(() => auth.user?.id ?? '');

  const investmentTypesQuery = useQuery({
    queryKey: queryKeys.investmentTypes,
    queryFn: getInvestmentTypes,
  });

  const investmentsQuery = useQuery({
    queryKey: computed(() => queryKeys.investments(userId.value)),
    queryFn: () => getInvestments(userId.value),
    enabled: computed(() => Boolean(userId.value)),
  });

  const saveMutation = useMutation({
    mutationFn: (investment: Investment) => saveStoredInvestment(investment, userId.value),
    onSuccess: (storedInvestment) => {
      queryClient.setQueryData<Investment[]>(
        queryKeys.investments(userId.value),
        (previous = []) =>
          previous.some((investment) => investment.id === storedInvestment.id)
            ? previous.map((investment) =>
                investment.id === storedInvestment.id ? storedInvestment : investment,
              )
            : [...previous, storedInvestment],
      );
      toast.showToast('Investimento salvo com sucesso', 'success');
    },
    onError: (error) => {
      toast.showToast(error instanceof Error ? error.message : 'Nao foi possivel salvar', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStoredInvestment(id, userId.value),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Investment[]>(queryKeys.investments(userId.value), (previous = []) =>
        previous.filter((investment) => investment.id !== id),
      );
      toast.showToast('Investimento removido com sucesso', 'success');
    },
    onError: (error) => {
      toast.showToast(error instanceof Error ? error.message : 'Nao foi possivel remover', 'error');
    },
  });

  const loadError = computed(
    () => investmentsQuery.error.value ?? investmentTypesQuery.error.value,
  );

  return {
    investments: computed(() => investmentsQuery.data.value ?? []),
    investmentTypes: computed(() => investmentTypesQuery.data.value ?? []),
    isLoading: computed(
      () => investmentsQuery.isLoading.value || investmentTypesQuery.isLoading.value,
    ),
    error: computed(() => (loadError.value instanceof Error ? loadError.value.message : null)),
    saveInvestment: (investment: Investment) => saveMutation.mutateAsync(investment),
    deleteInvestment: (id: string) => deleteMutation.mutateAsync(id),
  };
}
