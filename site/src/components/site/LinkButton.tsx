import Image from 'next/image';

import { TrackedLink } from '@/components/TrackedLink';
import type { CustomLink } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Botao estilo Linktree usado na pagina /links e na secao de links da Home. */
export function LinkButton({ link }: { link: CustomLink }) {
  return (
    <TrackedLink
      href={link.url}
      linkType="custom"
      linkId={link.id}
      label={link.title}
      className={cn(
        'card card-hover group flex w-full items-center gap-4 p-4 text-left',
        link.featured && 'border-neon/40 bg-neon/10',
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-base-800">
        {link.image_url ? (
          <Image
            src={link.image_url}
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg text-neon" aria-hidden="true">
            ◆
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-white">{link.title}</span>
        {link.description ? (
          <span className="block truncate text-sm text-slate-400">{link.description}</span>
        ) : null}
      </span>

      <span className="text-slate-500 transition group-hover:text-white" aria-hidden="true">
        →
      </span>
    </TrackedLink>
  );
}
