import { Investment } from '@/app/data/investments';
import { formatCurrency, formatDate } from '@/app/lib/format';

type InvestmentCardProps = {
  investment: Investment;
};

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
        {investment.category}
      </span>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">
        {investment.name}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{investment.description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Valor investido
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {formatCurrency(investment.amount)}
          </p>
        </div>
        <div className="rounded-3xl p-4 bg-emerald-50 text-emerald-700">
          <p className="text-xs uppercase tracking-[0.18em]">Retorno anual</p>
          <p className="mt-2 text-lg font-semibold">{investment.yieldValue}%</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Investido em
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(investment.investedDate)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Vencimento
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(investment.maturityDate)}
          </p>
        </div>
      </div>
    </article>
  );
}
