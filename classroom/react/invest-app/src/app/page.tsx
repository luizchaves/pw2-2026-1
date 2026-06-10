'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  EyeOff,
  LockKeyhole,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '@/stores/auth';

const features = [
  {
    title: 'Carteira centralizada',
    description:
      'Organize ativos, corretoras, datas e valores em uma visao unica.',
    icon: WalletCards,
  },
  {
    title: 'Acesso privado',
    description: 'Cada investimento fica vinculado ao usuario autenticado.',
    icon: LockKeyhole,
  },
  {
    title: 'Valores discretos',
    description: 'Oculte montantes rapidamente quando estiver em publico.',
    icon: EyeOff,
  },
  {
    title: 'Vencimentos claros',
    description: 'Acompanhe datas importantes antes que elas passem despercebidas.',
    icon: Bell,
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const primaryHref = user ? '/dashboard' : '/register';
  const secondaryHref = user ? '/investments' : '/login';

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              Invest App
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Acompanhe sua carteira sem planilhas soltas.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Cadastre seus investimentos, visualize o patrimonio e mantenha
              datas de aporte e vencimento em um painel simples para uso diario.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
              >
                {user ? 'Abrir dashboard' : 'Criar conta'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                {user ? 'Ver investimentos' : 'Entrar'}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-200">
            <div className="rounded-xl bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                    Resumo
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    R$ 184.250,00
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  +12 ativos
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['Tesouro IPCA+ 2045', 'IPCA + 5%', '15/08/2045'],
                  ['CDB Banco X', '110% CDI', '02/01/2027'],
                  ['FII Logistica', 'Renda variavel', 'Sem vencimento'],
                ].map(([name, yieldText, dueDate]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{name}</p>
                      <p className="mt-1 text-xs font-medium text-emerald-700">
                        {yieldText}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                        Venc.
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <Icon className="h-5 w-5 text-sky-600" />
                  <h2 className="mt-4 text-base font-bold text-slate-950">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
