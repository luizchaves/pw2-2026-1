import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    @if (auth.isLoading()) {
      <main class="screen-center">
        <p class="muted-strong">Carregando</p>
      </main>
    } @else {
      <app-navbar />
      <main>
        <router-outlet />
      </main>
      <div class="toast-region" aria-live="polite" aria-label="Notificacoes">
        @for (toast of toast.messages(); track toast.id) {
          <button
            type="button"
            class="toast"
            [class.toast-error]="toast.type === 'error'"
            (click)="toastService.dismiss(toast.id)"
          >
            {{ toast.message }}
          </button>
        }
      </div>
    }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  protected readonly toast = this.toastService;
}
