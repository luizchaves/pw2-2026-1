'use client';

import { useVisibility } from '@/contexts/visibility';
import { useInvestments } from '@/contexts/investments';
import { useInvestmentActions } from '@/hooks/useInvestmentActions';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentForm from '@/components/InvestmentForm';
import Modal from '@/components/ui/Modal';

function InvestmentCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
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
    </div>
  );
}

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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Portfólio
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Meus investimentos
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Uma visão rápida dos seus principais ativos, com retorno, valor
            investido e datas importantes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="open-investment-form"
            onClick={openCreateForm}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Cadastrar investimento
          </button>
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
          {Array.from({ length: 3 }).map((_, i) => (
            <InvestmentCardSkeleton key={i} />
          ))}
        </div>
      ) : investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Nenhum investimento cadastrado
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Clique em &ldquo;Cadastrar investimento&rdquo; para adicionar o seu
            primeiro ativo.
          </p>
        </div>
      ) : (
        <div
          id="investment-grid"
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
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
        <Modal
          title="Remover investimento"
          onClose={() => setDeletingInvestment(null)}
        >
          <p className="text-slate-600">
            Tem certeza que deseja remover{' '}
            <strong className="font-semibold text-slate-900">
              {deletingInvestment.name}
            </strong>
            ? Essa ação não pode ser desfeita.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeletingInvestment(null)}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500"
            >
              Remover
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
