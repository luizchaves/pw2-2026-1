import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Investment, InvestmentType } from '../../models/investment.model';
import { formatCents, parseCents } from '../../utils/format';
import { optionalYieldValidator } from '../../utils/validators';
import { ModalComponent } from '../modal/modal.component';

const categoryLabels: Record<string, string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variavel',
};

const todayISO = new Date().toISOString().split('T')[0];

@Component({
  selector: 'app-investment-form',
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal [title]="investment() ? 'Editar investimento' : 'Novo investimento'" (close)="close.emit()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="form-stack">
        <label class="field">
          <span>Nome</span>
          <input formControlName="name" placeholder="Ex: Tesouro IPCA+ 2045" />
          @if (showError('name')) {
            <small>Nome e obrigatorio</small>
          }
        </label>

        <div class="form-grid two">
          <label class="field">
            <span>Tipo</span>
            <select formControlName="typeId">
              @for (type of investmentTypes(); track type.id) {
                <option [value]="type.id">{{ type.name }}</option>
              }
            </select>
            @if (showError('typeId')) {
              <small>Tipo e obrigatorio</small>
            }
          </label>

          <label class="field">
            <span>Categoria</span>
            <input [value]="selectedCategoryLabel()" readonly />
          </label>
        </div>

        <div class="form-grid two">
          <label class="field">
            <span>Corretora</span>
            <input formControlName="broker" placeholder="Ex: XP Investimentos" />
            @if (showError('broker')) {
              <small>Corretora e obrigatoria</small>
            }
          </label>

          <label class="field">
            <span>Valor (R$)</span>
            <input
              [value]="amountDisplay()"
              inputmode="numeric"
              placeholder="0,00"
              (input)="changeAmount($event)"
            />
            @if (showError('amountCents')) {
              <small>Valor deve ser maior que zero</small>
            }
          </label>
        </div>

        <label class="field">
          <span>
            Rendimento
            <em>(opcional - ex: IPCA + 5%, 110% CDI, 100% Selic, 15%)</em>
          </span>
          <input formControlName="yield" placeholder="Ex: 100% Selic" />
          @if (form.controls.yield.hasError('yieldFormat')) {
            <small>Formatos aceitos: 15%, IPCA + 5%, 110% CDI, 100% Selic</small>
          }
        </label>

        <div class="form-grid two">
          <label class="field">
            <span>Data de aporte</span>
            <input type="date" formControlName="investedDate" />
            @if (showError('investedDate')) {
              <small>Data de aporte e obrigatoria</small>
            }
          </label>

          <label class="field">
            <span>Vencimento <em>(opcional)</em></span>
            <input type="date" formControlName="dueDate" />
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="button button-outline" (click)="close.emit()">Cancelar</button>
          <button type="submit" class="button button-primary" [disabled]="!selectedType()">
            {{ investment() ? 'Salvar' : 'Cadastrar' }}
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class InvestmentFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly investment = input<Investment | null>(null);
  readonly investmentTypes = input.required<InvestmentType[]>();
  readonly save = output<Investment>();
  readonly close = output<void>();

  protected readonly amountDisplay = signal('');
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    typeId: ['', [Validators.required]],
    broker: ['', [Validators.required]],
    amountCents: [0, [Validators.required, Validators.min(1)]],
    yield: ['', [optionalYieldValidator]],
    investedDate: [todayISO, [Validators.required]],
    dueDate: [''],
  });

  protected readonly selectedType = computed(() => {
    const typeId = this.form.controls.typeId.value;
    return this.investmentTypes().find((type) => type.id === typeId) ?? this.investmentTypes()[0];
  });

  protected readonly selectedCategoryLabel = computed(() => {
    const category = this.selectedType()?.category;
    return category ? categoryLabels[category] : '';
  });

  constructor() {
    effect(() => {
      const investment = this.investment();
      const defaultType = this.investmentTypes()[0];

      if (investment) {
        this.form.reset({
          name: investment.name,
          typeId: investment.typeId,
          broker: investment.broker,
          amountCents: investment.amount,
          yield: investment.yield ?? '',
          investedDate: investment.investedDate,
          dueDate: investment.dueDate ?? '',
        });
        this.amountDisplay.set(formatCents(investment.amount));
        return;
      }

      this.form.reset({
        name: '',
        typeId: defaultType?.id ?? '',
        broker: '',
        amountCents: 0,
        yield: '',
        investedDate: todayISO,
        dueDate: '',
      });
      this.amountDisplay.set('');
    });
  }

  protected showError(controlName: keyof typeof this.form.controls) {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected changeAmount(event: Event) {
    const input = event.target as HTMLInputElement;
    const cents = parseCents(input.value);
    this.form.controls.amountCents.setValue(cents);
    this.form.controls.amountCents.markAsDirty();
    this.amountDisplay.set(formatCents(cents));
  }

  protected submit() {
    this.form.markAllAsTouched();
    const selectedType = this.selectedType();

    if (this.form.invalid || !selectedType) return;

    const data = this.form.getRawValue();
    this.save.emit({
      id: this.investment()?.id ?? crypto.randomUUID(),
      name: data.name,
      typeId: data.typeId,
      broker: data.broker,
      amount: data.amountCents,
      yield: data.yield || undefined,
      category: selectedType.category,
      investedDate: data.investedDate,
      dueDate: data.dueDate || null,
    });
  }
}
