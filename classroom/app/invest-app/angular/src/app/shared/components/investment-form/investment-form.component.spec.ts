import type { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { mockInvestments, mockInvestmentTypes } from '../../../testing/investment-fixtures';
import { InvestmentFormComponent } from './investment-form.component';

const setInputValue = (input: HTMLInputElement | HTMLSelectElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input'));
};

describe('InvestmentFormComponent', () => {
  const render = async (investment = null) => {
    const fixture = TestBed.createComponent(InvestmentFormComponent);
    const componentRef: ComponentRef<InvestmentFormComponent> = fixture.componentRef;
    componentRef.setInput('investment', investment);
    componentRef.setInput('investmentTypes', mockInvestmentTypes);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  };

  it('renders create mode with default investment type', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Novo investimento');
    expect(text).toContain('Tesouro Direto');
    expect(fixture.nativeElement.querySelector('select').value).toBe('type-fixed');
  });

  it('renders edit mode values', async () => {
    const fixture = await render(mockInvestments[0] as never);
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Editar investimento');
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe(
      'Tesouro IPCA+ 2045',
    );
  });

  it('validates required fields before submitting', async () => {
    const fixture = await render();
    const save = vi.fn();
    fixture.componentInstance.save.subscribe(save);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(save).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Nome e obrigatorio');
  });

  it('emits an investment on valid submit', async () => {
    const fixture = await render();
    const save = vi.fn();
    fixture.componentInstance.save.subscribe(save);
    const inputs = fixture.nativeElement.querySelectorAll('input');

    setInputValue(inputs[0], 'CDB Banco X');
    setInputValue(inputs[2], 'XP Investimentos');
    setInputValue(inputs[3], '1.234,56');
    setInputValue(inputs[4], '110% CDI');
    setInputValue(inputs[5], '2026-01-10');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'CDB Banco X',
        broker: 'XP Investimentos',
        amount: 123456,
        yield: '110% CDI',
        investedDate: '2026-01-10',
      }),
    );
  });
});
