import '../global.css'
import { investments as initialInvestments } from './data/investments.js'

const investments = localStorage.getItem('investments')
  ? JSON.parse(localStorage.getItem('investments'))
  : initialInvestments

const app = document.getElementById('app')

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

const formatDate = (dateString) => {
  if (!dateString) return 'Sem vencimento'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

const createInvestCard = (investment) => {
  const card = document.createElement('article')
  card.className = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl'

  const badge = document.createElement('span')
  badge.className = 'inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700'
  badge.textContent = investment.category

  const title = document.createElement('h2')
  title.className = 'mt-4 text-xl font-semibold text-slate-900'
  title.textContent = investment.name

  const description = document.createElement('p')
  description.className = 'mt-2 text-sm text-slate-600'
  description.textContent = investment.description

  const stats = document.createElement('div')
  stats.className = 'mt-6 grid gap-3 sm:grid-cols-2'
  stats.innerHTML = `
    <div class="rounded-3xl bg-slate-50 p-4">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Valor investido</p>
      <p class="mt-2 text-lg font-semibold text-slate-900">${formatCurrency(investment.amount)}</p>
    </div>
    <div class="rounded-3xl p-4 ${investment.yield >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">
      <p class="text-xs uppercase tracking-[0.18em]">Retorno anual</p>
      <p class="mt-2 text-lg font-semibold">${investment.yield.toFixed(1)}%</p>
    </div>
  `

  const footer = document.createElement('div')
  footer.className = 'mt-5 grid gap-3 sm:grid-cols-2'
  footer.innerHTML = `
    <div class="rounded-3xl bg-slate-50 p-4">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Investido em</p>
      <p class="mt-2 text-sm font-medium text-slate-900">${formatDate(investment.investedDate)}</p>
    </div>
    <div class="rounded-3xl bg-slate-50 p-4">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Vencimento</p>
      <p class="mt-2 text-sm font-medium text-slate-900">${formatDate(investment.maturityDate)}</p>
    </div>
  `

  card.append(badge, title, description, stats, footer)
  return card
}

const grid = document.getElementById('investment-grid')

grid.className = 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'

investments.forEach((investment) => {
  grid.appendChild(createInvestCard(investment))
})

const openModalButton = document.getElementById('open-investment-form')
const modal = document.getElementById('investment-modal')
const closeModalButton = document.getElementById('close-investment-form')
const investmentForm = document.getElementById('investment-form')

const openInvestmentModal = () => modal.classList.remove('hidden')
const closeInvestmentModal = () => modal.classList.add('hidden')

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeInvestmentModal()
})

openModalButton.addEventListener('click', openInvestmentModal)
closeModalButton.addEventListener('click', closeInvestmentModal)

investmentForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(investmentForm)

  const newInvestment = {
    name: formData.get('name').trim(),
    description: formData.get('description').trim(),
    amount: Number(formData.get('amount')) || 0,
    yield: Number(formData.get('yield')) || 0,
    category: formData.get('category').trim(),
    investedDate: formData.get('investedDate'),
    maturityDate: formData.get('maturityDate') || null,
  }

  grid.appendChild(createInvestCard(newInvestment))
  investments.push(newInvestment)
  localStorage.setItem('investments', JSON.stringify(investments))
  investmentForm.reset()
  closeInvestmentModal()
})
