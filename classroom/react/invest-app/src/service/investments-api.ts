import type { Investment, InvestmentType } from '@/schemas/investment';
import { supabaseBrowser } from '@/lib/supabase-browser';

async function fetchApi<T>(input: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(payload?.error ?? 'A requisição falhou');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getInvestmentTypes() {
  return fetchApi<InvestmentType[]>('/api/investment-types');
}

export function getInvestments() {
  return fetchApi<Investment[]>('/api/investments');
}

export function saveInvestment(investment: Investment) {
  return fetchApi<Investment>('/api/investments', {
    method: 'POST',
    body: JSON.stringify(investment),
  });
}

export function deleteInvestment(id: string) {
  return fetchApi<void>(`/api/investments/${id}`, {
    method: 'DELETE',
  });
}
