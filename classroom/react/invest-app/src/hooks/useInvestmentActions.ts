'use client';

import { useState } from 'react';
import type { Investment } from '@/schemas/investment';
import { useInvestments } from '@/contexts/investments';

export function useInvestmentActions() {
  const { saveInvestment, deleteInvestment } = useInvestments();
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [deletingInvestment, setDeletingInvestment] = useState<Investment | null>(null);

  const openCreateForm = () => setShowForm(true);

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  const handleFormSubmit = async (investment: Investment) => {
    try {
      setActionError(null);
      await saveInvestment(investment);
      closeForm();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Não foi possível salvar o investimento',
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvestment) return;
    try {
      setActionError(null);
      await deleteInvestment(deletingInvestment.id);
      setDeletingInvestment(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Não foi possível remover o investimento',
      );
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
    setDeletingInvestment,
  };
}
