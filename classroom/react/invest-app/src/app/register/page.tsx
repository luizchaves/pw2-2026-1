'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { useAuth } from '@/contexts/auth';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200';
const labelClass =
  'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const errorClass = 'mt-1 text-xs text-red-500';

export default function RegisterPage() {
  const router = useRouter();
  const { register: createAccount } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      setActionSuccess(null);
      const result = await createAccount({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!result.signedIn) {
        setActionSuccess(
          'Cadastro criado. Verifique seu email para confirmar a conta.',
        );
        return;
      }

      router.replace('/');
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar o cadastro',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          Invest App
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
          Criar conta
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className={labelClass}>Nome</label>
            <input
              {...register('name')}
              autoComplete="name"
              className={inputClass}
              placeholder="Seu nome"
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="voce@email.com"
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Senha</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="Minimo de 6 caracteres"
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Confirmar senha</label>
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="Repita sua senha"
            />
            {errors.confirmPassword && (
              <p className={errorClass}>{errors.confirmPassword.message}</p>
            )}
          </div>
          {actionError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {actionSuccess}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? 'Criando conta' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Já tem conta?{' '}
          <Link href="/login" className="font-semibold text-sky-700">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
