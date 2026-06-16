import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideUserPlus } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { passwordMatchValidator } from '../../shared/utils/validators';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, LucideUserPlus],
  template: `
    <section class="auth-screen">
      <article class="auth-card">
        <p class="eyebrow">Invest App</p>
        <h1>Criar conta</h1>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-stack">
          <label class="field">
            <span>Nome</span>
            <input formControlName="name" autocomplete="name" placeholder="Seu nome" />
            @if (showError('name')) {
              <small>Nome deve ter pelo menos 2 caracteres</small>
            }
          </label>

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
              autocomplete="new-password"
              placeholder="Minimo de 6 caracteres"
            />
            @if (showError('password')) {
              <small>Senha deve ter pelo menos 6 caracteres</small>
            }
          </label>

          <label class="field">
            <span>Confirmar senha</span>
            <input
              type="password"
              formControlName="confirmPassword"
              autocomplete="new-password"
              placeholder="Repita sua senha"
            />
            @if (showError('confirmPassword') || form.hasError('passwordMismatch')) {
              <small>As senhas nao conferem</small>
            }
          </label>

          @if (actionError()) {
            <div class="alert alert-error">{{ actionError() }}</div>
          }
          @if (actionSuccess()) {
            <div class="alert alert-success">{{ actionSuccess() }}</div>
          }

          <button type="submit" class="button button-primary full" [disabled]="isSubmitting()">
            <svg lucideUserPlus size="16" />
            {{ isSubmitting() ? 'Criando conta' : 'Criar conta' }}
          </button>
        </form>

        <p class="auth-switch">
          Ja tem conta?
          <a routerLink="/login">Entrar</a>
        </p>
      </article>
    </section>
  `,
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly actionError = signal<string | null>(null);
  protected readonly actionSuccess = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  protected showError(controlName: keyof typeof this.form.controls) {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    try {
      this.isSubmitting.set(true);
      this.actionError.set(null);
      this.actionSuccess.set(null);
      const { name, email, password } = this.form.getRawValue();
      const result = await this.auth.register({ name, email, password });

      if (!result.signedIn) {
        this.actionSuccess.set('Cadastro criado. Verifique seu email para confirmar a conta.');
        return;
      }

      await this.router.navigateByUrl('/');
    } catch (error) {
      this.actionError.set(
        error instanceof Error ? error.message : 'Nao foi possivel criar o cadastro',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
