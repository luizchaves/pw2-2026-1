import { describe, expect, it } from 'vitest';
import { formatCents, formatCurrency, formatDate, parseCents } from './format';

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
  it('returns "Sem vencimento" for null or empty values', () => {
    expect(formatDate(null)).toBe('Sem vencimento');
    expect(formatDate('')).toBe('Sem vencimento');
  });

  it('formats a date string in dd/mm/yyyy pattern', () => {
    expect(formatDate('2024-06-15')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('currency input helpers', () => {
  it('parses currency input to cents', () => {
    expect(parseCents('1.234,56')).toBe(123456);
  });

  it('formats cents for form display', () => {
    expect(formatCents(123456)).toBe('1.234,56');
  });
});
