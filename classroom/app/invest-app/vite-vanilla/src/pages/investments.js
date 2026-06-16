import { icons } from '../components/icons.js'
import { investmentCard, investmentSkeletons } from '../components/investment-card.js'
import { buttonClass } from '../components/ui.js'
import { escapeHtml, html } from '../lib/dom.js'

export const renderInvestments = ({ investments, showValues, isInvestmentsLoading, error }) => html`
  <section class="mx-auto mt-6 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Portfólio</p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Meus investimentos</h1>
        <p class="max-w-2xl text-sm text-slate-600">
          Uma visão rápida dos seus principais ativos, com retorno, valor investido e datas importantes.
        </p>
      </div>
      <button type="button" data-action="new-investment" class="${buttonClass} w-full bg-sky-600 text-white shadow-sm hover:bg-sky-500 sm:w-auto">
        ${icons.plus} Cadastrar investimento
      </button>
    </div>
    ${error ? html`<div class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">${escapeHtml(error)}</div>` : ''}
    ${
      isInvestmentsLoading
        ? html`<div role="status" aria-label="Carregando investimentos" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">${investmentSkeletons()}</div>`
        : investments.length === 0
          ? html`
            <article class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
              <p class="text-lg font-semibold text-slate-700">Nenhum investimento cadastrado</p>
              <p class="mt-2 text-sm text-slate-500">Clique em "Cadastrar investimento" para adicionar o seu primeiro ativo.</p>
            </article>
          `
          : html`<div id="investment-grid" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">${investments.map((investment) => investmentCard(investment, showValues)).join('')}</div>`
    }
  </section>
`
