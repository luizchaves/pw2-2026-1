export type InvestmentCategory = 'Fixed Income' | 'Variable Income';

export type InvestmentYield =
  | `${number}%`
  | `IPCA + ${number}%`
  | `${number}% CDI`
  | `${number}% Selic`;

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType['id'];
  broker: string;
  amount: number;
  yield?: InvestmentYield;
  category: InvestmentCategory;
  investedDate: string;
  dueDate: string | null;
}

export type InvestmentType = {
  id: string;
  name: string;
  category: InvestmentCategory;
};
