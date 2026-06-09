import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { mockInvestments } from '@/test/fixtures';

vi.mock('server-only', () => ({}));
vi.mock('@/services/supabase/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));
vi.mock('@/services/supabase/investments', () => ({
  getInvestments: vi.fn(),
  saveInvestment: vi.fn(),
}));

import { getAuthenticatedUser } from '@/services/supabase/auth';
import { getInvestments, saveInvestment } from '@/services/supabase/investments';

const mockAuth = vi.mocked(getAuthenticatedUser);
const mockGetInvestments = vi.mocked(getInvestments);
const mockSaveInvestment = vi.mocked(saveInvestment);

const MOCK_USER = { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' } as Awaited<ReturnType<typeof getAuthenticatedUser>>;

const validInvestment = {
  ...mockInvestments[0],
  id: '550e8400-e29b-41d4-a716-446655440000',
  userId: MOCK_USER!.id,
};

function makeRequest(body?: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/investments', {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  mockAuth.mockReset();
  mockGetInvestments.mockReset();
  mockSaveInvestment.mockReset();
});

describe('GET /api/investments', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await GET(makeRequest());

    expect(response.status).toBe(401);
  });

  it('returns 200 with investments for authenticated user', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockGetInvestments.mockResolvedValue(mockInvestments);

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockInvestments);
    expect(mockGetInvestments).toHaveBeenCalledWith(MOCK_USER!.id);
  });

  it('returns 500 when service throws', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockGetInvestments.mockRejectedValue(new Error('DB down'));

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'DB down' });
  });
});

describe('POST /api/investments', () => {

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await POST(makeRequest(validInvestment));

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid investment payload', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);

    const response = await POST(makeRequest({ name: '' }));

    expect(response.status).toBe(400);
  });

  it('returns 200 with saved investment on success', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockSaveInvestment.mockResolvedValue(validInvestment);

    const response = await POST(makeRequest(validInvestment));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(validInvestment);
    expect(mockSaveInvestment).toHaveBeenCalledWith(validInvestment, MOCK_USER!.id);
  });

  it('returns 500 when service throws', async () => {
    mockAuth.mockResolvedValue(MOCK_USER);
    mockSaveInvestment.mockRejectedValue(new Error('Save failed'));

    const response = await POST(makeRequest(validInvestment));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Save failed' });
  });
});
