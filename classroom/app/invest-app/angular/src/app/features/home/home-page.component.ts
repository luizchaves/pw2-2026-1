import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideBell,
  LucideEyeOff,
  LucideLockKeyhole,
  LucideWalletCards,
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

const features = [
  {
    title: 'Carteira centralizada',
    description: 'Organize ativos, corretoras, datas e valores em uma visao unica.',
    icon: 'wallet',
  },
  {
    title: 'Acesso privado',
    description: 'Cada investimento fica vinculado ao usuario autenticado.',
    icon: 'lock',
  },
  {
    title: 'Valores discretos',
    description: 'Oculte montantes rapidamente quando estiver em publico.',
    icon: 'eye',
  },
  {
    title: 'Vencimentos claros',
    description: 'Acompanhe datas importantes antes que elas passem despercebidas.',
    icon: 'bell',
  },
];

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    LucideArrowRight,
    LucideBell,
    LucideEyeOff,
    LucideLockKeyhole,
    LucideWalletCards,
  ],
  template: `
    <section class="hero-section">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Invest App</p>
          <h1>Acompanhe sua carteira sem planilhas soltas.</h1>
          <p class="hero-copy">
            Cadastre seus investimentos, visualize o patrimonio e mantenha datas de aporte e
            vencimento em um painel simples para uso diario.
          </p>
          <div class="hero-actions">
            <a [routerLink]="auth.user() ? '/dashboard' : '/register'" class="button button-primary">
              {{ auth.user() ? 'Abrir dashboard' : 'Criar conta' }}
              <svg lucideArrowRight size="16" />
            </a>
            <a [routerLink]="auth.user() ? '/investments' : '/login'" class="button button-outline">
              {{ auth.user() ? 'Ver investimentos' : 'Entrar' }}
            </a>
          </div>
        </div>

        <div class="portfolio-preview">
          <div class="preview-card">
            <div class="preview-header">
              <div>
                <p class="eyebrow compact">Resumo</p>
                <strong>R$ 184.250,00</strong>
              </div>
              <span class="success-chip">+12 ativos</span>
            </div>
            <div class="preview-list">
              @for (item of previewItems; track item.name) {
                <article class="preview-item">
                  <div>
                    <h2>{{ item.name }}</h2>
                    <p>{{ item.yield }}</p>
                  </div>
                  <div class="text-right">
                    <span>Venc.</span>
                    <strong>{{ item.dueDate }}</strong>
                  </div>
                </article>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-band">
      <div class="feature-grid">
        @for (feature of features; track feature.title) {
          <article class="feature-card">
            @switch (feature.icon) {
              @case ('wallet') {
                <svg lucideWalletCards size="22" />
              }
              @case ('lock') {
                <svg lucideLockKeyhole size="22" />
              }
              @case ('eye') {
                <svg lucideEyeOff size="22" />
              }
              @default {
                <svg lucideBell size="22" />
              }
            }
            <h2>{{ feature.title }}</h2>
            <p>{{ feature.description }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export class HomePageComponent {
  protected readonly auth = inject(AuthService);
  protected readonly features = features;
  protected readonly previewItems = [
    { name: 'Tesouro IPCA+ 2045', yield: 'IPCA + 5%', dueDate: '15/08/2045' },
    { name: 'CDB Banco X', yield: '110% CDI', dueDate: '02/01/2027' },
    { name: 'FII Logistica', yield: 'Renda variavel', dueDate: 'Sem vencimento' },
  ];
}
