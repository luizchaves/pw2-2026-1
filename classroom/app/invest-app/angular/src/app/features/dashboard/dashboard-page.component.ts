import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InvestmentService } from '../../core/services/investment.service';
import { VisibilityService } from '../../core/services/visibility.service';
import { formatCurrency } from '../../shared/utils/format';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  template: `
    <section class="page-section">
      <div class="dashboard-grid">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h1>Controle seus investimentos com clareza.</h1>
          <p class="section-copy">
            Acompanhe aportes, vencimentos e rendimento da sua carteira em um unico lugar.
          </p>
          <div class="hero-actions">
            <a routerLink="/investments" class="button button-primary">Ver investimentos</a>
            <a routerLink="/investments" class="button button-outline">Cadastrar ativo</a>
          </div>
        </div>

        @if (investments.isLoading()) {
          <article class="summary-card skeleton" role="status" aria-label="Carregando carteira">
            <div class="skeleton-line short"></div>
            <div class="skeleton-box"></div>
            <div class="skeleton-box"></div>
          </article>
        } @else if (totalCount() === 0) {
          <article class="empty-card">
            <h2>Nenhum investimento ainda</h2>
            <p>Adicione seu primeiro ativo e comece a acompanhar sua carteira.</p>
            <a routerLink="/investments" class="button button-primary">Cadastrar agora</a>
          </article>
        } @else {
          <article class="summary-card">
            <p class="eyebrow compact">Resumo rapido</p>
            <div class="summary-list">
              <div class="summary-item">
                <span>Patrimonio total</span>
                <strong>{{ visibility.showValues() ? totalAmountLabel() : '••••••••' }}</strong>
              </div>
              <div class="summary-item">
                <span>Ativos cadastrados</span>
                <strong>
                  {{ totalCount() }}
                  {{ totalCount() === 1 ? 'investimento' : 'investimentos' }}
                </strong>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class DashboardPageComponent {
  protected readonly investments = inject(InvestmentService);
  protected readonly visibility = inject(VisibilityService);
  protected readonly totalCount = computed(() => this.investments.investments().length);
  protected readonly totalAmount = computed(() =>
    this.investments.investments().reduce((sum, investment) => sum + investment.amount, 0),
  );
  protected readonly totalAmountLabel = computed(() => formatCurrency(this.totalAmount() / 100));

  constructor() {
    void this.investments.load();
  }
}
