import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  const render = async (user: unknown = null) => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { user: signal(user) } }],
    });

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('renders hero and feature cards', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Acompanhe sua carteira sem planilhas soltas.');
    expect(text).toContain('Carteira centralizada');
    expect(text).toContain('Valores discretos');
    expect(text).toContain('R$ 184.250,00');
    expect(text).toContain('Tesouro IPCA+ 2045');
  });

  it('points CTAs to auth routes when anonymous', async () => {
    const fixture = await render();
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>,
    ).map((link) => link.getAttribute('href'));

    expect(links).toContain('/register');
    expect(links).toContain('/login');
  });

  it('points CTAs to private routes when authenticated', async () => {
    const fixture = await render({ id: 'user-1' });
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>,
    ).map((link) => link.getAttribute('href'));

    expect(links).toContain('/dashboard');
    expect(links).toContain('/investments');
  });
});
