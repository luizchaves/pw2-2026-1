import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate } from '@/lib/format';

describe('format helpers', () => {
  it('formats BRL currency', () => {
    expect(formatCurrency(1500)).toMatch(/R\$\s?1\.500,00/);
  });

  it('formats ISO dates and empty due dates', () => {
    expect(formatDate('2024-01-10')).toBe('10/01/2024');
    expect(formatDate(null)).toBe('Sem vencimento');
  });
});
