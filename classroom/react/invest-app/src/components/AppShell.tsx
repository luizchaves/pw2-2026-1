'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/auth';
import { InvestmentsProvider } from '@/context/investments';

const publicRoutes = new Set(['/login', '/register']);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isPublicRoute = publicRoutes.has(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isPublicRoute) {
      router.replace('/login');
    }

    if (user && isPublicRoute) {
      router.replace('/');
    }
  }, [isLoading, isPublicRoute, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm font-semibold text-slate-500">Carregando</p>
      </main>
    );
  }

  if (isPublicRoute) {
    return <main>{children}</main>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm font-semibold text-slate-500">Redirecionando</p>
      </main>
    );
  }

  return (
    <InvestmentsProvider>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </InvestmentsProvider>
  );
}
