import { Injectable, inject, signal } from '@angular/core';
import type {
  Investment,
  InvestmentRow,
  InvestmentTableRow,
  InvestmentType,
} from '../../shared/models/investment.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

const investmentSelect =
  'id, userId, name, type, broker, amount, yield, category, investedDate, dueDate';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly investments = signal<Investment[]>([]);
  readonly investmentTypes = signal<InvestmentType[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async load() {
    const userId = this.auth.user()?.id;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const [types, investments] = await Promise.all([
        this.fetchInvestmentTypes(),
        userId ? this.fetchInvestments(userId) : Promise.resolve([]),
      ]);

      this.investmentTypes.set(types);
      this.investments.set(investments);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar dados');
    } finally {
      this.isLoading.set(false);
    }
  }

  async save(investment: Investment) {
    const userId = this.auth.user()?.id;
    if (!userId) throw new Error('Nao autenticado');

    const { error } = await this.supabase
      .from('investments')
      .upsert(this.toInvestmentTableRow(investment, userId));

    if (error) throw error;

    const { data, error: selectError } = await this.supabase
      .from('investments_with_types')
      .select(investmentSelect)
      .eq('id', investment.id)
      .eq('userId', userId)
      .single();

    if (selectError) throw selectError;

    const storedInvestment = this.toInvestment(data as InvestmentRow);

    this.investments.update((current) =>
      current.some((item) => item.id === storedInvestment.id)
        ? current.map((item) => (item.id === storedInvestment.id ? storedInvestment : item))
        : [...current, storedInvestment].sort((a, b) => a.name.localeCompare(b.name)),
    );
    this.toast.show('Investimento salvo com sucesso', 'success');
  }

  async delete(id: string) {
    const userId = this.auth.user()?.id;
    if (!userId) throw new Error('Nao autenticado');

    const { error } = await this.supabase
      .from('investments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    this.investments.update((current) => current.filter((investment) => investment.id !== id));
    this.toast.show('Investimento removido com sucesso', 'success');
  }

  private async fetchInvestmentTypes() {
    const { data, error } = await this.supabase
      .from('investment_types')
      .select('id, name, category')
      .order('name');

    if (error) throw error;

    return data satisfies InvestmentType[];
  }

  private async fetchInvestments(userId: string) {
    const { data, error } = await this.supabase
      .from('investments_with_types')
      .select(investmentSelect)
      .eq('userId', userId)
      .order('name');

    if (error) throw error;

    return (data as InvestmentRow[]).map((row) => this.toInvestment(row));
  }

  private toInvestment(row: InvestmentRow): Investment {
    return {
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
    };
  }

  private toInvestmentTableRow(investment: Investment, userId: string): InvestmentTableRow {
    return {
      id: investment.id,
      user_id: userId,
      name: investment.name,
      type_id: investment.typeId,
      broker: investment.broker,
      amount_cents: investment.amount,
      yield: investment.yield ?? null,
      invested_date: investment.investedDate,
      due_date: investment.dueDate,
    };
  }
}
