import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/lib/format';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0,00/);
  });

  it('formats a whole number in BRL with thousand separator', () => {
    expect(formatCurrency(1500)).toMatch(/1\.500,00/);
  });

  it('formats a decimal value', () => {
    expect(formatCurrency(10.5)).toMatch(/10,50/);
  });

  it('includes the BRL currency symbol', () => {
    expect(formatCurrency(1)).toMatch(/R\$/);
  });
});

describe('formatDate', () => {
  it('returns "Sem vencimento" for null', () => {
    expect(formatDate(null)).toBe('Sem vencimento');
  });

  it('formats a date string in dd/mm/yyyy pattern', () => {
    expect(formatDate('2024-06-15')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('returns "Sem vencimento" for empty string', () => {
    expect(formatDate('')).toBe('Sem vencimento');
  });
});
