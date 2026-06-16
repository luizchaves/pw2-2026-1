import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../../core/services/auth.service';
import { VisibilityService } from '../../../core/services/visibility.service';
import { NavbarComponent } from './navbar.component';

const render = async (user: unknown = null, showValues = true) => {
  const authUser = signal(user);
  const displayName = signal(user ? 'Joao Silva' : undefined);
  const visibilityValue = signal(showValues);
  const logout = vi.fn().mockResolvedValue(undefined);
  const toggleValues = vi.fn(() => visibilityValue.update((value) => !value));
  const navigateByUrl = vi.fn().mockResolvedValue(true);

  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          user: authUser,
          displayName,
          logout,
        },
      },
      {
        provide: VisibilityService,
        useValue: {
          showValues: visibilityValue,
          toggleValues,
        },
      },
    ],
  });

  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigateByUrl').mockImplementation(navigateByUrl);
  const fixture = TestBed.createComponent(NavbarComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, logout, toggleValues, navigateByUrl };
};

describe('NavbarComponent unauthenticated', () => {
  it('renders login and register links', async () => {
    const { fixture } = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Entrar');
    expect(text).toContain('Cadastrar');
    expect(text).not.toContain('Dashboard');
    expect(text).not.toContain('Investimentos');
  });
});

describe('NavbarComponent authenticated', () => {
  const user = { email: 'user@example.com', user_metadata: { name: 'Joao Silva' } };

  it('renders private links and display name', async () => {
    const { fixture } = await render(user);
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).toContain('Investimentos');
    expect(text).toContain('Joao Silva');
  });

  it('toggles visibility', async () => {
    const { fixture, toggleValues } = await render(user);

    fixture.nativeElement.querySelector('.icon-button').click();

    expect(toggleValues).toHaveBeenCalledOnce();
  });

  it('logs out and redirects to login', async () => {
    const { fixture, logout, navigateByUrl } = await render(user);

    fixture.nativeElement.querySelector('.danger').click();
    await fixture.whenStable();

    expect(logout).toHaveBeenCalledOnce();
    expect(navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
