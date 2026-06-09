import { Pencil, Trash2 } from 'lucide-react';
import type { Investment } from '@/schemas/investment';
import { formatCurrency, formatDate } from '@/lib/format';

type InvestmentCardProps = {
  investment: Investment;
  showValues: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const categoryTheme: Record<Investment['category'], string> = {
  'Fixed Income': 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  'Variable Income': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
};

const categoryLabel: Record<Investment['category'], string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variavel',
};

export default function InvestmentCard({
  investment,
  showValues,
  onEdit,
  onDelete,
}: InvestmentCardProps) {
  const yieldText = investment.yield ?? 'Nao informado';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <header>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            {investment.name}
          </h2>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${categoryTheme[investment.category]}`}
          >
            {categoryLabel[investment.category]}
          </span>
          <p className="text-sm font-extrabold text-emerald-700">{yieldText}</p>
        </div>
      </header>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
          Valor investido
        </p>
        <p className="mt-2 text-2xl font-black text-slate-900">
          {showValues ? formatCurrency(investment.amount / 100) : '••••••'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
            Corretora
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {investment.broker}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
            Investido em
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(investment.investedDate)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
            Vencimento
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(investment.dueDate)}
          </p>
        </div>
      </div>
    </article>
  );
}
