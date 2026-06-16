import { icons } from '../components/icons.js'
import { authField, buttonClass } from '../components/ui.js'
import { html } from '../lib/dom.js'

export const renderLogin = () => html`
  <section class="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4 py-12">
    <article class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Invest App</p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Entrar</h1>
      <form data-form="login" class="mt-8 space-y-4" novalidate>
        ${authField({ id: 'login-email', label: 'Email', name: 'email', type: 'email', autocomplete: 'email', placeholder: 'voce@email.com' })}
        ${authField({ id: 'login-password', label: 'Senha', name: 'password', type: 'password', autocomplete: 'current-password', placeholder: 'Sua senha' })}
        <div data-action-error class="hidden rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"></div>
        <button type="submit" class="${buttonClass} w-full bg-sky-600 text-white shadow-sm hover:bg-sky-500">${icons.login} Entrar</button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-600">
        Ainda não tem conta? <a href="/register" data-link class="font-semibold text-sky-700">Criar cadastro</a>
      </p>
    </article>
  </section>
`

export const renderRegister = () => html`
  <section class="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4 py-12">
    <article class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Invest App</p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Criar conta</h1>
      <form data-form="register" class="mt-8 space-y-4" novalidate>
        ${authField({ id: 'register-name', label: 'Nome', name: 'name', autocomplete: 'name', placeholder: 'Seu nome' })}
        ${authField({ id: 'register-email', label: 'Email', name: 'email', type: 'email', autocomplete: 'email', placeholder: 'voce@email.com' })}
        ${authField({ id: 'register-password', label: 'Senha', name: 'password', type: 'password', autocomplete: 'new-password', placeholder: 'Mínimo de 6 caracteres' })}
        ${authField({ id: 'register-confirm-password', label: 'Confirmar senha', name: 'confirmPassword', type: 'password', autocomplete: 'new-password', placeholder: 'Repita sua senha' })}
        <div data-action-error class="hidden rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"></div>
        <button type="submit" class="${buttonClass} w-full bg-sky-600 text-white shadow-sm hover:bg-sky-500">${icons.userPlus} Criar conta</button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-600">
        Já tem conta? <a href="/login" data-link class="font-semibold text-sky-700">Entrar</a>
      </p>
    </article>
  </section>
`
