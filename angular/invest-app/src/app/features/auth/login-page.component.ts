import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideLogIn } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, LucideLogIn],
  template: `
    <section class="auth-screen">
      <article class="auth-card">
        <p class="eyebrow">Invest App</p>
        <h1>Entrar</h1>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-stack">
          <label class="field">
            <span>Email</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="email"
              placeholder="voce@email.com"
            />
            @if (showError('email')) {
              <small>Informe um email valido</small>
            }
          </label>

          <label class="field">
            <span>Senha</span>
            <input
              type="password"
              formControlName="password"
              autocomplete="current-password"
              placeholder="Sua senha"
            />
            @if (showError('password')) {
              <small>Senha e obrigatoria</small>
            }
          </label>

          @if (actionError()) {
            <div class="alert alert-error">{{ actionError() }}</div>
          }

          <button type="submit" class="button button-primary full" [disabled]="isSubmitting()">
            <svg lucideLogIn size="16" />
            {{ isSubmitting() ? 'Entrando' : 'Entrar' }}
          </button>
        </form>

        <p class="auth-switch">
          Ainda nao tem conta?
          <a routerLink="/register">Criar cadastro</a>
        </p>
      </article>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly actionError = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected showError(controlName: 'email' | 'password') {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    try {
      this.isSubmitting.set(true);
      this.actionError.set(null);
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      await this.router.navigateByUrl('/');
    } catch (error) {
      this.actionError.set(error instanceof Error ? error.message : 'Nao foi possivel entrar');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
