import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockInvestments, mockInvestmentTypes } from '@test/fixtures/investments';

vi.mock('@/providers/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
      }),
    },
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

const { getInvestments, getInvestmentTypes, saveInvestment, deleteInvestment } =
  await import('@/services/api/investments');

describe('investments API service', () => {
  beforeEach(() => fetchMock.mockReset());

  it('getInvestmentTypes fetches from /api/investment-types with auth header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockInvestmentTypes),
    });

    const result = await getInvestmentTypes();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/investment-types',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
    expect(result).toEqual(mockInvestmentTypes);
  });

  it('getInvestments fetches from /api/investments with auth header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockInvestments),
    });

    const result = await getInvestments();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/investments',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
    expect(result).toEqual(mockInvestments);
  });

  it('throws the server error message when response is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Servidor indisponível' }),
    });

    await expect(getInvestments()).rejects.toThrow('Servidor indisponível');
  });

  it('throws generic message when error response has no body', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('no body')),
    });

    await expect(getInvestments()).rejects.toThrow('A requisição falhou');
  });

  it('saveInvestment sends POST with investment body', async () => {
    const investment = mockInvestments[0];
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(investment),
    });

    await saveInvestment(investment);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/investments',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(investment),
      }),
    );
  });

  it('deleteInvestment sends DELETE to /api/investments/:id', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 204 });

    await deleteInvestment('test-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/investments/test-id',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
