import { describe, expect, it } from 'vitest'
import { investmentFormSchema, investmentSchema } from '../../../src/schemas/investment.js'
import { mockInvestments } from '../../fixtures/investments.js'

describe('investment schemas', () => {
  it('accepts a valid investment', () => {
    expect(investmentSchema.safeParse(mockInvestments[0]).success).toBe(true)
  })

  it('rejects invalid amount and yield formats', () => {
    expect(
      investmentFormSchema.safeParse({
        name: 'CDB',
        typeId: 'type-fixed',
        broker: 'XP',
        amount: 0,
        yield: 'CDI alto',
        investedDate: '2024-01-10',
        dueDate: '',
      }).success,
    ).toBe(false)
  })
})
