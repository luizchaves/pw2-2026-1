'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type RegisterFormData, registerSchema } from '@/schemas/auth';
import { useAuth } from '@/stores/auth';

const inputClass =
  'h-11 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-200';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
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
        setActionSuccess('Cadastro criado. Verifique seu email para confirmar a conta.');
        return;
      }

      router.replace('/');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível criar o cadastro');
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
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Criar conta
          </h1>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="register-name" className={labelClass}>
                Nome
              </Label>
              <Input
                id="register-name"
                {...register('name')}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
                placeholder="Seu nome"
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="register-email" className={labelClass}>
                Email
              </Label>
              <Input
                id="register-email"
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
              <Label htmlFor="register-password" className={labelClass}>
                Senha
              </Label>
              <Input
                id="register-password"
                {...register('password')}
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                className={inputClass}
                placeholder="Minimo de 6 caracteres"
              />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="register-confirm-password" className={labelClass}>
                Confirmar senha
              </Label>
              <Input
                id="register-confirm-password"
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? 'Criando conta' : 'Criar conta'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Já tem conta?{' '}
            <Link href="/login" className="font-semibold text-sky-700">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
