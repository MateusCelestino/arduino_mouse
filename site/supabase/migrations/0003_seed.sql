-- ===========================================================================
-- Seed inicial — conteudo de partida, todo editavel pelo painel Admin.
-- Idempotente: nao duplica se rodar de novo.
-- ===========================================================================

insert into public.profiles (display_name, username, bio, headline, live_status, live_button_text, favorite_games)
select
  'ZeroVolumeMateus',
  'zerovolumemateus',
  'Streamer de gameplay. Lives com muita conversa, ranked e zoeira. Passa la e cola no chat.',
  'Lives de gameplay na Twitch, Kick e YouTube.',
  false,
  'Assistir Live',
  array['Valorant', 'CS2', 'GTA RP', 'Rocket League']
where not exists (select 1 from public.profiles);

insert into public.site_settings (site_name, headline, description, seo_title, seo_description, seo_keywords)
select
  'ZeroVolumeMateus',
  'Lives de gameplay, todo dia.',
  'Canal oficial do streamer ZeroVolumeMateus. Twitch, Kick, YouTube, X e recomendacoes.',
  'ZeroVolumeMateus — Streamer na Twitch, Kick e YouTube',
  'Acompanhe o ZeroVolumeMateus ao vivo na Twitch, Kick e YouTube. Links oficiais, redes sociais e produtos recomendados.',
  'ZeroVolumeMateus, Twitch, Kick, YouTube, streamer, gaming, live, gameplay'
where not exists (select 1 from public.site_settings);

insert into public.social_links (platform, username, url, description, icon, active, sort_order)
select v.platform, v.username, v.url, v.description, v.icon, true, v.sort_order
from (values
  ('Twitch',      'zerovolumemateus', 'https://twitch.tv/zerovolumemateus',   'Lives diarias, ranked e interacao com o chat.', 'twitch',  1),
  ('Kick',        'zerovolumemateus', 'https://kick.com/zerovolumemateus',    'Transmissoes simultaneas e conteudo exclusivo.', 'kick',    2),
  ('YouTube',     'zerovolumemateus', 'https://youtube.com/@zerovolumemateus','Melhores momentos, VODs e videos editados.',     'youtube', 3),
  ('X / Twitter', 'zerovolumemateus', 'https://x.com/zerovolumemateus',       'Avisos de live, bastidores e novidades.',        'x',       4)
) as v(platform, username, url, description, icon, sort_order)
where not exists (select 1 from public.social_links);
