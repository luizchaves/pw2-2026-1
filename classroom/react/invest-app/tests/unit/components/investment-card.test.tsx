import { mockInvestments } from '@test/fixtures/investments';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InvestmentCard from '@/components/InvestmentCard';

const fixedInvestment = mockInvestments[0]; // Fixed Income, amount 100_000, yield IPCA+5%
const variableInvestment = mockInvestments[1]; // Variable Income, amount 50_000, no yield, no dueDate

const onEdit = vi.fn();
const onDelete = vi.fn();

beforeEach(() => {
  onEdit.mockReset();
  onDelete.mockReset();
});

describe('InvestmentCard', () => {
  it('renders the investment name', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole('heading', { name: fixedInvestment.name })).toBeInTheDocument();
  });

  it('renders the broker', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText(fixedInvestment.broker)).toBeInTheDocument();
  });

  it('shows the formatted amount when showValues is true', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    // 100_000 centavos = R$ 1.000,00
    expect(screen.getByText(/1\.000,00/)).toBeInTheDocument();
  });

  it('hides the amount when showValues is false', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('••••••')).toBeInTheDocument();
    expect(screen.queryByText(/1\.000,00/)).not.toBeInTheDocument();
  });

  it('shows yield text when provided', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('IPCA + 5%')).toBeInTheDocument();
  });

  it('shows "Nao informado" when yield is not provided', () => {
    render(
      <InvestmentCard
        investment={variableInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Nao informado')).toBeInTheDocument();
  });

  it('shows "Sem vencimento" when dueDate is null', () => {
    render(
      <InvestmentCard
        investment={variableInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Sem vencimento')).toBeInTheDocument();
  });

  it('shows the Fixed Income category badge', () => {
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Renda Fixa')).toBeInTheDocument();
  });

  it('shows the Variable Income category badge', () => {
    render(
      <InvestmentCard
        investment={variableInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Renda Variavel')).toBeInTheDocument();
  });

  it('calls onEdit when the first action button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const [editBtn] = screen.getAllByRole('button');
    await user.click(editBtn);
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it('calls onDelete when the second action button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <InvestmentCard
        investment={fixedInvestment}
        showValues
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const [, deleteBtn] = screen.getAllByRole('button');
    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
