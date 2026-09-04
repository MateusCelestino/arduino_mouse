import type { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/admin/LoginForm';
import { getSiteSettings } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const [{ redirect }, settings] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            {settings.site_name}
          </Link>
          <p className="text-sm text-slate-400">Painel administrativo</p>
        </div>

        {isSupabaseConfigured() ? null : (
          <p className="card border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
            O Supabase ainda não foi conectado. Preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no <code>.env.local</code>.
          </p>
        )}

        <LoginForm redirectTo={redirect ?? '/admin'} />

        <p className="text-center text-xs text-slate-600">
          <Link href="/" className="transition hover:text-slate-400">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
