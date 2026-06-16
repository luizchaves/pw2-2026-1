import { icons } from '../components/icons.js'
import { buttonClass } from '../components/ui.js'
import { html } from '../lib/dom.js'

export const renderLanding = ({ user }) => {
  const primaryHref = user ? '/dashboard' : '/register'
  const secondaryHref = user ? '/investments' : '/login'
  const features = [
    [
      'Carteira centralizada',
      'Organize ativos, corretoras, datas e valores em uma visão única.',
      icons.wallet,
    ],
    ['Acesso privado', 'Cada investimento fica vinculado ao usuário autenticado.', icons.lock],
    ['Valores discretos', 'Oculte montantes rapidamente quando estiver em público.', icons.eyeOff],
    [
      'Vencimentos claros',
      'Acompanhe datas importantes antes que elas passem despercebidas.',
      icons.bell,
    ],
  ]

  return html`
    <section class="bg-white">
      <div class="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Invest App</p>
          <h1 class="mt-4 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Acompanhe sua carteira sem planilhas soltas.
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Cadastre seus investimentos, visualize o patrimônio e mantenha datas de aporte e vencimento em um painel simples para uso diário.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="${primaryHref}" data-link class="${buttonClass} bg-sky-600 text-white shadow-sm hover:bg-sky-500">
              ${user ? 'Abrir dashboard' : 'Criar conta'} ${icons.arrowRight}
            </a>
            <a href="${secondaryHref}" data-link class="${buttonClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400">
              ${user ? 'Ver investimentos' : 'Entrar'}
            </a>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-200">
          <div class="rounded-xl bg-white p-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Resumo</p>
                <p class="mt-1 text-2xl font-black text-slate-950">R$ 184.250,00</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">+12 ativos</span>
            </div>
            <div class="mt-5 space-y-3">
              ${[
                ['Tesouro IPCA+ 2045', 'IPCA + 5%', '15/08/2045'],
                ['CDB Banco X', '110% CDI', '02/01/2027'],
                ['FII Logística', 'Renda variável', 'Sem vencimento'],
              ]
                .map(
                  ([name, yieldText, dueDate]) => html`
                    <div class="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div>
                        <p class="text-sm font-bold text-slate-900">${name}</p>
                        <p class="mt-1 text-xs font-medium text-emerald-700">${yieldText}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs uppercase tracking-[0.12em] text-slate-400">Venc.</p>
                        <p class="mt-1 text-sm font-semibold text-slate-700">${dueDate}</p>
                      </div>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="border-t border-slate-200 bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-4 md:grid-cols-4">
          ${features
            .map(
              ([title, description, icon]) => html`
                <article class="rounded-lg border border-slate-200 bg-white p-5">
                  <span class="text-sky-600">${icon}</span>
                  <h2 class="mt-4 text-base font-bold text-slate-950">${title}</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-600">${description}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
  `
}
