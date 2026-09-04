import Image from 'next/image';

import { TrackedLink } from '@/components/TrackedLink';
import type { AffiliateLink } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export function AffiliateCard({ item }: { item: AffiliateLink }) {
  const price = formatPrice(item.price);

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-white/10">
            ◈
          </div>
        )}

        {item.featured ? (
          <span className="badge absolute left-3 top-3 bg-neon text-white shadow-lg">Destaque</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {item.store ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{item.store}</p>
        ) : null}

        <h3 className="font-display text-lg font-semibold leading-snug text-white">{item.name}</h3>

        {item.description ? (
          <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
        ) : null}

        <div className="mt-auto space-y-3 pt-2">
          {price || item.coupon ? (
            <div className="flex flex-wrap items-center gap-2">
              {price ? (
                <span className="font-display text-xl font-bold text-white">{price}</span>
              ) : null}
              {item.coupon ? (
                <span className="badge border border-dashed border-accent/50 bg-accent/10 text-accent">
                  Cupom: {item.coupon}
                </span>
              ) : null}
            </div>
          ) : null}

          <TrackedLink
            href={item.affiliate_url}
            linkType="affiliate"
            linkId={item.id}
            label={item.name}
            className="btn-primary w-full"
          >
            Ver oferta
            <span aria-hidden="true">→</span>
          </TrackedLink>
        </div>
      </div>
    </article>
  );
}
