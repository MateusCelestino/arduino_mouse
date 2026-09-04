'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type AuthState } from '@/lib/admin/action-state';
import { createServerSupabase } from '@/lib/supabase/server';

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createServerSupabase();

  if (!supabase) {
    return {
      ok: false,
      message: 'Supabase não configurado. Preencha o arquivo .env.local antes de entrar.',
    };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirect') ?? '/admin');

  if (!email || !password) {
    return { ok: false, message: 'Informe e-mail e senha.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: 'E-mail ou senha inválidos.' };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo.startsWith('/') ? redirectTo : '/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/login');
}
