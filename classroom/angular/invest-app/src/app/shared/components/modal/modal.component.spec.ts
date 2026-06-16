import type { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ModalComponent);
    const componentRef: ComponentRef<ModalComponent> = fixture.componentRef;
    componentRef.setInput('title', 'Meu Modal');
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('renders the title', async () => {
    const fixture = await render();

    expect(fixture.nativeElement.textContent).toContain('Meu Modal');
  });

  it('emits close from close button, backdrop and Escape', async () => {
    const fixture = await render();
    const close = vi.fn();
    fixture.componentInstance.close.subscribe(close);

    fixture.nativeElement.querySelector('button').click();
    fixture.nativeElement.querySelector('.modal-backdrop').click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(close).toHaveBeenCalledTimes(3);
  });

  it('does not emit close when the inner panel is clicked', async () => {
    const fixture = await render();
    const close = vi.fn();
    fixture.componentInstance.close.subscribe(close);

    fixture.nativeElement.querySelector('.modal-panel').click();

    expect(close).not.toHaveBeenCalled();
  });
});
