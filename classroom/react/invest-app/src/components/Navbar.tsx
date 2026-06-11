'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, LogOut, UserCircle, UserPlus } from 'lucide-react';
import { useVisibility } from '@/stores/visibility';
import { useAuth } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

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
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Invest App
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants(),
                'rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500',
              )}
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900"
        >
          Invest App
        </Link>

        <NavigationMenu className="hidden flex-1 md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/dashboard" />}
                className="px-3 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/investments" />}
                className="px-3 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Investimentos
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'max-w-52 rounded-full px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <UserCircle className="h-4 w-4" />
              {displayName && (
                <span className="hidden truncate sm:inline">{displayName}</span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                {displayName && (
                  <DropdownMenuLabel className="truncate text-slate-900">
                    {displayName}
                  </DropdownMenuLabel>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
