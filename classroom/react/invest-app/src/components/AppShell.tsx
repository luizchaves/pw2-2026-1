'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/auth';
import { InvestmentsProvider } from '@/contexts/investments';

const publicRoutes = new Set(['/', '/login', '/register']);
const authRoutes = new Set(['/login', '/register']);

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

    if (user && authRoutes.has(pathname)) {
      router.replace('/dashboard');
    }
  }, [isLoading, isPublicRoute, pathname, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm font-semibold text-slate-500">Carregando</p>
      </main>
    );
  }

  if (isPublicRoute) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
      </>
    );
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
