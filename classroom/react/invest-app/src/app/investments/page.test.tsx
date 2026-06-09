import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Investment } from '@/schemas/investment';
import InvestmentsPage from './page';
import { mockInvestments, mockInvestmentTypes } from '@/test/fixtures';

const useVisibilityMock = vi.fn();
const useInvestmentsMock = vi.fn();
const saveInvestment = vi.fn();
const deleteInvestment = vi.fn();

vi.mock('@/contexts/visibility', () => ({
  useVisibility: () => useVisibilityMock(),
}));

vi.mock('@/contexts/investments', () => ({
  useInvestments: () => useInvestmentsMock(),
}));

// Stub leve do card: expõe botões rotulados para acionar editar/remover.
vi.mock('@/components/InvestmentCard', () => ({
  default: ({
    investment,
    onEdit,
    onDelete,
  }: {
    investment: Investment;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <article>
      <h2>{investment.name}</h2>
      <button onClick={onEdit}>editar-{investment.id}</button>
      <button onClick={onDelete}>remover-{investment.id}</button>
    </article>
  ),
}));

// Stub do formulário: react-hook-form é testado à parte; aqui só importa
// que a página o monte e feche.
vi.mock('@/components/InvestmentForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div role="dialog" aria-label="formulario-investimento">
      <p>Formulário de investimento</p>
      <button onClick={onClose}>fechar-formulario</button>
    </div>
  ),
}));

const baseContext = {
  investments: mockInvestments,
  investmentTypes: mockInvestmentTypes,
  isLoading: false,
  error: null,
  saveInvestment,
  deleteInvestment,
};

describe('InvestmentsPage', () => {
  beforeEach(() => {
    useVisibilityMock.mockReset();
    useInvestmentsMock.mockReset();
    saveInvestment.mockReset();
    deleteInvestment.mockReset();
    useVisibilityMock.mockReturnValue({ showValues: true });
    useInvestmentsMock.mockReturnValue(baseContext);
  });

  it('exibe o estado de carregamento', () => {
    useInvestmentsMock.mockReturnValue({ ...baseContext, isLoading: true });

    render(<InvestmentsPage />);

    expect(screen.getByText('Carregando investimentos')).toBeInTheDocument();
  });

  it('exibe o estado vazio quando não há investimentos', () => {
    useInvestmentsMock.mockReturnValue({ ...baseContext, investments: [] });

    render(<InvestmentsPage />);

    expect(
      screen.getByText('Nenhum investimento cadastrado'),
    ).toBeInTheDocument();
  });

  it('mostra o erro vindo do contexto', () => {
    useInvestmentsMock.mockReturnValue({
      ...baseContext,
      error: 'Falha ao carregar investimentos',
    });

    render(<InvestmentsPage />);

    expect(
      screen.getByText('Falha ao carregar investimentos'),
    ).toBeInTheDocument();
  });

  it('lista os investimentos mockados', () => {
    render(<InvestmentsPage />);

    expect(screen.getByText('Tesouro IPCA+ 2045')).toBeInTheDocument();
    expect(screen.getByText('FII Logística')).toBeInTheDocument();
  });

  it('abre o formulário ao clicar em "Cadastrar investimento"', async () => {
    const user = userEvent.setup();
    render(<InvestmentsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Cadastrar investimento' }),
    );

    expect(
      screen.getByRole('dialog', { name: 'formulario-investimento' }),
    ).toBeInTheDocument();
  });

  it('confirma a remoção e chama deleteInvestment com o id correto', async () => {
    const user = userEvent.setup();
    deleteInvestment.mockResolvedValue(undefined);
    render(<InvestmentsPage />);

    await user.click(
      screen.getByRole('button', {
        name: `remover-${mockInvestments[1].id}`,
      }),
    );

    // Modal de confirmação real é renderizado pela página.
    expect(
      screen.getByRole('heading', { name: 'Remover investimento' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover' }));

    await waitFor(() =>
      expect(deleteInvestment).toHaveBeenCalledWith(mockInvestments[1].id),
    );
  });
});
