import { Component, input, output } from '@angular/core';
import {
  LucideCalendarDays,
  LucideLandmark,
  LucidePencil,
  LucideTrash2,
  LucideTrendingUp,
} from '@lucide/angular';
import type { Investment } from '../../models/investment.model';
import { formatCurrency, formatDate } from '../../utils/format';

const categoryLabel: Record<Investment['category'], string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variável',
};

@Component({
  selector: 'app-investment-card',
  imports: [LucideCalendarDays, LucideLandmark, LucidePencil, LucideTrash2, LucideTrendingUp],
  template: `
    <article class="investment-card">
      <header class="investment-header">
        <h2>{{ investment().name }}</h2>
        <span class="category-badge" [class.variable]="investment().category === 'Variable Income'">
          {{ categoryLabel[investment().category] }}
        </span>
      </header>

      <div class="amount-panel">
        <span>Valor investido</span>
        <strong>{{ showValues() ? amountLabel() : '••••••••' }}</strong>
      </div>

      <div class="detail-list">
        <div class="detail-item">
          <svg lucideTrendingUp size="16" />
          <span>Rentabilidade</span>
          <strong>{{ investment().yield || 'Nao informado' }}</strong>
        </div>
        <div class="detail-item">
          <svg lucideLandmark size="16" />
          <span>Corretora</span>
          <strong>{{ investment().broker }}</strong>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <svg lucideCalendarDays size="16" />
            <span>Aporte</span>
            <strong>{{ formatDate(investment().investedDate) }}</strong>
          </div>
          <div class="detail-item">
            <svg lucideCalendarDays size="16" />
            <span>Vencimento</span>
            <strong>{{ formatDate(investment().dueDate) }}</strong>
          </div>
        </div>
      </div>

      <footer class="investment-actions">
        <button type="button" class="button button-outline compact" (click)="edit.emit()">
          <svg lucidePencil size="16" />
          Editar
        </button>
        <button type="button" class="button button-danger compact" (click)="remove.emit()">
          <svg lucideTrash2 size="16" />
          Excluir
        </button>
      </footer>
    </article>
  `,
})
export class InvestmentCardComponent {
  readonly investment = input.required<Investment>();
  readonly showValues = input.required<boolean>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly categoryLabel = categoryLabel;
  protected readonly formatDate = formatDate;

  protected amountLabel() {
    return formatCurrency(this.investment().amount / 100);
  }
}
