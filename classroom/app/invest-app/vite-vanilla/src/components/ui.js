import { escapeHtml, html } from '../lib/dom.js'

export const buttonClass =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:bg-slate-300'

export const errorBanner = (message) =>
  message
    ? html`<div class="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">${escapeHtml(message)}</div>`
    : ''

export const authField = ({ id, label, type = 'text', name, autocomplete, placeholder }) => html`
  <div>
    <label for="${id}" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">${label}</label>
    <input
      id="${id}"
      name="${name}"
      type="${type}"
      autocomplete="${autocomplete}"
      placeholder="${placeholder}"
      aria-invalid="false"
      class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
    />
    <p data-error-for="${name}" class="mt-1 text-xs text-red-500"></p>
  </div>
`

export const inputField = ({
  id,
  label,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  hint = '',
}) => html`
  <div>
    <label for="${id}" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
      ${label} ${hint ? `<span class="font-normal normal-case text-slate-400">${hint}</span>` : ''}
    </label>
    <input
      id="${id}"
      name="${name}"
      type="${type}"
      value="${escapeHtml(value)}"
      placeholder="${placeholder}"
      aria-invalid="false"
      class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
    />
    <p data-error-for="${name}" class="mt-1 text-xs text-red-500"></p>
  </div>
`

export const showActionError = (form, message) => {
  const error = form.querySelector('[data-action-error]')
  error.textContent = message
  error.classList.remove('hidden')
}

export const loadingSession = (navbar) => html`
  ${navbar}
  <main class="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4">
    <div role="status" class="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-600 shadow-sm">
      Carregando sessão...
    </div>
  </main>
`
