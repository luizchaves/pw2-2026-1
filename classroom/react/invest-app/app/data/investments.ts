export type Investment = {
  id: string;
  name: string;
  description: string;
  amount: number;
  yieldValue: number;
  category: 'Fixed Income' | 'Variable Income';
  investedDate: string; // ISO format date string
  maturityDate: string | null; // ISO format date string or null for non-maturing investments
};

export const investments: Investment[] = [
  {
    id: 'aetg9941v91allu57kwa8miu',
    name: 'Tesouro Direto IPCA+',
    description: 'TD 2045',
    amount: 152000,
    yieldValue: 12.5,
    category: 'Fixed Income',
    investedDate: '2023-05-14',
    maturityDate: '2045-08-15',
  },
  {
    id: 'asbaa15dtm2uwvw7qs4fczvq',
    name: 'CDB Banco Itaú Unibanco',
    description: '110% CDI',
    amount: 45300,
    yieldValue: 10.2,
    category: 'Fixed Income',
    investedDate: '2024-01-02',
    maturityDate: '2026-01-02',
  },
];
