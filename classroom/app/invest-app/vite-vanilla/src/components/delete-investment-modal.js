import { escapeHtml, html, mount } from '../lib/dom.js'
import { buttonClass } from './ui.js'

export const renderDeleteModal = (modalRoot, investment) => {
  mount(
    modalRoot,
    html`
      <div data-modal class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
        <section class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-5 flex items-start justify-between gap-4">
            <h2 class="text-xl font-semibold text-slate-900">Remover investimento</h2>
            <button type="button" data-action="close-modal" class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200">Fechar</button>
          </div>
          <p class="text-slate-600">
            Tem certeza que deseja remover <strong class="font-semibold text-slate-900">${escapeHtml(investment.name)}</strong>? Essa ação não pode ser desfeita.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" data-action="close-modal" class="${buttonClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400">Cancelar</button>
            <button type="button" data-action="confirm-delete" data-id="${investment.id}" class="${buttonClass} bg-rose-600 text-white shadow-sm hover:bg-rose-500">Remover</button>
          </div>
        </section>
      </div>
    `,
  )
}
