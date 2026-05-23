'use client';

import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useVisibility } from '@/context/visibility';

export default function Navbar() {
  const { showValues, handleToggleShowValues } = useVisibility();
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
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/investments"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Investimentos
          </Link>
        </div>
        <button
          onClick={handleToggleShowValues}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label={showValues ? 'Ocultar valores' : 'Exibir valores'}
        >
          {showValues ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </nav>
    </header>
  );
}
