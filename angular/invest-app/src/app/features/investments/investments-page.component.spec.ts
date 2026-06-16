import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { InvestmentService } from '../../core/services/investment.service';
import { VisibilityService } from '../../core/services/visibility.service';
import { mockInvestments, mockInvestmentTypes } from '../../testing/investment-fixtures';
import { InvestmentsPageComponent } from './investments-page.component';

describe('InvestmentsPageComponent', () => {
  const render = async (
    options: { loading?: boolean; investments?: unknown[]; error?: string | null } = {},
  ) => {
    const investments = signal(options.investments ?? mockInvestments);
    const isLoading = signal(Boolean(options.loading));
    const error = signal(options.error ?? null);
    const save = vi.fn().mockResolvedValue(undefined);
    const remove = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: InvestmentService,
          useValue: {
            investments,
            investmentTypes: signal(mockInvestmentTypes),
            isLoading,
            error,
            load: () => Promise.resolve(),
            save,
            delete: remove,
          },
        },
        { provide: VisibilityService, useValue: { showValues: signal(true) } },
      ],
    });

    const fixture = TestBed.createComponent(InvestmentsPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, save, remove };
  };

  it('shows loading state', async () => {
    const { fixture } = await render({ loading: true });

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('shows empty state', async () => {
    const { fixture } = await render({ investments: [] });

    expect(fixture.nativeElement.textContent).toContain('Nenhum investimento cadastrado');
  });

  it('shows service error', async () => {
    const { fixture } = await render({ error: 'Falha ao carregar investimentos' });

    expect(fixture.nativeElement.textContent).toContain('Falha ao carregar investimentos');
  });

  it('lists investments', async () => {
    const { fixture } = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Tesouro IPCA+ 2045');
    expect(text).toContain('FII Logistica');
  });

  it('opens the investment form', async () => {
    const { fixture } = await render();

    fixture.nativeElement.querySelector('.page-header button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Novo investimento');
  });

  it('confirms removal and calls delete with the id', async () => {
    const { fixture, remove } = await render();
    const deleteButtons = fixture.nativeElement.querySelectorAll(
      '.investment-actions .button-danger',
    );

    deleteButtons[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Remover investimento');

    fixture.nativeElement.querySelector('.modal-actions .button-danger').click();
    await fixture.whenStable();

    expect(remove).toHaveBeenCalledWith(mockInvestments[1].id);
  });
});
