import { mockInvestmentTypes } from '@test/fixtures/investments';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/investment-types/route';

vi.mock('@/services/supabase/investments', () => ({
  getInvestmentTypes: vi.fn(),
}));

import { getInvestmentTypes } from '@/services/supabase/investments';

const mockGetInvestmentTypes = vi.mocked(getInvestmentTypes);

beforeEach(() => {
  mockGetInvestmentTypes.mockReset();
});

describe('GET /api/investment-types', () => {
  it('returns 200 with investment types', async () => {
    mockGetInvestmentTypes.mockResolvedValue(mockInvestmentTypes);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockInvestmentTypes);
  });

  it('returns 500 when the service throws', async () => {
    mockGetInvestmentTypes.mockRejectedValue(new Error('DB error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'DB error' });
  });

  it('returns a generic message when error is not an Error instance', async () => {
    mockGetInvestmentTypes.mockRejectedValue('unknown');

    const response = await GET();

    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Erro interno do servidor');
  });
});
