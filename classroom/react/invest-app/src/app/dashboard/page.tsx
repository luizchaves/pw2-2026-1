'use client';

import Link from 'next/link';
import { useVisibility } from '@/contexts/visibility';
import { useInvestments } from '@/contexts/investments';
import { formatCurrency } from '@/lib/format';

export default function DashboardPage() {
  const { showValues } = useVisibility();
  const { investments, isLoading } = useInvestments();

  const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCount = investments.length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Controle seus investimentos com clareza.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-600">
            Acompanhe aportes, vencimentos e rendimento da sua carteira em um
            unico lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/investments"
              className="inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
            >
              Ver investimentos
            </Link>
            <Link
              href="/investments"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Cadastrar ativo
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">
              Carregando carteira
            </p>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">
              Nenhum investimento ainda
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Adicione seu primeiro ativo e comece a acompanhar sua carteira.
            </p>
            <Link
              href="/investments"
              className="mt-6 inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
            >
              Cadastrar agora
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Resumo rapido
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  Patrimonio total
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {showValues ? formatCurrency(totalAmount / 100) : '••••••••'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  Ativos cadastrados
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {totalCount}{' '}
                  {totalCount === 1 ? 'investimento' : 'investimentos'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
