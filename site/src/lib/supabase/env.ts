export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Le as variaveis do Supabase. Devolve `null` quando o projeto ainda nao foi
 * conectado, para que o site continue buildando e renderizando com os valores
 * padrao em vez de quebrar.
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
