import { ref } from 'vue';
import { useInvestments } from '@/composables/useInvestments';
import type { Investment } from '@/schemas/investment';

export function useInvestmentActions() {
  const { saveInvestment, deleteInvestment } = useInvestments();
  const showForm = ref(false);
  const actionError = ref<string | null>(null);
  const editingInvestment = ref<Investment | null>(null);
  const deletingInvestment = ref<Investment | null>(null);

  const openCreateForm = () => {
    actionError.value = null;
    editingInvestment.value = null;
    showForm.value = true;
  };

  const handleEdit = (investment: Investment) => {
    actionError.value = null;
    editingInvestment.value = investment;
    showForm.value = true;
  };

  const closeForm = () => {
    showForm.value = false;
    editingInvestment.value = null;
  };

  const handleFormSubmit = async (investment: Investment) => {
    try {
      actionError.value = null;
      await saveInvestment(investment);
      closeForm();
    } catch (error) {
      actionError.value = error instanceof Error ? error.message : 'Nao foi possivel salvar';
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvestment.value) return;

    try {
      actionError.value = null;
      await deleteInvestment(deletingInvestment.value.id);
      deletingInvestment.value = null;
    } catch (error) {
      actionError.value = error instanceof Error ? error.message : 'Nao foi possivel remover';
    }
  };

  return {
    showForm,
    actionError,
    editingInvestment,
    deletingInvestment,
    openCreateForm,
    handleEdit,
    closeForm,
    handleFormSubmit,
    handleDeleteConfirm,
  };
}
