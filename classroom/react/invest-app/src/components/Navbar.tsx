import Link from 'next/link';

export default function Navbar() {
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
        {/* <Link
          href="/"
          className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
        >
          Entrar
        </Link> */}
      </nav>
    </header>
  );
}
