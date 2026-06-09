import 'server-only';

import { supabase } from '@/lib/supabase';
import type { Investment, InvestmentType } from '@/schemas/investment';

type InvestmentRow = {
  id: string;
  name: string;
  type: string;
  broker: string;
  amount: number;
  yield: string | null;
  category: Investment['category'];
  investedDate: string;
  dueDate: string | null;
};

type InvestmentTableRow = {
  id: string;
  name: string;
  type_id: string;
  broker: string;
  amount_cents: number;
  yield: string | null;
  invested_date: string;
  due_date: string | null;
};

const investmentSelect =
  'id, name, type, broker, amount, yield, category, investedDate, dueDate';

const toInvestment = (row: InvestmentRow): Investment => ({
  id: row.id,
  name: row.name,
  type: row.type,
  broker: row.broker,
  amount: row.amount,
  yield: row.yield ?? undefined,
  category: row.category,
  investedDate: row.investedDate,
  dueDate: row.dueDate,
});

const toInvestmentRow = (investment: Investment): InvestmentTableRow => ({
  id: investment.id,
  name: investment.name,
  type_id: investment.type,
  broker: investment.broker,
  amount_cents: investment.amount,
  yield: investment.yield ?? null,
  invested_date: investment.investedDate,
  due_date: investment.dueDate,
});

export async function getInvestmentTypes() {
  const { data, error } = await supabase
    .from('investment_types')
    .select('id, name, category')
    .order('name');

  if (error) throw error;

  return data satisfies InvestmentType[];
}

export async function getInvestments() {
  const { data, error } = await supabase
    .from('investments_with_types')
    .select(investmentSelect)
    .order('name');

  if (error) throw error;

  return data.map((row) => toInvestment(row as InvestmentRow));
}

export async function saveInvestment(investment: Investment) {
  const { error } = await supabase
    .from('investments')
    .upsert(toInvestmentRow(investment));

  if (error) throw error;

  const { data, error: selectError } = await supabase
    .from('investments_with_types')
    .select(investmentSelect)
    .eq('id', investment.id)
    .single();

  if (selectError) throw selectError;

  return toInvestment(data as InvestmentRow);
}

export async function deleteInvestment(id: string) {
  const { error } = await supabase.from('investments').delete().eq('id', id);

  if (error) throw error;
}
