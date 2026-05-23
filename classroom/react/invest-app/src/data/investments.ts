import type { InvestmentType, Investment } from '@/types/investment';

export const investmentTypes: InvestmentType[] = [
  {
    id: 'tesouro-ipca',
    name: 'Tesouro IPCA+',
    category: 'Fixed Income',
  },
  {
    id: 'cdb',
    name: 'CDB',
    category: 'Fixed Income',
  },
  {
    id: 'acoes',
    name: 'Ações',
    category: 'Variable Income',
  },
  {
    id: 'fii',
    name: 'FII',
    category: 'Variable Income',
  },
  {
    id: 'renda-fixa',
    name: 'Renda Fixa',
    category: 'Fixed Income',
  },
];

export const investments: Investment[] = [
  {
    id: 'aetg9941v91allu57kwa8miu',
    name: 'Tesouro IPCA+ 2045',
    type: 'tesouro-ipca',
    broker: 'Corretora Y',
    amount: 152000,
    yield: 'IPCA + 5%',
    category: 'Fixed Income',
    investedDate: '2023-05-14',
    dueDate: '2045-08-15',
  },
  {
    id: 'asbaa15dtm2uwvw7qs4fczvq',
    name: 'CDB Banco X',
    type: 'cdb',
    broker: 'Corretora Y',
    amount: 45300,
    yield: '110% CDI',
    category: 'Fixed Income',
    investedDate: '2024-01-02',
    dueDate: '2027-01-02',
  },
];
