export type InvestmentCategory = 'Fixed Income' | 'Variable Income';

export type InvestmentType = {
  id: string;
  name: string;
  category: InvestmentCategory;
};

export type Investment = {
  id: string;
  userId?: string | null;
  name: string;
  typeId: string;
  broker: string;
  amount: number;
  yield?: string;
  category: InvestmentCategory;
  investedDate: string;
  dueDate: string | null;
};

export type InvestmentFormValue = {
  name: string;
  typeId: string;
  broker: string;
  amountCents: number;
  yield: string;
  investedDate: string;
  dueDate: string;
};

export type InvestmentRow = {
  id: string;
  userId: string | null;
  name: string;
  type: string;
  broker: string;
  amount: number;
  yield: string | null;
  category: InvestmentCategory;
  investedDate: string;
  dueDate: string | null;
};

export type InvestmentTableRow = {
  id: string;
  user_id: string;
  name: string;
  type_id: string;
  broker: string;
  amount_cents: number;
  yield: string | null;
  invested_date: string;
  due_date: string | null;
};
