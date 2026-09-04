import 'server-only';

import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

import { createServerSupabase } from '@/lib/supabase/server';

export interface AdminSession {
  supabase: SupabaseClient;
  user: User;
  isAdmin: boolean;
}

/** Sessao atual do painel, ou `null` se ninguem estiver logado. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: Boolean(data) };
}

/**
 * Garante que quem chamou esta logado e liberado como admin.
 * Usada pelas Server Actions antes de qualquer escrita.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) redirect('/login');
  if (!session.isAdmin) throw new Error('Sua conta não tem permissão de administrador.');

  return session;
}
