import { PlatformIcon, accentFor, iconKeyFor } from '@/components/PlatformIcon';
import { TrackedLink } from '@/components/TrackedLink';
import type { SocialLink } from '@/lib/types';

export function SocialCard({ link }: { link: SocialLink }) {
  const iconKey = link.icon && link.icon !== 'link' ? link.icon : iconKeyFor(link.platform);
  const accent = accentFor(iconKey);

  return (
    <article className="card card-hover group relative flex flex-col gap-4 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 transition group-hover:scale-105"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <PlatformIcon name={iconKey} className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-white">{link.platform}</h3>
          {link.username ? (
            <p className="truncate text-sm text-slate-400">@{link.username}</p>
          ) : null}
        </div>
      </div>

      {link.description ? (
        <p className="text-sm leading-relaxed text-slate-400">{link.description}</p>
      ) : null}

      <TrackedLink
        href={link.url}
        linkType="social"
        linkId={link.id}
        label={link.platform}
        className="btn-secondary mt-auto w-full"
        style={{ borderColor: `${accent}55` }}
      >
        Acessar
        <span aria-hidden="true">→</span>
      </TrackedLink>
    </article>
  );
}
