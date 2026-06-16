import type { Routes } from '@angular/router';
import { authOnlyGuard, guestOnlyGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('./features/auth/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('./features/auth/register-page.component').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authOnlyGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'investments',
    canActivate: [authOnlyGuard],
    loadComponent: () =>
      import('./features/investments/investments-page.component').then(
        (m) => m.InvestmentsPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
