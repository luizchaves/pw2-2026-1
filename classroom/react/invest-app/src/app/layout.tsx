import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AppShell from '@/components/AppShell';
import { AuthProvider } from '@/context/auth';
import { AppQueryClientProvider } from '@/context/query-client';
import { VisibilityProvider } from '@/context/visibility';
import '@/app/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Invest App',
  description: 'Controle pessoal de investimentos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-slate-50 text-slate-900">
        <AppQueryClientProvider>
          <AuthProvider>
            <VisibilityProvider>
              <AppShell>{children}</AppShell>
            </VisibilityProvider>
          </AuthProvider>
        </AppQueryClientProvider>
      </body>
    </html>
  );
}
