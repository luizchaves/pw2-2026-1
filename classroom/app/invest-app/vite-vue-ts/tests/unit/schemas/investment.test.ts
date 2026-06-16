import { describe, expect, it } from 'vitest';
import { investmentFormSchema, investmentSchema } from '@/schemas/investment';
import { mockInvestments } from '../../fixtures/investments';

describe('investment schemas', () => {
  it('accepts a valid investment', () => {
    expect(investmentSchema.safeParse(mockInvestments[0]).success).toBe(true);
  });

  it('rejects invalid amount and yield formats', () => {
    expect(
      investmentFormSchema.safeParse({
        name: 'CDB',
        typeId: 'type-fixed',
        broker: 'XP',
        amountCents: 0,
        yield: 'CDI alto',
        investedDate: '2024-01-10',
        dueDate: '',
      }).success,
    ).toBe(false);
  });
});
