import Image from 'next/image';

import type { Banner } from '@/lib/types';
import { normalizeUrl } from '@/lib/utils';

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((banner) => {
          const content = (
            <div className="card card-hover relative aspect-[21/9] overflow-hidden">
              <Image
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              {banner.title || banner.description ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-950 via-base-950/70 to-transparent p-5">
                  {banner.title ? (
                    <p className="font-display text-lg font-semibold text-white">{banner.title}</p>
                  ) : null}
                  {banner.description ? (
                    <p className="text-sm text-slate-300">{banner.description}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );

          return banner.link_url ? (
            <a
              key={banner.id}
              href={normalizeUrl(banner.link_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {content}
            </a>
          ) : (
            <div key={banner.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
