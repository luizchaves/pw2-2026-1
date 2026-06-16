import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../core/services/auth.service';
import { LoginPageComponent } from './login-page.component';

const setValue = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input'));
};

describe('LoginPageComponent', () => {
  const render = async (login = vi.fn().mockResolvedValue(undefined)) => {
    const navigateByUrl = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { login } }],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockImplementation(navigateByUrl);
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, login, navigateByUrl };
  };

  it('renders login form', async () => {
    const { fixture } = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Entrar');
    expect(fixture.nativeElement.querySelector('[placeholder="voce@email.com"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[placeholder="Sua senha"]')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { fixture, login } = await render();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Informe um email valido');
    expect(fixture.nativeElement.textContent).toContain('Senha e obrigatoria');
    expect(login).not.toHaveBeenCalled();
  });

  it('authenticates and redirects on success', async () => {
    const { fixture, login, navigateByUrl } = await render();
    const inputs = fixture.nativeElement.querySelectorAll('input');

    setValue(inputs[0], 'investidor@email.com');
    setValue(inputs[1], 'segredo123');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(login).toHaveBeenCalledWith('investidor@email.com', 'segredo123');
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('shows auth error on failure', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Credenciais invalidas'));
    const { fixture, navigateByUrl } = await render(login);
    const inputs = fixture.nativeElement.querySelectorAll('input');

    setValue(inputs[0], 'investidor@email.com');
    setValue(inputs[1], 'senhaerrada');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Credenciais invalidas');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
