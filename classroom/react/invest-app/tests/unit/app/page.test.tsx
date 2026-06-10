import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import LandingPage from '@/app/page';

const useAuthMock = vi.fn();

vi.mock('@/stores/auth', () => ({
  useAuth: () => useAuthMock(),
}));

const mockUser = { id: 'user-1', email: 'investidor@email.com' } as User;

describe('LandingPage', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('renderiza a chamada principal e os cards de recursos', () => {
    useAuthMock.mockReturnValue({ user: null });

    render(<LandingPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Acompanhe sua carteira sem planilhas soltas\./i,
      }),
    ).toBeInTheDocument();

    // 4 recursos + amostra da carteira
    expect(
      screen.getByRole('heading', { name: 'Carteira centralizada' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Valores discretos' }),
    ).toBeInTheDocument();
    expect(screen.getByText('R$ 184.250,00')).toBeInTheDocument();
    expect(screen.getByText('Tesouro IPCA+ 2045')).toBeInTheDocument();
  });

  it('aponta os CTAs para login/registro quando anônimo', () => {
    useAuthMock.mockReturnValue({ user: null });

    render(<LandingPage />);

    expect(screen.getByRole('link', { name: /Criar conta/i })).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.getByRole('link', { name: /^Entrar$/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('aponta os CTAs para a área logada quando autenticado', () => {
    useAuthMock.mockReturnValue({ user: mockUser });

    render(<LandingPage />);

    expect(
      screen.getByRole('link', { name: /Abrir dashboard/i }),
    ).toHaveAttribute('href', '/dashboard');
    expect(
      screen.getByRole('link', { name: /Ver investimentos/i }),
    ).toHaveAttribute('href', '/investments');
  });
});
