import { Component, inject, signal } from '@angular/core';
import { LucidePlus } from '@lucide/angular';
import { InvestmentService } from '../../core/services/investment.service';
import { VisibilityService } from '../../core/services/visibility.service';
import { InvestmentCardComponent } from '../../shared/components/investment-card/investment-card.component';
import { InvestmentFormComponent } from '../../shared/components/investment-form/investment-form.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import type { Investment } from '../../shared/models/investment.model';

@Component({
  selector: 'app-investments-page',
  imports: [InvestmentCardComponent, InvestmentFormComponent, LucidePlus, ModalComponent],
  template: `
    <section class="page-section">
      <div class="page-header">
        <div>
          <p class="eyebrow">Portfolio</p>
          <h1>Meus investimentos</h1>
          <p>
            Uma visao rapida dos seus principais ativos, com retorno, valor investido e datas
            importantes.
          </p>
        </div>
        <button type="button" class="button button-primary" (click)="openCreateForm()">
          <svg lucidePlus size="16" />
          Cadastrar investimento
        </button>
      </div>

      @if (investments.error() || actionError()) {
        <div class="alert alert-error">{{ investments.error() || actionError() }}</div>
      }

      @if (investments.isLoading()) {
        <div class="investment-grid" role="status" aria-label="Carregando investimentos">
          @for (item of skeletons; track item) {
            <div class="investment-card skeleton-card">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
            </div>
          }
        </div>
      } @else if (investments.investments().length === 0) {
        <article class="empty-card wide">
          <h2>Nenhum investimento cadastrado</h2>
          <p>Clique em "Cadastrar investimento" para adicionar o seu primeiro ativo.</p>
        </article>
      } @else {
        <div class="investment-grid">
          @for (investment of investments.investments(); track investment.id) {
            <app-investment-card
              [investment]="investment"
              [showValues]="visibility.showValues()"
              (edit)="edit(investment)"
              (remove)="deletingInvestment.set(investment)"
            />
          }
        </div>
      }

      @if (showForm()) {
        <app-investment-form
          [investment]="editingInvestment()"
          [investmentTypes]="investments.investmentTypes()"
          (save)="saveInvestment($event)"
          (close)="closeForm()"
        />
      }

      @if (deletingInvestment(); as investment) {
        <app-modal title="Remover investimento" (close)="deletingInvestment.set(null)">
          <p class="modal-copy">
            Tem certeza que deseja remover
            <strong>{{ investment.name }}</strong>
            ? Essa acao nao pode ser desfeita.
          </p>
          <div class="modal-actions">
            <button type="button" class="button button-outline" (click)="deletingInvestment.set(null)">
              Cancelar
            </button>
            <button type="button" class="button button-danger" (click)="confirmDelete()">
              Remover
            </button>
          </div>
        </app-modal>
      }
    </section>
  `,
})
export class InvestmentsPageComponent {
  protected readonly investments = inject(InvestmentService);
  protected readonly visibility = inject(VisibilityService);
  protected readonly showForm = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly editingInvestment = signal<Investment | null>(null);
  protected readonly deletingInvestment = signal<Investment | null>(null);
  protected readonly skeletons = ['one', 'two', 'three'];

  constructor() {
    void this.investments.load();
  }

  protected openCreateForm() {
    this.editingInvestment.set(null);
    this.showForm.set(true);
  }

  protected edit(investment: Investment) {
    this.editingInvestment.set(investment);
    this.showForm.set(true);
  }

  protected closeForm() {
    this.showForm.set(false);
    this.editingInvestment.set(null);
  }

  protected async saveInvestment(investment: Investment) {
    try {
      this.actionError.set(null);
      await this.investments.save(investment);
      this.closeForm();
    } catch (error) {
      this.actionError.set(
        error instanceof Error ? error.message : 'Nao foi possivel salvar o investimento',
      );
    }
  }

  protected async confirmDelete() {
    const investment = this.deletingInvestment();
    if (!investment) return;

    try {
      this.actionError.set(null);
      await this.investments.delete(investment.id);
      this.deletingInvestment.set(null);
    } catch (error) {
      this.actionError.set(
        error instanceof Error ? error.message : 'Nao foi possivel remover o investimento',
      );
    }
  }
}
