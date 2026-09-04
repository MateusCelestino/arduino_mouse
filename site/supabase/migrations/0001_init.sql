-- ===========================================================================
-- ZeroVolumeMateus — schema inicial
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
-- Somente usuarios listados aqui podem escrever no banco.
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Trigger util: updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (linha unica com os dados do streamer)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key default gen_random_uuid(),
  display_name     text        not null default 'ZeroVolumeMateus',
  username         text        not null default 'zerovolumemateus',
  bio              text        not null default '',
  headline         text        not null default '',
  avatar_url       text,
  banner_url       text,
  live_status      boolean     not null default false,
  live_url         text,
  live_button_text text        not null default 'Assistir Live',
  favorite_games   text[]      not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- social_links
-- ---------------------------------------------------------------------------
create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  platform    text        not null,
  username    text        not null default '',
  url         text        not null,
  description text        not null default '',
  icon        text        not null default 'link',
  active      boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists social_links_order_idx on public.social_links (active, sort_order);

drop trigger if exists social_links_set_updated_at on public.social_links;
create trigger social_links_set_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- custom_links
-- ---------------------------------------------------------------------------
create table if not exists public.custom_links (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null default '',
  url         text        not null,
  image_url   text,
  active      boolean     not null default true,
  featured    boolean     not null default false,
  sort_order  integer     not null default 0,
  click_count integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists custom_links_order_idx on public.custom_links (active, sort_order);

drop trigger if exists custom_links_set_updated_at on public.custom_links;
create trigger custom_links_set_updated_at
  before update on public.custom_links
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- affiliate_links
-- ---------------------------------------------------------------------------
create table if not exists public.affiliate_links (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  description   text        not null default '',
  image_url     text,
  store         text        not null default '',
  price         numeric(12, 2),
  coupon        text,
  affiliate_url text        not null,
  featured      boolean     not null default false,
  active        boolean     not null default true,
  sort_order    integer     not null default 0,
  click_count   integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists affiliate_links_order_idx on public.affiliate_links (active, sort_order);

drop trigger if exists affiliate_links_set_updated_at on public.affiliate_links;
create trigger affiliate_links_set_updated_at
  before update on public.affiliate_links
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- banners
-- ---------------------------------------------------------------------------
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null default '',
  description text        not null default '',
  image_url   text        not null,
  link_url    text,
  position    text        not null default 'home',
  active      boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists banners_order_idx on public.banners (active, position, sort_order);

drop trigger if exists banners_set_updated_at on public.banners;
create trigger banners_set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- click_events
-- ---------------------------------------------------------------------------
create table if not exists public.click_events (
  id         uuid primary key default gen_random_uuid(),
  link_id    uuid,
  link_type  text        not null check (link_type in ('social', 'custom', 'affiliate', 'live')),
  label      text,
  referrer   text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists click_events_created_idx on public.click_events (created_at desc);
create index if not exists click_events_link_idx on public.click_events (link_type, link_id);

-- ---------------------------------------------------------------------------
-- site_settings (linha unica)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id               uuid primary key default gen_random_uuid(),
  site_name        text        not null default 'ZeroVolumeMateus',
  headline         text        not null default 'Lives de gameplay, todo dia.',
  description      text        not null default '',
  theme            text        not null default 'dark',
  seo_title        text        not null default 'ZeroVolumeMateus — Streamer na Twitch, Kick e YouTube',
  seo_description  text        not null default '',
  seo_keywords     text        not null default 'ZeroVolumeMateus, Twitch, Kick, YouTube, streamer, gaming',
  og_image_url     text,
  affiliate_notice text        not null default 'Alguns links desta pagina podem ser links de afiliado. Posso receber uma comissao sem custo adicional para voce.',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Registro de cliques (chamado pelo site publico, sem login)
-- ---------------------------------------------------------------------------
create or replace function public.register_click(
  p_link_id    uuid,
  p_link_type  text,
  p_label      text default null,
  p_referrer   text default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_link_type not in ('social', 'custom', 'affiliate', 'live') then
    raise exception 'link_type invalido: %', p_link_type;
  end if;

  insert into public.click_events (link_id, link_type, label, referrer, user_agent)
  values (p_link_id, p_link_type, left(p_label, 200), left(p_referrer, 500), left(p_user_agent, 500));

  if p_link_id is not null then
    if p_link_type = 'affiliate' then
      update public.affiliate_links set click_count = click_count + 1 where id = p_link_id;
    elsif p_link_type = 'custom' then
      update public.custom_links set click_count = click_count + 1 where id = p_link_id;
    end if;
  end if;
end;
$$;

revoke all on function public.register_click(uuid, text, text, text, text) from public;
grant execute on function public.register_click(uuid, text, text, text, text) to anon, authenticated;

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.admin_users     enable row level security;
alter table public.profiles        enable row level security;
alter table public.social_links    enable row level security;
alter table public.custom_links    enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.banners         enable row level security;
alter table public.click_events    enable row level security;
alter table public.site_settings   enable row level security;

-- admin_users: cada admin ve o proprio registro; ninguem escreve pela API.
drop policy if exists "admin_users_self_select" on public.admin_users;
create policy "admin_users_self_select" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

-- profiles
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select to anon, authenticated using (true);

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- social_links: visitante le apenas conteudo ativo.
drop policy if exists "social_links_public_read" on public.social_links;
create policy "social_links_public_read" on public.social_links
  for select to anon using (active);

drop policy if exists "social_links_admin_read" on public.social_links;
create policy "social_links_admin_read" on public.social_links
  for select to authenticated using (active or public.is_admin());

drop policy if exists "social_links_admin_write" on public.social_links;
create policy "social_links_admin_write" on public.social_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- custom_links
drop policy if exists "custom_links_public_read" on public.custom_links;
create policy "custom_links_public_read" on public.custom_links
  for select to anon using (active);

drop policy if exists "custom_links_admin_read" on public.custom_links;
create policy "custom_links_admin_read" on public.custom_links
  for select to authenticated using (active or public.is_admin());

drop policy if exists "custom_links_admin_write" on public.custom_links;
create policy "custom_links_admin_write" on public.custom_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- affiliate_links
drop policy if exists "affiliate_links_public_read" on public.affiliate_links;
create policy "affiliate_links_public_read" on public.affiliate_links
  for select to anon using (active);

drop policy if exists "affiliate_links_admin_read" on public.affiliate_links;
create policy "affiliate_links_admin_read" on public.affiliate_links
  for select to authenticated using (active or public.is_admin());

drop policy if exists "affiliate_links_admin_write" on public.affiliate_links;
create policy "affiliate_links_admin_write" on public.affiliate_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- banners
drop policy if exists "banners_public_read" on public.banners;
create policy "banners_public_read" on public.banners
  for select to anon using (active);

drop policy if exists "banners_admin_read" on public.banners;
create policy "banners_admin_read" on public.banners
  for select to authenticated using (active or public.is_admin());

drop policy if exists "banners_admin_write" on public.banners;
create policy "banners_admin_write" on public.banners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- click_events: escrita apenas via register_click(); leitura apenas para o admin.
drop policy if exists "click_events_admin_read" on public.click_events;
create policy "click_events_admin_read" on public.click_events
  for select to authenticated using (public.is_admin());

drop policy if exists "click_events_admin_delete" on public.click_events;
create policy "click_events_admin_delete" on public.click_events
  for delete to authenticated using (public.is_admin());
