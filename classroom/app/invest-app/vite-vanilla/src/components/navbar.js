import { escapeHtml, html } from '../lib/dom.js'
import { icons } from './icons.js'

const displayName = (user) =>
  typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : user?.email

const linkClass = (path, currentPath) =>
  `px-3 text-sm font-medium transition ${currentPath === path ? 'text-slate-950' : 'text-slate-600 hover:text-slate-900'}`

export const renderNavbar = ({ user, showValues }, currentPath) => html`
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="/" data-link class="text-lg font-semibold tracking-tight text-slate-900">Invest App</a>
      ${
        user
          ? html`
              <div class="hidden flex-1 justify-center md:flex">
                <a href="/dashboard" data-link class="${linkClass('/dashboard', currentPath)}">Dashboard</a>
                <a href="/investments" data-link class="${linkClass('/investments', currentPath)}">Investimentos</a>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  data-action="toggle-values"
                  class="inline-flex size-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="${showValues ? 'Ocultar valores' : 'Exibir valores'}"
                >
                  ${showValues ? icons.eyeOff : icons.eye}
                </button>
                <div class="relative">
                  <button
                    type="button"
                    data-action="toggle-user-menu"
                    class="inline-flex h-10 max-w-52 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    ${icons.user}<span class="hidden truncate sm:inline">${escapeHtml(displayName(user))}</span>
                  </button>
                  <div
                    data-user-menu
                    class="hidden absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
                  >
                    <p class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Minha conta</p>
                    <p class="truncate px-3 pb-2 text-sm font-semibold text-slate-900">${escapeHtml(displayName(user))}</p>
                    <button
                      type="button"
                      data-action="logout"
                      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      ${icons.logout} Sair
                    </button>
                  </div>
                </div>
              </div>
            `
          : html`
              <div class="flex items-center gap-2">
                <a
                  href="/login"
                  data-link
                  class="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  ${icons.login} Entrar
                </a>
                <a
                  href="/register"
                  data-link
                  class="inline-flex h-10 items-center gap-2 rounded-full bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
                >
                  ${icons.userPlus} Cadastrar
                </a>
              </div>
            `
      }
    </nav>
  </header>
`
