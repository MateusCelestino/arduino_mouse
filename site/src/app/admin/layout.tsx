import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { signOut } from '@/app/login/actions';
import { getAdminSession } from '@/lib/admin/auth';

export const metadata: Metadata = {
  title: 'Painel Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) redirect('/login?redirect=/admin');

  if (!session.isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-md space-y-4 p-7 text-center">
          <h1 className="font-display text-xl font-bold text-white">Sem permissão</h1>
          <p className="text-sm leading-relaxed text-slate-400">
            A conta <strong className="text-slate-200">{session.user.email}</strong> está autenticada,
            mas não está liberada como administradora. Insira o ID dela na tabela{' '}
            <code className="text-neon-soft">admin_users</code> — veja o README, seção “Criar o
            usuário Admin”.
          </p>
          <p className="rounded-lg bg-base-900 px-3 py-2 text-xs text-slate-500">
            user_id: {session.user.id}
          </p>
          <form action={signOut}>
            <button type="submit" className="btn-secondary w-full">
              Sair
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar email={session.user.email ?? ''} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
