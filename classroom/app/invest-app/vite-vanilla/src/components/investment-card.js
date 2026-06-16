import { categoryLabel, categoryTheme } from '../lib/categories.js'
import { escapeHtml, html } from '../lib/dom.js'
import { formatCurrency, formatDate } from '../lib/format.js'
import { icons } from './icons.js'

const detailItem = (icon, label, value) => html`
  <div class="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
    <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">${icon}</span>
    <div class="min-w-0">
      <p class="text-xs font-medium text-slate-500">${label}</p>
      <p class="truncate text-sm font-semibold text-slate-900">${escapeHtml(value)}</p>
    </div>
  </div>
`

export const investmentCard = (investment, showValues) => html`
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div class="flex min-w-0 items-center justify-between gap-2">
      <h2 class="truncate text-base font-semibold leading-snug text-slate-950 sm:text-lg">${escapeHtml(investment.name)}</h2>
      <span class="h-6 shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${categoryTheme[investment.category]}">${categoryLabel[investment.category]}</span>
    </div>
    <div class="mt-4 space-y-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p class="text-xs font-medium text-slate-500">Valor investido</p>
        <p class="mt-0.5 text-xl font-bold leading-tight text-slate-950">${showValues ? formatCurrency(investment.amount / 100) : '••••••••'}</p>
      </div>
      <div class="grid gap-2">
        ${detailItem(icons.trend, 'Rentabilidade', investment.yield || 'Não informado')}
        ${detailItem(icons.bank, 'Corretora', investment.broker)}
        <div class="grid gap-2 sm:grid-cols-2">
          ${detailItem(icons.calendar, 'Aporte', formatDate(investment.investedDate))}
          ${detailItem(icons.calendar, 'Vencimento', formatDate(investment.dueDate))}
        </div>
      </div>
    </div>
    <footer class="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white pt-3">
      <button type="button" data-action="edit-investment" data-id="${investment.id}" class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
        ${icons.edit} Editar
      </button>
      <button type="button" data-action="delete-investment" data-id="${investment.id}" class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-500">
        ${icons.trash} Excluir
      </button>
    </footer>
  </article>
`

export const investmentSkeletons = () =>
  ['investment-skeleton-1', 'investment-skeleton-2', 'investment-skeleton-3']
    .map(
      (id) => html`
        <article id="${id}" class="animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
          <div class="h-6 w-3/4 rounded-full bg-slate-200"></div>
          <div class="mt-4 flex gap-3">
            <div class="h-6 w-24 rounded-full bg-slate-200"></div>
            <div class="h-6 w-16 rounded-full bg-slate-200"></div>
          </div>
          <div class="mt-6 h-20 rounded-2xl bg-slate-100"></div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="col-span-2 h-16 rounded-2xl bg-slate-100"></div>
            <div class="h-16 rounded-2xl bg-slate-100"></div>
            <div class="h-16 rounded-2xl bg-slate-100"></div>
          </div>
        </article>
      `,
    )
    .join('')
