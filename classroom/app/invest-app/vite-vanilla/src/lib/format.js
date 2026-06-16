export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

export const formatDate = (dateString) => {
  if (!dateString) return 'Sem vencimento'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString))
}

export const formatCentsInput = (cents) =>
  (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const moneyInputToCents = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')
  return Number.parseInt(digits || '0', 10)
}
