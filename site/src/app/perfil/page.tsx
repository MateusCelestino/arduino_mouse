import type { Metadata } from 'next';
import Image from 'next/image';

import { LinkButton } from '@/components/site/LinkButton';
import { EmptyState, Section } from '@/components/site/Section';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SocialCard } from '@/components/site/SocialCard';
import { getCustomLinks, getProfile, getSiteSettings, getSocialLinks } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);

  return {
    title: 'Perfil',
    description: profile.bio || settings.seo_description,
    alternates: { canonical: '/perfil' },
    openGraph: {
      title: `Perfil | ${settings.site_name}`,
      description: profile.bio || settings.seo_description,
      url: '/perfil',
    },
  };
}

export default async function PerfilPage() {
  const [profile, settings, socials, links] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getSocialLinks(),
    getCustomLinks(),
  ]);

  return (
    <>
      <SiteHeader siteName={settings.site_name} live={profile.live_status} />

      <main>
        <section className="relative border-b border-white/5">
          <div className="relative h-44 w-full overflow-hidden bg-base-900 sm:h-60">
            {profile.banner_url ? (
              <Image
                src={profile.banner_url}
                alt="Banner do perfil"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-neon-dim/40 via-base-900 to-accent-dim/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base-950 to-transparent" />
          </div>

          <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
            <div className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16">
              <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-base-950 bg-base-800 shadow-glow">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    width={112}
                    height={112}
                    priority
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-neon">
                    {profile.display_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                  {profile.display_name}
                </h1>
                <p className="text-sm text-neon-soft">@{profile.username}</p>
              </div>

              {profile.live_status ? (
                <span className="badge bg-red-500/15 text-red-300">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
                  AO VIVO AGORA
                </span>
              ) : null}

              {profile.bio ? (
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {profile.bio}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {profile.favorite_games.length > 0 ? (
          <Section
            eyebrow="Na live"
            title="Jogos que eu faço live"
            description="Os títulos que aparecem com mais frequência nas transmissões."
          >
            <div className="flex flex-wrap gap-2.5">
              {profile.favorite_games.map((game) => (
                <span
                  key={game}
                  className="badge border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {game}
                </span>
              ))}
            </div>
          </Section>
        ) : null}

        <Section eyebrow="Redes" title="Minhas redes">
          {socials.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socials.map((social) => (
                <SocialCard key={social.id} link={social} />
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhuma rede social cadastrada ainda." />
          )}
        </Section>

        {links.length > 0 ? (
          <Section eyebrow="Extras" title="Outros links">
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <LinkButton key={link.id} link={link} />
              ))}
            </div>
          </Section>
        ) : null}
      </main>

      <SiteFooter siteName={settings.site_name} notice={settings.affiliate_notice} />
    </>
  );
}
