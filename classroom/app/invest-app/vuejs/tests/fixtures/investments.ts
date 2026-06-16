import type { Investment, InvestmentType } from '@/schemas/investment';
import { toCents } from '@/schemas/investment';

const USER_ID = '00000000-0000-4000-8000-000000000001';

export const mockInvestmentTypes: InvestmentType[] = [
  { id: 'type-fixed', name: 'Tesouro Direto', category: 'Fixed Income' },
  { id: 'type-variable', name: 'Ações', category: 'Variable Income' },
];

export const mockInvestments: Investment[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    userId: USER_ID,
    name: 'Tesouro IPCA+ 2045',
    typeId: 'type-fixed',
    broker: 'XP Investimentos',
    amount: toCents(100_000),
    yield: 'IPCA + 5%',
    category: 'Fixed Income',
    investedDate: '2024-01-10',
    dueDate: '2045-08-15',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    userId: USER_ID,
    name: 'FII Logística',
    typeId: 'type-variable',
    broker: 'Rico',
    amount: toCents(50_000),
    yield: undefined,
    category: 'Variable Income',
    investedDate: '2024-03-01',
    dueDate: null,
  },
];

export const mockPortfolioTotalLabel = /1\.500,00/;
