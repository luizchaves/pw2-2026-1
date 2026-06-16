import { describe, expect, it } from 'vitest'
import {
  formatCentsInput,
  formatCurrency,
  formatDate,
  moneyInputToCents,
} from '../../../src/lib/format.js'

describe('format helpers', () => {
  it('formats BRL currency', () => {
    expect(formatCurrency(1500)).toMatch(/R\$\s?1\.500,00/)
  })

  it('formats ISO dates and empty due dates', () => {
    expect(formatDate('2024-01-10')).toBe('10/01/2024')
    expect(formatDate(null)).toBe('Sem vencimento')
  })

  it('converts money input display to cents and back', () => {
    expect(moneyInputToCents('R$ 1.234,56')).toBe(123456)
    expect(formatCentsInput(123456)).toBe('1.234,56')
  })
})
