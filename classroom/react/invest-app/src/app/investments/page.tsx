'use client';

import { useVisibility } from '@/context/visibility';
import { useInvestments } from '@/context/investments';
import type { Investment } from '@/types/investment';
import InvestmentCard from '@/components/InvestmentCard';

export default function InvestmentsPage() {
  const { showValues } = useVisibility();
  const { investments, setInvestments } = useInvestments();

  const handleAddInvestment = () => {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setFullYear(dueDate.getFullYear() + 10);

    const newInvestment: Investment = {
      id: crypto.randomUUID(),
      name: 'Tesouro Reserva',
      type: 'tesouro-ipca',
      broker: 'Corretora Y',
      amount: 10000,
      yield: '100% Selic',
      category: 'Fixed Income',
      investedDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
    };

    setInvestments((prev) => [...prev, newInvestment]);
  };

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
            onClick={handleAddInvestment}
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
      <div
        id="investment-grid"
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {investments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            showValues={showValues}
          />
        ))}
      </div>
    </section>
  );
}
