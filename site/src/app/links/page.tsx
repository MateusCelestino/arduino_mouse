import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PlatformIcon, accentFor, iconKeyFor } from '@/components/PlatformIcon';
import { LinkButton } from '@/components/site/LinkButton';
import { TrackedLink } from '@/components/TrackedLink';
import { getAffiliateLinks, getCustomLinks, getProfile, getSiteSettings, getSocialLinks } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Links',
    description: `Todos os links oficiais do ${settings.site_name}: Twitch, Kick, YouTube, X e recomendações.`,
    alternates: { canonical: '/links' },
    openGraph: {
      title: `Links | ${settings.site_name}`,
      description: `Todos os links oficiais do ${settings.site_name}.`,
      url: '/links',
    },
  };
}

export default async function LinksPage() {
  const [profile, settings, socials, links, affiliates] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getSocialLinks(),
    getCustomLinks(),
    getAffiliateLinks(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-12 sm:py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/15 bg-base-800 shadow-glow">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              width={96}
              height={96}
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
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {profile.display_name}
          </h1>
          <p className="text-sm text-slate-400">@{profile.username}</p>
        </div>

        {profile.live_status ? (
          <span className="badge bg-red-500/15 text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
            AO VIVO AGORA
          </span>
        ) : null}

        {profile.headline ? (
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">{profile.headline}</p>
        ) : null}
      </header>

      <div className="mt-9 space-y-3">
        {socials.map((social) => {
          const iconKey = social.icon && social.icon !== 'link' ? social.icon : iconKeyFor(social.platform);
          const accent = accentFor(iconKey);

          return (
            <TrackedLink
              key={social.id}
              href={social.url}
              linkType="social"
              linkId={social.id}
              label={social.platform}
              className="card card-hover flex items-center gap-4 p-4"
              style={{ borderColor: `${accent}40` }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${accent}1f`, color: accent }}
              >
                <PlatformIcon name={iconKey} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">{social.platform}</span>
                {social.username ? (
                  <span className="block truncate text-sm text-slate-400">@{social.username}</span>
                ) : null}
              </span>
              <span className="text-slate-500" aria-hidden="true">
                →
              </span>
            </TrackedLink>
          );
        })}

        {links.map((link) => (
          <LinkButton key={link.id} link={link} />
        ))}

        {affiliates.length > 0 ? (
          <Link href="/#afiliados" className="card card-hover flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              ★
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">Produtos recomendados</span>
              <span className="block text-sm text-slate-400">
                {affiliates.length} {affiliates.length === 1 ? 'oferta ativa' : 'ofertas ativas'}
              </span>
            </span>
            <span className="text-slate-500" aria-hidden="true">
              →
            </span>
          </Link>
        ) : null}
      </div>

      <footer className="mt-auto pt-12 text-center">
        <p className="text-xs leading-relaxed text-slate-600">{settings.affiliate_notice}</p>
        <Link href="/" className="mt-4 inline-block text-xs text-slate-500 transition hover:text-slate-300">
          ← Voltar para o site
        </Link>
      </footer>
    </main>
  );
}
