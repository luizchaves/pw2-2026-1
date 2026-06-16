import { getByRole, getByText } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'
import { investmentCard } from '../../../src/components/investment-card.js'
import { mockInvestments } from '../../fixtures/investments.js'

describe('investmentCard', () => {
  it('renders investment details and actions', () => {
    document.body.innerHTML = investmentCard(mockInvestments[0], true)

    expect(getByRole(document.body, 'heading', { name: 'Tesouro IPCA+ 2045' })).toBeInTheDocument()
    expect(getByText(document.body, /R\$\s?1\.000,00/)).toBeInTheDocument()
    expect(getByText(document.body, 'XP Investimentos')).toBeInTheDocument()
    expect(getByRole(document.body, 'button', { name: /Editar/i })).toHaveAttribute(
      'data-id',
      mockInvestments[0].id,
    )
  })

  it('hides monetary values when showValues is false', () => {
    document.body.innerHTML = investmentCard(mockInvestments[0], false)

    expect(getByText(document.body, '••••••••')).toBeInTheDocument()
  })
})
