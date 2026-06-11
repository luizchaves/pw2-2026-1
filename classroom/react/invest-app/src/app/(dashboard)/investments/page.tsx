'use client';

import { Plus } from 'lucide-react';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentForm from '@/components/InvestmentForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Modal from '@/components/ui/Modal';
import { useInvestmentActions } from '@/hooks/useInvestmentActions';
import { useInvestments } from '@/hooks/useInvestments';
import { useVisibility } from '@/stores/visibility';

function InvestmentCardSkeleton() {
  return (
    <Card className="animate-pulse rounded-3xl border-slate-200 bg-white p-6 py-6">
      <div className="h-6 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-4 flex gap-3">
        <div className="h-6 w-24 rounded-full bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 h-20 rounded-2xl bg-slate-100" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 h-16 rounded-2xl bg-slate-100" />
        <div className="h-16 rounded-2xl bg-slate-100" />
        <div className="h-16 rounded-2xl bg-slate-100" />
      </div>
    </Card>
  );
}

const investmentSkeletonIds = [
  'investment-skeleton-1',
  'investment-skeleton-2',
  'investment-skeleton-3',
];

export default function InvestmentsPage() {
  const { showValues } = useVisibility();
  const { investments, investmentTypes, isLoading, error } = useInvestments();
  const {
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
  } = useInvestmentActions();

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Portfólio</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Meus investimentos
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Uma visão rápida dos seus principais ativos, com retorno, valor investido e datas
            importantes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            id="open-investment-form"
            onClick={openCreateForm}
            className="h-11 w-full rounded-full bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Cadastrar investimento
          </Button>
        </div>
      </div>

      {(error || actionError) && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error ?? actionError}
        </div>
      )}

      {isLoading ? (
        <div
          role="status"
          aria-label="Carregando investimentos"
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {investmentSkeletonIds.map((skeletonId) => (
            <InvestmentCardSkeleton key={skeletonId} />
          ))}
        </div>
      ) : investments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center rounded-3xl border-dashed border-slate-300 bg-slate-50 p-16 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">Nenhum investimento cadastrado</p>
          <p className="mt-2 text-sm text-slate-500">
            Clique em &ldquo;Cadastrar investimento&rdquo; para adicionar o seu primeiro ativo.
          </p>
        </Card>
      ) : (
        <div id="investment-grid" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {investments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              investment={investment}
              showValues={showValues}
              onEdit={() => handleEdit(investment)}
              onDelete={() => setDeletingInvestment(investment)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <InvestmentForm
          investment={editingInvestment ?? undefined}
          investmentTypes={investmentTypes}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}

      {deletingInvestment && (
        <Modal title="Remover investimento" onClose={() => setDeletingInvestment(null)}>
          <p className="text-slate-600">
            Tem certeza que deseja remover{' '}
            <strong className="font-semibold text-slate-900">{deletingInvestment.name}</strong>?
            Essa ação não pode ser desfeita.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingInvestment(null)}
              className="h-10 rounded-full border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="h-10 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
            >
              Remover
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
