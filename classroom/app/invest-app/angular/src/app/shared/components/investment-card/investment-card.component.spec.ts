import type { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { mockInvestments } from '../../../testing/investment-fixtures';
import { InvestmentCardComponent } from './investment-card.component';

describe('InvestmentCardComponent', () => {
  const render = async (showValues = true, index = 0) => {
    const fixture = TestBed.createComponent(InvestmentCardComponent);
    const componentRef: ComponentRef<InvestmentCardComponent> = fixture.componentRef;
    componentRef.setInput('investment', mockInvestments[index]);
    componentRef.setInput('showValues', showValues);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('renders investment details', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Tesouro IPCA+ 2045');
    expect(text).toContain('XP Investimentos');
    expect(text).toContain('IPCA + 5%');
    expect(text).toContain('Renda Fixa');
    expect(text).toMatch(/1\.000,00/);
  });

  it('hides amount when showValues is false', async () => {
    const fixture = await render(false);
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('••••••••');
    expect(text).not.toMatch(/1\.000,00/);
  });

  it('shows fallback values for optional yield and due date', async () => {
    const fixture = await render(true, 1);
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Nao informado');
    expect(text).toContain('Sem vencimento');
    expect(text).toContain('Renda Variável');
  });

  it('emits edit and remove events', async () => {
    const fixture = await render();
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();

    expect(edit).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });
});
