import { buttonClass } from '../components/ui.js'
import { html } from '../lib/dom.js'
import { formatCurrency } from '../lib/format.js'

export const renderDashboard = ({ investments, showValues, isInvestmentsLoading }) => {
  const totalAmount = investments.reduce((sum, investment) => sum + investment.amount, 0)
  const totalCount = investments.length

  return html`
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
          <h1 class="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">Controle seus investimentos com clareza.</h1>
          <p class="mt-6 max-w-xl text-base text-slate-600">
            Acompanhe aportes, vencimentos e rendimento da sua carteira em um único lugar.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="/investments" data-link class="${buttonClass} bg-sky-600 text-white shadow-sm hover:bg-sky-500">Ver investimentos</a>
            <a href="/investments?new=1" data-link class="${buttonClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400">Cadastrar ativo</a>
          </div>
        </div>
        ${
          isInvestmentsLoading
            ? html`
                <article role="status" aria-label="Carregando carteira" class="animate-pulse rounded-3xl border border-slate-200 bg-white p-8">
                  <div class="h-4 w-32 rounded-full bg-slate-200"></div>
                  <div class="mt-6 space-y-4">
                    <div class="h-20 rounded-2xl bg-slate-100"></div>
                    <div class="h-20 rounded-2xl bg-slate-100"></div>
                  </div>
                </article>
              `
            : totalCount === 0
              ? html`
                <article class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <p class="text-lg font-semibold text-slate-700">Nenhum investimento ainda</p>
                  <p class="mt-2 text-sm text-slate-500">Adicione seu primeiro ativo e comece a acompanhar sua carteira.</p>
                  <a href="/investments?new=1" data-link class="${buttonClass} mt-6 bg-sky-600 text-white shadow-sm hover:bg-sky-500">Cadastrar agora</a>
                </article>
              `
              : html`
                <article class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Resumo rápido</p>
                  <div class="mt-6 space-y-4">
                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.12em] text-slate-500">Patrimônio total</p>
                      <p class="mt-2 text-2xl font-black text-slate-900">${showValues ? formatCurrency(totalAmount / 100) : '••••••••'}</p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.12em] text-slate-500">Ativos cadastrados</p>
                      <p class="mt-2 text-2xl font-black text-slate-900">${totalCount} ${totalCount === 1 ? 'investimento' : 'investimentos'}</p>
                    </div>
                  </div>
                </article>
              `
        }
      </div>
    </section>
  `
}
