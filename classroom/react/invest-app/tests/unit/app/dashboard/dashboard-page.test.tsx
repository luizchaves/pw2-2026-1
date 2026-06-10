import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
import { mockInvestments, mockPortfolioTotalLabel } from '@test/fixtures/investments';

const useVisibilityMock = vi.fn();
const useInvestmentsMock = vi.fn();

vi.mock('@/stores/visibility', () => ({
  useVisibility: () => useVisibilityMock(),
}));

vi.mock('@/hooks/useInvestments', () => ({
  useInvestments: () => useInvestmentsMock(),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    useVisibilityMock.mockReset();
    useInvestmentsMock.mockReset();
    useVisibilityMock.mockReturnValue({ showValues: true });
  });

  it('exibe o estado de carregamento', () => {
    useInvestmentsMock.mockReturnValue({ investments: [], isLoading: true });

    render(<DashboardPage />);

    expect(screen.getByRole('status', { name: 'Carregando carteira' })).toBeInTheDocument();
  });

  it('exibe o estado vazio quando não há investimentos', () => {
    useInvestmentsMock.mockReturnValue({ investments: [], isLoading: false });

    render(<DashboardPage />);

    expect(screen.getByText('Nenhum investimento ainda')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Cadastrar agora' }),
    ).toHaveAttribute('href', '/investments');
  });

  it('mostra o patrimônio total e a quantidade de ativos', () => {
    useInvestmentsMock.mockReturnValue({
      investments: mockInvestments,
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText(mockPortfolioTotalLabel)).toBeInTheDocument();
    expect(screen.getByText('2 investimentos')).toBeInTheDocument();
  });

  it('usa o singular quando há apenas um investimento', () => {
    useInvestmentsMock.mockReturnValue({
      investments: [mockInvestments[0]],
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText('1 investimento')).toBeInTheDocument();
  });

  it('oculta os valores quando showValues é falso', () => {
    useVisibilityMock.mockReturnValue({ showValues: false });
    useInvestmentsMock.mockReturnValue({
      investments: mockInvestments,
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText('••••••••')).toBeInTheDocument();
    expect(screen.queryByText(mockPortfolioTotalLabel)).not.toBeInTheDocument();
  });
});
