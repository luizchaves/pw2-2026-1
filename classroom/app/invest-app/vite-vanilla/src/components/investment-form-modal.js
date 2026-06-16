import { categoryLabel } from '../lib/categories.js'
import { clearFieldErrors, formValues, html, mount, setFieldError, uid } from '../lib/dom.js'
import { formatCentsInput, moneyInputToCents } from '../lib/format.js'
import { getState, saveInvestment } from '../lib/store.js'
import { investmentFormSchema } from '../schemas/investment.js'
import { buttonClass, inputField, showActionError } from './ui.js'

export const renderInvestmentFormModal = (modalRoot, investment, closeModal) => {
  const { investmentTypes, user } = getState()
  const defaultType = investmentTypes[0]

  if (!defaultType) {
    mount(
      modalRoot,
      html`
        <div data-modal class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <section class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 class="text-xl font-semibold text-slate-900">Tipos indisponíveis</h2>
            <p class="mt-3 text-sm text-slate-600">Não foi possível carregar os tipos de investimento do Supabase.</p>
            <div class="mt-6 flex justify-end">
              <button type="button" data-action="close-modal" class="${buttonClass} bg-sky-600 text-white shadow-sm hover:bg-sky-500">Fechar</button>
            </div>
          </section>
        </div>
      `,
    )
    return
  }

  const selectedType = investmentTypes.find((type) => type.id === investment?.typeId) ?? defaultType
  const title = investment ? 'Editar investimento' : 'Novo investimento'
  const amountDisplay = investment ? formatCentsInput(investment.amount) : ''

  mount(
    modalRoot,
    html`
      <div data-modal class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
        <section class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-5 flex items-start justify-between gap-4">
            <h2 class="text-xl font-semibold text-slate-900">${title}</h2>
            <button type="button" data-action="close-modal" class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200">Fechar</button>
          </div>
          <form data-form="investment" data-id="${investment?.id ?? ''}" class="space-y-4" novalidate>
            ${inputField({ id: 'investment-name', label: 'Nome', name: 'name', placeholder: 'Ex: Tesouro IPCA+ 2045', value: investment?.name ?? '' })}
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="investment-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</label>
                <select id="investment-type" name="typeId" aria-invalid="false" class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200">
                  ${investmentTypes
                    .map(
                      (type) => html`
                        <option value="${type.id}" ${type.id === selectedType.id ? 'selected' : ''}>${type.name}</option>
                      `,
                    )
                    .join('')}
                </select>
                <p data-error-for="typeId" class="mt-1 text-xs text-red-500"></p>
              </div>
              <div>
                <label for="investment-category" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</label>
                <input id="investment-category" value="${categoryLabel[selectedType.category]}" readonly class="h-10 w-full rounded-xl border border-slate-100 bg-slate-100 px-3 text-sm text-slate-500" />
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              ${inputField({ id: 'investment-broker', label: 'Corretora', name: 'broker', placeholder: 'Ex: XP Investimentos', value: investment?.broker ?? '' })}
              ${inputField({ id: 'investment-amount', label: 'Valor (R$)', name: 'amountDisplay', placeholder: '0,00', value: amountDisplay })}
              <input type="hidden" name="amount" value="${investment?.amount ?? 0}" />
            </div>
            ${inputField({ id: 'investment-yield', label: 'Rendimento', name: 'yield', placeholder: 'Ex: 100% Selic', value: investment?.yield ?? '', hint: '(opcional - ex: IPCA + 5%, 110% CDI)' })}
            <div class="grid gap-4 sm:grid-cols-2">
              ${inputField({ id: 'investment-invested-date', label: 'Data de aporte', name: 'investedDate', type: 'date', value: investment?.investedDate ?? new Date().toISOString().split('T')[0] })}
              ${inputField({ id: 'investment-due-date', label: 'Vencimento', name: 'dueDate', type: 'date', value: investment?.dueDate ?? '', hint: '(opcional)' })}
            </div>
            <div data-action-error class="hidden rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"></div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" data-action="close-modal" class="${buttonClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400">Cancelar</button>
              <button type="submit" class="${buttonClass} bg-sky-600 text-white shadow-sm hover:bg-sky-500">${investment ? 'Salvar' : 'Cadastrar'}</button>
            </div>
          </form>
        </section>
      </div>
    `,
  )

  modalRoot.querySelector('[name="typeId"]').addEventListener('change', (event) => {
    const selected = investmentTypes.find((type) => type.id === event.target.value)
    modalRoot.querySelector('#investment-category').value = categoryLabel[selected.category]
  })

  modalRoot.querySelector('[name="amountDisplay"]').addEventListener('input', (event) => {
    const cents = moneyInputToCents(event.target.value)
    modalRoot.querySelector('[name="amount"]').value = cents
    event.target.value = formatCentsInput(cents)
  })

  modalRoot.querySelector('[data-form="investment"]').addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    clearFieldErrors(form)
    const values = formValues(form)
    const selected = investmentTypes.find((type) => type.id === values.typeId)
    const parsed = investmentFormSchema.safeParse({
      ...values,
      amount: Number(values.amount),
      yield: values.yield || undefined,
      dueDate: values.dueDate || undefined,
    })

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        setFieldError(form, issue.path[0], issue.message)
      })
      return
    }

    try {
      await saveInvestment({
        id: form.dataset.id || uid(),
        userId: user.id,
        name: parsed.data.name.trim(),
        typeId: parsed.data.typeId,
        broker: parsed.data.broker.trim(),
        amount: parsed.data.amount,
        yield: parsed.data.yield?.trim() || undefined,
        category: selected.category,
        investedDate: parsed.data.investedDate,
        dueDate: parsed.data.dueDate || null,
      })
      closeModal()
    } catch (error) {
      showActionError(
        form,
        error instanceof Error ? error.message : 'Não foi possível salvar o investimento.',
      )
    }
  })
}
