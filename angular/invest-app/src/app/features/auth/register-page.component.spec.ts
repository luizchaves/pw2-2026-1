import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../core/services/auth.service';
import { RegisterPageComponent } from './register-page.component';

const setValue = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input'));
};

describe('RegisterPageComponent', () => {
  const render = async (register = vi.fn().mockResolvedValue({ signedIn: true })) => {
    const navigateByUrl = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { register } }],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockImplementation(navigateByUrl);
    const fixture = TestBed.createComponent(RegisterPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, register, navigateByUrl };
  };

  const fillForm = (
    fixture: ReturnType<typeof TestBed.createComponent<RegisterPageComponent>>,
    confirm = 'segredo123',
  ) => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    setValue(inputs[0], 'Maria Investidora');
    setValue(inputs[1], 'maria@email.com');
    setValue(inputs[2], 'segredo123');
    setValue(inputs[3], confirm);
  };

  it('renders all register fields', async () => {
    const { fixture } = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Criar conta');
    expect(fixture.nativeElement.querySelector('[placeholder="Seu nome"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[placeholder="Repita sua senha"]')).toBeTruthy();
  });

  it('validates mismatched passwords', async () => {
    const { fixture, register } = await render();

    fillForm(fixture, 'diferente123');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('As senhas nao conferem');
    expect(register).not.toHaveBeenCalled();
  });

  it('creates account and redirects when signed in', async () => {
    const { fixture, register, navigateByUrl } = await render();

    fillForm(fixture);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(register).toHaveBeenCalledWith({
      name: 'Maria Investidora',
      email: 'maria@email.com',
      password: 'segredo123',
    });
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('shows email confirmation message when there is no session', async () => {
    const register = vi.fn().mockResolvedValue({ signedIn: false });
    const { fixture, navigateByUrl } = await render(register);

    fillForm(fixture);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Cadastro criado. Verifique seu email para confirmar a conta.',
    );
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('shows register error on failure', async () => {
    const register = vi.fn().mockRejectedValue(new Error('Email ja cadastrado'));
    const { fixture, navigateByUrl } = await render(register);

    fillForm(fixture);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email ja cadastrado');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
