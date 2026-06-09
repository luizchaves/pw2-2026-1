import { describe, it, expect } from 'vitest';
import {
  investmentYieldSchema,
  investmentSchema,
  investmentFormSchema,
} from './investment';

describe('investmentYieldSchema', () => {
  it.each(['15%', 'IPCA + 5%', '110% CDI', '100% Selic'])(
    'accepts valid format "%s"',
    (value) => {
      expect(investmentYieldSchema.safeParse(value).success).toBe(true);
    },
  );

  it.each(['CDI', '15 %', 'SELIC', 'abc', ''])(
    'rejects invalid format "%s"',
    (value) => {
      expect(investmentYieldSchema.safeParse(value).success).toBe(false);
    },
  );
});

const validInvestment = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  userId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  name: 'Tesouro IPCA+ 2045',
  type: 'type-fixed',
  broker: 'XP Investimentos',
  amount: 100_000,
  yield: 'IPCA + 5%',
  category: 'Fixed Income' as const,
  investedDate: '2024-01-10',
  dueDate: '2045-08-15',
};

describe('investmentSchema', () => {
  it('accepts a complete valid investment', () => {
    expect(() => investmentSchema.parse(validInvestment)).not.toThrow();
  });

  it('accepts investment without yield and with null dueDate', () => {
    const { yield: _, ...rest } = validInvestment;
    expect(() =>
      investmentSchema.parse({ ...rest, dueDate: null }),
    ).not.toThrow();
  });

  it('rejects non-UUID id', () => {
    expect(
      investmentSchema.safeParse({ ...validInvestment, id: 'not-a-uuid' }).success,
    ).toBe(false);
  });

  it('rejects negative amount', () => {
    expect(
      investmentSchema.safeParse({ ...validInvestment, amount: -100 }).success,
    ).toBe(false);
  });

  it('rejects zero amount', () => {
    expect(
      investmentSchema.safeParse({ ...validInvestment, amount: 0 }).success,
    ).toBe(false);
  });

  it('rejects empty name', () => {
    expect(
      investmentSchema.safeParse({ ...validInvestment, name: '' }).success,
    ).toBe(false);
  });

  it('rejects invalid category', () => {
    expect(
      investmentSchema.safeParse({ ...validInvestment, category: 'Other' }).success,
    ).toBe(false);
  });
});

const validForm = {
  name: 'CDB Banco X',
  typeId: 'type-fixed',
  broker: 'Rico',
  amountCents: 50_000,
  investedDate: '2024-03-01',
  dueDate: '2025-03-01',
};

describe('investmentFormSchema', () => {
  it('accepts valid form data', () => {
    expect(() => investmentFormSchema.parse(validForm)).not.toThrow();
  });

  it('accepts form data without optional fields', () => {
    const { dueDate: _, yield: __, ...required } = validForm as typeof validForm & { yield?: string };
    expect(() => investmentFormSchema.parse(required)).not.toThrow();
  });

  it('rejects empty name', () => {
    expect(
      investmentFormSchema.safeParse({ ...validForm, name: '' }).success,
    ).toBe(false);
  });

  it('rejects non-positive amountCents', () => {
    expect(
      investmentFormSchema.safeParse({ ...validForm, amountCents: 0 }).success,
    ).toBe(false);
  });

  it('rejects invalid yield format when provided', () => {
    expect(
      investmentFormSchema.safeParse({ ...validForm, yield: 'invalido' }).success,
    ).toBe(false);
  });

  it('accepts empty string yield (treated as absent)', () => {
    expect(
      investmentFormSchema.safeParse({ ...validForm, yield: '' }).success,
    ).toBe(true);
  });
});
