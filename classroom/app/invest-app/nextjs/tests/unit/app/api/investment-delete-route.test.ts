import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DELETE } from '@/app/api/investments/[id]/route';

vi.mock('server-only', () => ({}));
vi.mock('@/services/supabase/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  getBearerToken: vi.fn(),
}));

vi.mock('@/services/supabase/investments', () => ({
  deleteInvestment: vi.fn(),
}));

import { getAuthenticatedUser, getBearerToken } from '@/services/supabase/auth';
import { deleteInvestment } from '@/services/supabase/investments';

const mockAuth = vi.mocked(getAuthenticatedUser);
const mockGetBearerToken = vi.mocked(getBearerToken);
const mockDelete = vi.mocked(deleteInvestment);

const MOCK_USER_ID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const MOCK_USER = { id: MOCK_USER_ID } as Awaited<ReturnType<typeof getAuthenticatedUser>>;
const MOCK_ACCESS_TOKEN = 'test-token';
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000';

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeRequest() {
  return new Request(`http://localhost/api/investments/${VALID_ID}`, {
    method: 'DELETE',
  });
}

beforeEach(() => {
  mockAuth.mockReset();
  mockGetBearerToken.mockReset();
  mockDelete.mockReset();
  mockGetBearerToken.mockReturnValue(MOCK_ACCESS_TOKEN);
});

describe('DELETE /api/investments/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await DELETE(makeRequest(), makeContext(VALID_ID));

    expect(response.status).toBe(401);
  });

  it('returns 204 on successful deletion', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockDelete.mockResolvedValue(undefined);

    const response = await DELETE(makeRequest(), makeContext(VALID_ID));

    expect(response.status).toBe(204);
    expect(mockDelete).toHaveBeenCalledWith(VALID_ID, MOCK_USER_ID, MOCK_ACCESS_TOKEN);
  });

  it('returns 400 for a non-UUID id', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);

    const response = await DELETE(makeRequest(), makeContext('not-a-uuid'));

    expect(response.status).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockDelete.mockRejectedValue(new Error('Investment not found'));

    const response = await DELETE(makeRequest(), makeContext(VALID_ID));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Investment not found' });
  });
});
