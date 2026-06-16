import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideEye,
  LucideEyeOff,
  LucideLogIn,
  LucideLogOut,
  LucideUserCircle,
  LucideUserPlus,
} from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { VisibilityService } from '../../../core/services/visibility.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideEye,
    LucideEyeOff,
    LucideLogIn,
    LucideLogOut,
    LucideUserCircle,
    LucideUserPlus,
  ],
  template: `
    <header class="topbar">
      <nav class="nav-container">
        <a routerLink="/" class="brand">Invest App</a>

        @if (auth.user()) {
          <div class="nav-links">
            <a routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
            <a routerLink="/investments" routerLinkActive="active-link">Investimentos</a>
          </div>
        }

        <div class="nav-actions">
          @if (auth.user()) {
            <button
              type="button"
              class="icon-button"
              [attr.aria-label]="visibility.showValues() ? 'Ocultar valores' : 'Exibir valores'"
              (click)="visibility.toggleValues()"
            >
              @if (visibility.showValues()) {
                <svg lucideEyeOff size="20" />
              } @else {
                <svg lucideEye size="20" />
              }
            </button>

            <div class="account-pill">
              <svg lucideUserCircle size="18" />
              <span>{{ auth.displayName() }}</span>
            </div>
            <button type="button" class="button button-ghost danger" (click)="logout()">
              <svg lucideLogOut size="16" />
              Sair
            </button>
          } @else {
            <a routerLink="/login" class="button button-ghost">
              <svg lucideLogIn size="16" />
              Entrar
            </a>
            <a routerLink="/register" class="button button-primary">
              <svg lucideUserPlus size="16" />
              Cadastrar
            </a>
          }
        </div>
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly visibility = inject(VisibilityService);
  private readonly router = inject(Router);

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
