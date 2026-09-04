import type { Profile, SiteSettings } from './types';

const now = '1970-01-01T00:00:00.000Z';

/**
 * Valores usados apenas quando o Supabase ainda nao foi conectado ou a tabela
 * esta vazia. Em producao todo o conteudo vem do banco e e editavel no Admin.
 */
export const DEFAULT_PROFILE: Profile = {
  id: 'default',
  display_name: 'ZeroVolumeMateus',
  username: 'zerovolumemateus',
  bio: 'Streamer de gameplay. Configure sua bio no painel Admin.',
  headline: 'Lives de gameplay na Twitch, Kick e YouTube.',
  avatar_url: null,
  banner_url: null,
  live_status: false,
  live_url: null,
  live_button_text: 'Assistir Live',
  favorite_games: [],
  created_at: now,
  updated_at: now,
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  site_name: 'ZeroVolumeMateus',
  headline: 'Lives de gameplay, todo dia.',
  description: 'Canal oficial do streamer ZeroVolumeMateus. Twitch, Kick, YouTube, X e recomendacoes.',
  theme: 'dark',
  seo_title: 'ZeroVolumeMateus — Streamer na Twitch, Kick e YouTube',
  seo_description:
    'Acompanhe o ZeroVolumeMateus ao vivo na Twitch, Kick e YouTube. Links oficiais, redes sociais e produtos recomendados.',
  seo_keywords: 'ZeroVolumeMateus, Twitch, Kick, YouTube, streamer, gaming, live, gameplay',
  og_image_url: null,
  affiliate_notice:
    'Alguns links desta página podem ser links de afiliado. Posso receber uma comissão sem custo adicional para você.',
  created_at: now,
  updated_at: now,
};

/** Plataformas sugeridas no formulario de redes sociais (novas sao permitidas). */
export const SUGGESTED_PLATFORMS = [
  { platform: 'Twitch', icon: 'twitch' },
  { platform: 'Kick', icon: 'kick' },
  { platform: 'YouTube', icon: 'youtube' },
  { platform: 'X / Twitter', icon: 'x' },
  { platform: 'Instagram', icon: 'instagram' },
  { platform: 'TikTok', icon: 'tiktok' },
  { platform: 'Discord', icon: 'discord' },
] as const;

export const ICON_OPTIONS = [
  'twitch',
  'kick',
  'youtube',
  'x',
  'instagram',
  'tiktok',
  'discord',
  'link',
] as const;
