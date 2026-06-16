'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type LoginFormData, loginSchema } from '@/schemas/auth';
import { useAuth } from '@/stores/auth';

const inputClass =
  'h-11 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-200';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const errorClass = 'mt-1 text-xs text-red-500';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      await login(data.email, data.password);
      router.replace('/');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-slate-200 bg-white p-8 py-8 shadow-sm">
        <CardHeader className="px-0">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Invest App
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Entrar</h1>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="login-email" className={labelClass}>
                Email
              </Label>
              <Input
                id="login-email"
                {...register('email')}
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
                placeholder="voce@email.com"
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="login-password" className={labelClass}>
                Senha
              </Label>
              <Input
                id="login-password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                className={inputClass}
                placeholder="Sua senha"
              />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>
            {actionError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {actionError}
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? 'Entrando' : 'Entrar'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Ainda não tem conta?{' '}
            <Link href="/register" className="font-semibold text-sky-700">
              Criar cadastro
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
