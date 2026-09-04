import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseEnv } from './env';

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 * Retorna `null` quando as variaveis de ambiente ainda nao foram configuradas.
 */
export async function createServerSupabase(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado a partir de um Server Component: o middleware ja cuida
          // de renovar a sessao, entao e seguro ignorar.
        }
      },
    },
  });
}
