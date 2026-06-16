import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authOnlyGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready();

  return auth.user() ? true : router.createUrlTree(['/login']);
};

export const guestOnlyGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready();

  return auth.user() ? router.createUrlTree(['/dashboard']) : true;
};
