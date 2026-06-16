import { renderDeleteModal } from './components/delete-investment-modal.js'
import { renderInvestmentFormModal } from './components/investment-form-modal.js'
import { showActionError } from './components/ui.js'
import { clearFieldErrors, formValues, setFieldError } from './lib/dom.js'
import {
  deleteInvestment,
  getState,
  loginUser,
  logoutUser,
  registerUser,
  toggleValues,
} from './lib/store.js'
import { loginSchema, registerSchema } from './schemas/auth.js'

const handleAuthSubmit = async (form, schema, action, goTo) => {
  clearFieldErrors(form)
  form.querySelector('[data-action-error]')?.classList.add('hidden')
  const parsed = schema.safeParse(formValues(form))

  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      setFieldError(form, issue.path[0], issue.message)
    })
    return
  }

  try {
    const result = await action(parsed.data)
    if (result?.signedIn === false) {
      showActionError(form, 'Cadastro criado. Verifique seu email para confirmar a conta.')
      return
    }
    goTo('/')
  } catch (error) {
    showActionError(
      form,
      error instanceof Error ? error.message : 'Não foi possível concluir a ação',
    )
  }
}

export const closeModal = (modalRoot) => {
  modalRoot.innerHTML = ''
}

export const bindGlobalEvents = ({ goTo, modalRoot }) => {
  const closeCurrentModal = () => closeModal(modalRoot)

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]')
    if (link) {
      event.preventDefault()
      goTo(new URL(link.href).pathname + new URL(link.href).search)
      return
    }

    const actionElement = event.target.closest('[data-action]')
    if (!actionElement) return

    const action = actionElement.dataset.action
    const { investments } = getState()

    if (action === 'toggle-values') toggleValues()
    if (action === 'toggle-user-menu') {
      document.querySelector('[data-user-menu]')?.classList.toggle('hidden')
    }
    if (action === 'logout') {
      logoutUser().catch((error) => {
        console.error(error)
      })
      goTo('/login')
    }
    if (action === 'new-investment') renderInvestmentFormModal(modalRoot, null, closeCurrentModal)
    if (action === 'edit-investment') {
      renderInvestmentFormModal(
        modalRoot,
        investments.find((investment) => investment.id === actionElement.dataset.id),
        closeCurrentModal,
      )
    }
    if (action === 'delete-investment') {
      renderDeleteModal(
        modalRoot,
        investments.find((investment) => investment.id === actionElement.dataset.id),
      )
    }
    if (action === 'close-modal') closeCurrentModal()
    if (action === 'confirm-delete') {
      deleteInvestment(actionElement.dataset.id)
        .then(closeCurrentModal)
        .catch((error) => {
          console.error(error)
        })
    }
  })

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form')
    if (!form) return

    if (form.dataset.form === 'login') {
      event.preventDefault()
      handleAuthSubmit(form, loginSchema, loginUser, goTo)
    }

    if (form.dataset.form === 'register') {
      event.preventDefault()
      handleAuthSubmit(form, registerSchema, registerUser, goTo)
    }
  })

  modalRoot.addEventListener('click', (event) => {
    if (event.target.matches('[data-modal]')) closeCurrentModal()
  })
}
