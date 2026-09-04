'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseEnv } from './env';

let cached: SupabaseClient | null = null;

/** Cliente Supabase para componentes do navegador. */
export function createBrowserSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const env = getSupabaseEnv();
  if (!env) return null;

  cached = createBrowserClient(env.url, env.anonKey);
  return cached;
}
