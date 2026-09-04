import Image from 'next/image';

import { TrackedLink } from '@/components/TrackedLink';
import type { Profile, SocialLink } from '@/lib/types';

interface HeroProps {
  profile: Profile;
  headline: string;
  /** Link usado no botao principal quando o perfil nao define um. */
  fallbackLive?: SocialLink | null;
}

export function Hero({ profile, headline, fallbackLive }: HeroProps) {
  const liveUrl = profile.live_url ?? fallbackLive?.url ?? null;
  const initials = profile.display_name.slice(0, 2).toUpperCase();

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {profile.banner_url ? (
        <div className="absolute inset-0">
          <Image
            src={profile.banner_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-base-950/60 via-base-950/85 to-base-950" />
        </div>
      ) : null}

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-10 md:text-left">
          <div className="relative shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border border-white/15 bg-base-800 shadow-glow sm:h-32 sm:w-32">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  width={128}
                  height={128}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-neon">
                  {initials}
                </div>
              )}
            </div>

            {profile.live_status ? (
              <span className="badge absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                AO VIVO
              </span>
            ) : null}
          </div>

          <div className="max-w-2xl space-y-4">
            <div className="space-y-2">
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {profile.display_name}
              </h1>
              <p className="text-sm font-medium text-neon-soft">@{profile.username}</p>
            </div>

            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              {profile.headline || headline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 md:justify-start">
              {liveUrl ? (
                <TrackedLink
                  href={liveUrl}
                  linkType="live"
                  label={profile.live_status ? 'Assistir Live (ao vivo)' : 'Assistir Live'}
                  className="btn-primary px-6 py-3 text-base shadow-glow"
                >
                  {profile.live_status ? (
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse-live" />
                  ) : null}
                  {profile.live_button_text || 'Assistir Live'}
                </TrackedLink>
              ) : null}

              <a href="#redes" className="btn-secondary px-6 py-3 text-base">
                Ver meus canais
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
