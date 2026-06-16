import { requireSupabaseConfig, supabase } from './client.js'

const investmentSelect =
  'id, userId, name, type, broker, amount, yield, category, investedDate, dueDate'

const toInvestment = (row) => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  typeId: row.type,
  broker: row.broker,
  amount: row.amount,
  yield: row.yield ?? undefined,
  category: row.category,
  investedDate: row.investedDate,
  dueDate: row.dueDate,
})

const toInvestmentRow = (investment, userId) => ({
  id: investment.id,
  user_id: userId,
  name: investment.name,
  type_id: investment.typeId,
  broker: investment.broker,
  amount_cents: investment.amount,
  yield: investment.yield ?? null,
  invested_date: investment.investedDate,
  due_date: investment.dueDate,
})

export async function getInvestmentTypes() {
  requireSupabaseConfig()

  const { data, error } = await supabase
    .from('investment_types')
    .select('id, name, category')
    .order('name')

  if (error) throw error

  return data ?? []
}

export async function getInvestments(userId) {
  requireSupabaseConfig()

  const { data, error } = await supabase
    .from('investments_with_types')
    .select(investmentSelect)
    .eq('userId', userId)
    .order('name')

  if (error) throw error

  return (data ?? []).map(toInvestment)
}

export async function upsertInvestment(investment, userId) {
  requireSupabaseConfig()

  const { data: existingInvestment, error: ownershipError } = await supabase
    .from('investments')
    .select('user_id')
    .eq('id', investment.id)
    .maybeSingle()

  if (ownershipError) throw ownershipError

  if (existingInvestment?.user_id && existingInvestment.user_id !== userId) {
    throw new Error('Investimento não encontrado')
  }

  const { error } = await supabase.from('investments').upsert(toInvestmentRow(investment, userId))

  if (error) throw error

  const { data, error: selectError } = await supabase
    .from('investments_with_types')
    .select(investmentSelect)
    .eq('id', investment.id)
    .eq('userId', userId)
    .single()

  if (selectError) throw selectError

  return toInvestment(data)
}

export async function removeInvestment(id, userId) {
  requireSupabaseConfig()

  const { error } = await supabase.from('investments').delete().eq('id', id).eq('user_id', userId)

  if (error) throw error
}
