import 'server-only';

import { createServerSupabase } from './supabase/server';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './defaults';
import type {
  AffiliateLink,
  Banner,
  ClickEvent,
  CustomLink,
  Profile,
  SiteSettings,
  SocialLink,
} from './types';

/** Perfil do streamer (linha unica). */
export async function getProfile(): Promise<Profile> {
  const supabase = await createServerSupabase();
  if (!supabase) return DEFAULT_PROFILE;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<Profile>();

  return data ?? DEFAULT_PROFILE;
}

/** Configuracoes gerais do site (linha unica). */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabase();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<SiteSettings>();

  return data ?? DEFAULT_SETTINGS;
}

export async function getSocialLinks(onlyActive = true): Promise<SocialLink[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  let query = supabase.from('social_links').select('*');
  if (onlyActive) query = query.eq('active', true);

  const { data } = await query
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (data as SocialLink[] | null) ?? [];
}

export async function getCustomLinks(onlyActive = true): Promise<CustomLink[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  let query = supabase.from('custom_links').select('*');
  if (onlyActive) query = query.eq('active', true);

  const { data } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (data as CustomLink[] | null) ?? [];
}

export async function getAffiliateLinks(onlyActive = true): Promise<AffiliateLink[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  let query = supabase.from('affiliate_links').select('*');
  if (onlyActive) query = query.eq('active', true);

  const { data } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (data as AffiliateLink[] | null) ?? [];
}

export async function getBanners(position?: string, onlyActive = true): Promise<Banner[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  let query = supabase.from('banners').select('*');
  if (onlyActive) query = query.eq('active', true);
  if (position) query = query.eq('position', position);

  const { data } = await query
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (data as Banner[] | null) ?? [];
}

export interface DashboardStats {
  customLinks: number;
  affiliateLinks: number;
  activeSocials: number;
  totalClicks: number;
  clicksLast7Days: number;
  recentClicks: ClickEvent[];
}

/** Metricas do painel Admin. Requer usuario autenticado com permissao. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    customLinks: 0,
    affiliateLinks: 0,
    activeSocials: 0,
    totalClicks: 0,
    clicksLast7Days: 0,
    recentClicks: [],
  };

  const supabase = await createServerSupabase();
  if (!supabase) return empty;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [custom, affiliate, socials, clicks, recentWeek, recent] = await Promise.all([
    supabase.from('custom_links').select('id', { count: 'exact', head: true }),
    supabase.from('affiliate_links').select('id', { count: 'exact', head: true }),
    supabase.from('social_links').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('click_events').select('id', { count: 'exact', head: true }),
    supabase
      .from('click_events')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('click_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    customLinks: custom.count ?? 0,
    affiliateLinks: affiliate.count ?? 0,
    activeSocials: socials.count ?? 0,
    totalClicks: clicks.count ?? 0,
    clicksLast7Days: recentWeek.count ?? 0,
    recentClicks: (recent.data as ClickEvent[] | null) ?? [],
  };
}
