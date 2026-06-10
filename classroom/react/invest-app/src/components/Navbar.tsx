'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useVisibility } from '@/stores/visibility';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { showValues, handleToggleShowValues } = useVisibility();
  const { user, logout } = useAuth();
  const router = useRouter();
  const displayName =
    typeof user?.user_metadata.name === 'string'
      ? user.user_metadata.name
      : user?.email;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return (
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Invest App
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              render={<Link href="/login" />}
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
            <Button
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
              render={<Link href="/register" />}
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </Button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900"
        >
          Invest App
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Dashboard
          </Link>
          <Link
            href="/investments"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Investimentos
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {displayName && (
            <span className="hidden max-w-44 truncate text-sm font-medium text-slate-600 sm:inline">
              {displayName}
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={handleToggleShowValues}
            className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={showValues ? 'Ocultar valores' : 'Exibir valores'}
          >
            {showValues ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={handleLogout}
            className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
