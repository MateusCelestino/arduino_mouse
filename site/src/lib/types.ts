export type LinkType = 'social' | 'custom' | 'affiliate' | 'live';

export interface Profile {
  id: string;
  display_name: string;
  username: string;
  bio: string;
  headline: string;
  avatar_url: string | null;
  banner_url: string | null;
  live_status: boolean;
  live_url: string | null;
  live_button_text: string;
  favorite_games: string[];
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  description: string;
  icon: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CustomLink {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface AffiliateLink {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  store: string;
  price: number | null;
  coupon: string | null;
  affiliate_url: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string | null;
  position: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClickEvent {
  id: string;
  link_id: string | null;
  link_type: LinkType;
  label: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  headline: string;
  description: string;
  theme: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string | null;
  affiliate_notice: string;
  created_at: string;
  updated_at: string;
}
